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

const SetWorkflowInDoc = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetSetWorkflows());
  }, []);

  return (
    <WorkflowLayout>
      <div
        style={{ position: "relative", display: "flex" }}
        className={`${styles.container} set-workflow-in-document-container`}
      >
        <h2 className={`${styles.title} h2-large`}>
          Set WorkFlows in Documents
        </h2>
        <div className={styles.select__container}>
          <div className={styles.left__container}>
            <SelectDoc />
          </div>
          <div className={styles.right__container}>
            <SelectWorkflow />
          </div>
        </div>
        <ContentMapOfDoc />
        <ConnectWorkFlowToDoc />
        <CheckErrors />
        <ProcessDocument />
        {/* <CustomerSupport /> */}
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
