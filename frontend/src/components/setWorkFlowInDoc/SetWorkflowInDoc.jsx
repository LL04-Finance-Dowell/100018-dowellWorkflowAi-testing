import React from "react";
import ConnectWorkFlowToDoc from "./connectWebflowToDoc/ConnectWorkFlowToDoc";
import InfoBoxes from "./ınfoBoxes/InfoBoxes";
import SelectDoc from "./selectDoc/SelectDoc";
import SelectWorkflow from "./selectWorkflow/SelectWorkflow";
import styles from "./setWorkflowInDoc.module.css";

const SetWorkflowInDoc = () => {
  return (
    <div style={{ paddingTop: "200px" }} className={styles.container}>
      <h2 className={`${styles.title} h2-large`}>Set WorkFlows in Documents</h2>
      <div className={styles.content__container}>
        <div className={styles.left__container}>
          <SelectDoc />
        </div>
        <div className={styles.right__container}>
          <SelectWorkflow />
        </div>
      </div>
      <ConnectWorkFlowToDoc />
    </div>
  );
};

export default SetWorkflowInDoc;
