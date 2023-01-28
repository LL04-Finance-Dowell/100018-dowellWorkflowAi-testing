import React, { useState } from "react";
import workflowAiSettingsStyles from "../workflowAiSettings.module.css";
import { useForm } from "react-hook-form";
import { processesInWorkflowAIArray } from "../veriables";
import SubmitButton from "../../submitButton/SubmitButton";
import InfoBox from "../../infoBox/InfoBox";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setUpdateProccess } from "../../../features/app/appSlice";
import { setIsSelected } from "../../../utils/helpers";

const EnabledProcess = () => {
  const dispatch = useDispatch();
  const { settingProccess, proccess } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);

  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    /* dispatch(setPro) */
    const filteredData = settingProccess[0].children.filter(
      (item, index) => index !== 0
    );

    const payload = filteredData.map((item) => ({
      ...item,
      column: item.column.map((col) =>
        col.type === "hardcode"
          ? col
          : { ...col, items: col.items.filter((colItem) => colItem.isSelected) }
      ),
    }));

    const purePayload = payload.map((item) => ({
      ...item,
      column: item.column.filter((col) => col.items.length !== 0),
    }));

    console.log("payload", purePayload);

    const createData = {
      company_id: userDetail?.portfolio_info[0]?.org_id,
      owner_name: userDetail?.portfolio_info[0]?.owner_name,
      username: userDetail?.portfolio_info[0]?.username,
      portfolio_name: "the portfolio name",
      proccess: purePayload,
    };

    console.log("createdata", JSON.stringify(createData));
  };

  const handleOnChange = ({ item, title, boxId }) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle === "portfolios") {
      console.log("item", title, item);
      setCurrentPortfolio(item._id);
    } else if (lowerCaseTitle === "teams") {
      console.log("teams", title);
    } else {
      const isSelectedItems = setIsSelected({
        items: settingProccess[0].children,
        item,
        boxId,
        title,
      });

      dispatch(setUpdateProccess(isSelectedItems));
    }
  };

  return (
    <>
      <form
        className={workflowAiSettingsStyles.form__cont}
        onSubmit={handleSubmit(onSubmit)}
      >
        {settingProccess?.map((item) => (
          <div key={item._id} className={workflowAiSettingsStyles.box}>
            <h2
              className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
            >
              {item.title}
            </h2>
            <div className={workflowAiSettingsStyles.section__container}>
              {item.children && (
                <>
                  <div
                    /*    key={colItem._id} */
                    className={workflowAiSettingsStyles.section__box}
                  >
                    {item.children[0].column.map((colItem) => (
                      <InfoBox
                        key={colItem._id}
                        type="radio"
                        /*  boxId={childItem._id} */
                        register={register}
                        items={colItem.items}
                        title={colItem.proccess_title}
                        onChange={handleOnChange}
                      />
                    ))}
                  </div>
                  <>
                    {item.children?.slice(1)?.map((childItem) => (
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
                  </>
                </>
              )}
            </div>
          </div>
        ))}
        <SubmitButton className={workflowAiSettingsStyles.submit__button}>
          Update Assigned Rights for Processes
        </SubmitButton>
      </form>
    </>
  );
};

export default EnabledProcess;
