import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import InfoBox from "../../infoBox/InfoBox";
import SubmitButton from "../../submitButton/SubmitButton";
import { teamsInWorkflowAI } from "../veriables";
import workflowAiSettingsStyles from "../workflowAiSettings.module.css";

const TeamsInWorkflowAi = () => {
  const { register, handleSubmit } = useForm();

  const { teamsInWorkflowAI } = useSelector((state) => state.app);

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className={workflowAiSettingsStyles.box}>
      <h2
        className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
      >
        {teamsInWorkflowAI[0].title}
      </h2>
      <div className={workflowAiSettingsStyles.section__container}>
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <div className={workflowAiSettingsStyles.section__box}>
            {teamsInWorkflowAI[0].children[0].column.map((colItem) => (
              <InfoBox
                teamsInWorkflowAI={true}
                boxİd={teamsInWorkflowAI[0].children[0]._id}
                register={register}
                items={colItem.items}
                title={colItem.proccess_title}
              />
            ))}
          </div>
          <SubmitButton className={workflowAiSettingsStyles.submit__button}>
            create new team
          </SubmitButton>
        </form>
        <div className={workflowAiSettingsStyles.section__box}>
          {teamsInWorkflowAI[0].children[1].column.map((colItem) => (
            <InfoBox
              teamsInWorkflowAI={true}
              boxİd={teamsInWorkflowAI[0].children[1]._id}
              register={register}
              items={colItem.items}
              title={colItem.proccess_title}
            />
          ))}
        </div>
        <form>
          <div className={workflowAiSettingsStyles.section__box}>
            {teamsInWorkflowAI[0].children[2].column.map((colItem) => (
              <InfoBox
                teamsInWorkflowAI={true}
                boxİd={teamsInWorkflowAI[0].children[2]._id}
                register={register}
                items={colItem.items}
                title={colItem.proccess_title}
              />
            ))}
          </div>
          <SubmitButton className={workflowAiSettingsStyles.submit__button}>
            Update team details
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default TeamsInWorkflowAi;
