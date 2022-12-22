import React from "react";
import { useForm } from "react-hook-form";
import InfoBox from "../infoBox/InfoBox";
import TeamsInWorkflowAi from "./teamInWorkflowAi/TeamsInWorkflowAi";
import {
  processesInWorkflowAIArray,
  workflowAiSettingsArray,
} from "./veriables";
import styles from "./workflowAiSettings.module.css";

const WorkflowAiSettings = () => {
  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    console.log("dataaaaaaaaaa", data);
  };

  return (
    <div className={styles.container}>
      {workflowAiSettingsArray.map((item) => (
        <div key={item._id} className={styles.box}>
          <h2 className={`${styles.title} ${styles.title_l}`}>{item.title}</h2>
          <div className={styles.section__container}>
            {item.children.map((childItem) => (
              <div key={childItem._id} className={styles.section__box}>
                <InfoBox
                  type="list"
                  items={childItem.child}
                  title={childItem.childTitle}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        {processesInWorkflowAIArray.map((item) => (
          <div key={item._id} className={styles.box}>
            <h2 className={`${styles.title} ${styles.title_l}`}>
              {item.title}
            </h2>
            <div className={styles.section__container}>
              {item.children.map((childItem) => (
                <div key={childItem._id} className={styles.section__box}>
                  {childItem.column.map((colItem) => (
                    <InfoBox
                      register={register}
                      items={colItem.child}
                      title={colItem.childTitle}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <input type="submit" />
      </form>
      <TeamsInWorkflowAi />
    </div>
  );
};

export default WorkflowAiSettings;
