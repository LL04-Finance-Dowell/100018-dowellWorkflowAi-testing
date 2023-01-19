import React from "react";
import workflowAiSettingsStyles from "../workflowAiSettings.module.css";
import { useForm } from "react-hook-form";
import SubmitButton from "../../submitButton/SubmitButton";
import InfoBox from "../../infoBox/InfoBox";

import { useDispatch, useSelector } from "react-redux";
import { setSettingProccess } from "../../../features/app/appSlice";
import { v4 as uuidv4 } from "uuid";

const EnabledDisabkedProcess = () => {
  const dispatch = useDispatch();
  const { column, permissionArray } = useSelector((state) => state.app);
  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    console.log("cplımnnnnnnnnn", column);
    dispatch(setSettingProccess({ _id: uuidv4(), column }));
  };

  console.log("aaaaaaaaaa", permissionArray);

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
            {item.title}
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
                    boxİd={childItem._id}
                    permissionContent={true}
                    register={register}
                    items={colItem.items}
                    title={colItem.proccess_title}
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
