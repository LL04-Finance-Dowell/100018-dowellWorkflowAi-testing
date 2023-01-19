import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";
import InfoBox from "../infoBox/InfoBox";
import SubmitButton from "../submitButton/SubmitButton";
import EnabledDisabkedProcess from "./enabledDisabkedProcess/EnabledDisabkedProcess";
import EnabledProcess from "./enabledProcess/EnabledProcess";
import TeamsInWorkflowAi from "./teamInWorkflowAi/TeamsInWorkflowAi";
import Themes from "./themes/Themes";
import {
  permissionArray,
  processesInWorkflowAIArray,
  workflowAiSettingsArray,
} from "./veriables";
import styles from "./workflowAiSettings.module.css";

const Container = styled.div`
  & button {
    background-color: ${(props) => props.bgColor} !important;
  }
`;

const WorkflowAiSettings = () => {
  const { themeColor } = useSelector((state) => state.app);

  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    console.log("dataaaaaaaaaa", data);
  };

  return (
    <Container bgColor={themeColor} className={styles.container}>
      {workflowAiSettingsArray.map((item) => (
        <div key={item._id} className={styles.box}>
          <h2 className={`${styles.title} ${styles.title__l}`}>{item.title}</h2>
          <div className={styles.section__container}>
            {item.children.map((childItem) => (
              <div key={childItem._id} className={styles.section__box}>
                <InfoBox
                  type="list"
                  items={childItem.items}
                  title={childItem.proccess_title}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.bottom__line}></div>
      <EnabledProcess />
      <div className={styles.bottom__line}></div>
      <TeamsInWorkflowAi />
      <div className={styles.bottom__line}></div>
      <EnabledDisabkedProcess />
      <div className={styles.bottom__line}></div>
      <Themes />
    </Container>
  );
};

export default WorkflowAiSettings;
