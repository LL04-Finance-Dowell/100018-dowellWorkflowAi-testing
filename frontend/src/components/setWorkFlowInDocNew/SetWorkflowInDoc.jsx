import { useRef } from "react";
import ConnectWorkFlowToDoc from "./steps/connectWebflowToDoc/ConnectWorkFlowToDoc";
import SelectDoc from "./steps/selectDoc/SelectDoc";
import SelectWorkflow from "./steps/selectWorkflow/SelectWorkflow";
import styles from "./setWorkflowInDoc.module.css";
import CheckErrors from "./steps/checkErrors/CheckErrors";
import ProcessDocument from "./steps/processDocument/ProcessDocument";
import CustomerSupport from "./customerSupport/CustomerSupport";
import ContentMapOfDoc from "./contentMapOfDoc/ContentMapOfDoc";
import globalStyles from "./globalStyles.css";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetSetWorkflows } from "../../features/app/appSlice";
import { setContentOfDocument } from "../../features/document/documentSlice";

const SetWorkflowInDoc = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetSetWorkflows());
    dispatch(setContentOfDocument(null));
  }, []);

  return (
    <WorkflowLayout>
      <div
        style={{ position: "relative", display: "flex" }}
        className={`${styles.container} set-workflow-in-document-container `}
      >
        <h2 className={`${styles.title} h2-large `}>
          Set WorkFlows in Documents
        </h2>
        <SelectDoc />
        <ContentMapOfDoc />
        <div className={styles.diveder}></div>
        <SelectWorkflow />
        <div className={styles.diveder}></div>
        <ConnectWorkFlowToDoc />
        <div className={styles.diveder}></div>
        <CheckErrors />
        <div className={styles.diveder}></div>
        <ProcessDocument />
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
