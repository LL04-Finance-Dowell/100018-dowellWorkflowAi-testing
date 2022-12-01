import styles from "./connectWorkFlowToDoc.module.css";
import { BsChevronDown } from "react-icons/bs";
import AssignDocumentMap from "./assignForms/forms/assignDocumentMap/AssignDocumentMap";
import AsignTask from "./assignForms/forms/assignTask/AssignTask";
import AssignLocation from "./assignForms/forms/assignLocation/AssignLocation";
import AssignTime from "./assignForms/forms/assignTime/AssignTimes";

const ConnectWorkFlowToDoc = () => {
  return (
    <div className={styles.container}>
      <div className={styles.step__title__box}>
        <h2 className="h2-small step-title">
          3. Connect Selected Workflows to the selected Document
        </h2>
      </div>
      <div className={styles.step__container}>
        <div className={`${styles.header} h2-medium`}>Workflow 1</div>
        <div className={styles.step__header}>step 1 - name</div>
        <div className={styles.skip}>
          <input type="checkbox" />
          Skip this Step
        </div>

        <AssignDocumentMap />
        <div className={styles.table__of__contents__header}>
          <span>Table of Contents</span>
          <BsChevronDown />
        </div>
        <AsignTask />
        <AssignLocation />
        <AssignTime />
      </div>
      <div className="bottom-line">
        <span></span>
      </div>
    </div>
  );
};

export default ConnectWorkFlowToDoc;
