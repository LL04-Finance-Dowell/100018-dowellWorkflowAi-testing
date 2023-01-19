import React from "react";
import workflowAiSettingsStyles from "../workflowAiSettings.module.css";
import { useForm } from "react-hook-form";
import { processesInWorkflowAIArray } from "../veriables";
import SubmitButton from "../../submitButton/SubmitButton";
import InfoBox from "../../infoBox/InfoBox";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";

const EnabledProcess = () => {
  const dispatch = useDispatch();
  const { settingProccess, proccess } = useSelector((state) => state.app);

  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    console.log("dataaaaaaaaaa", data);
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

    console.log("payload", JSON.stringify(purePayload));
  };

  console.log(
    "setitnhhhhhhhhhh",
    settingProccess[0].children.filter((item, index) => index !== 0)
  );

  console.log("settinggggggggggg", settingProccess);

  return (
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
            {item.children &&
              item.children?.map((childItem) => (
                <div
                  key={childItem._id}
                  className={workflowAiSettingsStyles.section__box}
                >
                  {childItem.column.map((colItem) => (
                    <InfoBox
                      key={colItem._id}
                      boxİd={childItem._id}
                      settingProccess={true}
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
        Update Assigned Rights for Processes
      </SubmitButton>
    </form>
  );
};

export default EnabledProcess;
