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
import { useDispatch, useSelector } from "react-redux";
import { resetSetWorkflows, setContinents, setContinentsLoaded } from "../../features/app/appSlice";
import { setContentOfDocument } from "../../features/document/documentSlice";
import { getContinents } from "../../services/locationServices";

const SetWorkflowInDoc = () => {
  const dispatch = useDispatch();
  const { userDetail, session_id } = useSelector(state => state.auth);
  const { continentsLoaded } = useSelector(state => state.app);

  useEffect(() => {
    dispatch(resetSetWorkflows());
    dispatch(setContentOfDocument(null));

    if (continentsLoaded) return

    getContinents(userDetail?.userinfo?.username, session_id).then(res => {
      const formattedContinents = res.data.map(item => {
        const copyOfItem = {...item}
        copyOfItem.id = crypto.randomUUID();
        copyOfItem.option = item.name;
        return copyOfItem
      })
      dispatch(setContinents(formattedContinents))
      dispatch(setContinentsLoaded(true))
    }).catch(err => {
      console.log("Failed to fetch continents")
      dispatch(setContinentsLoaded(true))
    })

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
