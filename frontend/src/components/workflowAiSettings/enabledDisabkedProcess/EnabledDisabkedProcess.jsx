import React from "react";
import workflowAiSettingsStyles from "../workflowAiSettings.module.css";
import { useForm } from "react-hook-form";
import SubmitButton from "../../submitButton/SubmitButton";
import InfoBox from "../../infoBox/InfoBox";

import { useDispatch, useSelector } from "react-redux";
import {
  setColumn,
  setPermissionArray,
  setSettingProccess,
} from "../../../features/app/appSlice";
import { v4 as uuidv4 } from "uuid";
import { setIsSelected } from "../../../utils/helpers";
import { useTranslation } from "react-i18next";

const EnabledDisabkedProcess = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { column, permissionArray } = useSelector((state) => state.app);
  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    console.log("cplımnnnnnnnnn", column);
    dispatch(setSettingProccess({ _id: uuidv4(), column }));
  };

  console.log("aaaaaaaaaa", permissionArray);

  const handleOnChange = ({ item, title, boxId }) => {
    const isSelectedItems = setIsSelected({
      items: permissionArray[0].children,
      item,
      title,
      boxId,
    });

    dispatch(setPermissionArray(isSelectedItems));

    const ccb = column.find((c) => c.proccess_title === title);

    if (ccb) {
      dispatch(
        setColumn(
          column.map((col) =>
            col.proccess_title === title
              ? {
                  ...col,
                  items: col.items.find(
                    (childItem) => childItem._id === item._id
                  )
                    ? col.items.filter(
                        (childItem) => childItem._id !== item._id
                      )
                    : [
                        ...col.items,
                        {
                          _id: item._id,
                          content: item.content,
                          isSelected: false,
                        },
                      ],
                }
              : col
          )
        )
      );
    } else {
      dispatch(
        setColumn([
          ...column,
          {
            _id: uuidv4(),
            items: [
              { _id: item._id, content: item.content, isSelected: false },
            ],
            proccess_title: title,
            order: item.order,
          },
        ])
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={workflowAiSettingsStyles.form__cont}
    >
      {permissionArray.map((item) => (
        <div key={item._id} className={workflowAiSettingsStyles.box}>
          <h2
            className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
          >
            {t(item.title)}
          </h2>
          <div className={workflowAiSettingsStyles.section__container}>
            {item.children?.map((childItem) => (
              <div
                key={childItem._id}
                className={workflowAiSettingsStyles.section__box}
              >
                {childItem.column.map((colItem) => (
                  <InfoBox
                    key={colItem._id}
                    boxId={childItem._id}
                    register={register}
                    items={colItem.items}
                    title={colItem.proccess_title}
                    onChange={handleOnChange}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <SubmitButton className={workflowAiSettingsStyles.submit__button}>
        Update Enable/Disable Processes
      </SubmitButton>
    </form>
  );
};

export default EnabledDisabkedProcess;
