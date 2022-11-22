import { useRef } from "react";
import ConnectWorkFlowToDoc from "./connectWebflowToDoc/ConnectWorkFlowToDoc";
import SelectDoc from "./selectDoc/SelectDoc";
import SelectWorkflow from "./selectWorkflow/SelectWorkflow";
import styles from "./setWorkflowInDoc.module.css";

const SetWorkflowInDoc = () => {
  const infoBoxesRef = useRef();

  return (
    <div ref={infoBoxesRef} className={styles.container}>
      <h2 className={`${styles.title} h2-large`}>Set WorkFlows in Documents</h2>
      <div className={styles.content__container}>
        <div className={styles.left__container}>
          <SelectDoc />
        </div>
        <div className={styles.right__container}>
          <SelectWorkflow infoBoxesRef={infoBoxesRef} />
        </div>
      </div>
      <ConnectWorkFlowToDoc />
    </div>
  );
};

export default SetWorkflowInDoc;
