import React from "react";
import { useForm } from "react-hook-form";
import InfoBox from "../../infoBox/InfoBox";
import { teamsInWorkflowAI } from "../veriables";
import workflowAiSettingsStyles from "../workflowAiSettings.module.css";

const TeamsInWorkflowAi = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className={workflowAiSettingsStyles.box}>
      <h2
        className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title_l}`}
      >
        {teamsInWorkflowAI[0].title}
      </h2>
      <div className={workflowAiSettingsStyles.section__container}>
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <div className={workflowAiSettingsStyles.section__box}>
            {teamsInWorkflowAI[0].children[0].column.map((colItem) => (
              <InfoBox
                register={register}
                items={colItem.child}
                title={colItem.childTitle}
              />
            ))}
          </div>
          <input type="submit" />
        </form>
        <div className={workflowAiSettingsStyles.section__box}>
          {teamsInWorkflowAI[0].children[1].column.map((colItem) => (
            <InfoBox
              register={register}
              items={colItem.child}
              title={colItem.childTitle}
            />
          ))}
        </div>
        <form>
          <div className={workflowAiSettingsStyles.section__box}>
            {teamsInWorkflowAI[0].children[2].column.map((colItem) => (
              <InfoBox
                register={register}
                items={colItem.child}
                title={colItem.childTitle}
              />
            ))}
          </div>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default TeamsInWorkflowAi;
