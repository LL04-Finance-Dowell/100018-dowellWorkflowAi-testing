import { useRef, useState } from "react";
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
import { resetSetWorkflows, setContinents, setContinentsLoaded, setCurrentDocToWfs, setDocCurrentWorkflow, setPublicMembersSelectedForProcess, setSelectedMembersForProcess, setSelectedWorkflowsToDoc, setTableOfContentForStep, setTeamMembersSelectedForProcess, setUserMembersSelectedForProcess, setWfToDocument, updateSingleProcessStep } from "../../features/app/appSlice";
import { setContentOfDocument } from "../../features/document/documentSlice";
import { getContinents } from "../../services/locationServices";
import { useSearchParams } from "react-router-dom";
import { getSingleProcessV2 } from "../../services/processServices";
import Spinner from "../spinner/Spinner";
import { contentDocument } from "../../features/document/asyncThunks";
import ConstructionPage from "../../pages/ConstructionPage/ConstructionPage";

const SetWorkflowInDoc = () => {
  const dispatch = useDispatch();
  const { userDetail, session_id } = useSelector(state => state.auth);
  const { continentsLoaded, allProcesses, processSteps } = useSelector(state => state.app);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ draftProcessLoading, setDraftProcessLoading ] = useState(false);
  const { allDocuments } = useSelector(state => state.document);
  const { allWorkflows } = useSelector(state => state.workflow);
  const [ draftProcess, setDraftProcess ] = useState(null);
  const [ draftProcessDOc, setDraftProcessDoc ] = useState(null);
  const [ isDraftProcess, setIsDraftProcess ] = useState(false);

  useEffect(() => {
    const processId = searchParams.get('id');
    const processState = searchParams.get('state');

    if (!processId && !processState) {
      dispatch(resetSetWorkflows());
      dispatch(setContentOfDocument(null));  
      setDraftProcess(null);
      setDraftProcessDoc(null);
      setIsDraftProcess(false);
    }

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

  useEffect(() => {
    const processId = searchParams.get('id');
    const processState = searchParams.get('state');
    const localStorageProcess = searchParams.get('local');

    if (!processId || !processState || processState !== 'draft') {
      dispatch(resetSetWorkflows());
      dispatch(setContentOfDocument(null));  
      setDraftProcess(null);
      setDraftProcessDoc(null);
      setIsDraftProcess(false);
      return
    }
    
    setDraftProcessLoading(true);
    setIsDraftProcess(true);
    
    if (
      allProcesses.length < 1 || 
      !allDocuments ||
      (allDocuments && allDocuments.length < 1) || 
      !allWorkflows ||
      (allDocuments && allWorkflows.length < 1)
    ) return
    
    const foundProcess = allProcesses.find(process => process._id === processId);
    if (!foundProcess) return setDraftProcessLoading(false);
    if (foundProcess.processing_state !== "draft" || !foundProcess.workflow_construct_ids) return setDraftProcessLoading(false);

    if (localStorageProcess) {
      populateProcessDetails(foundProcess);
      return setDraftProcessLoading(false);
    }

    getSingleProcessV2(foundProcess._id).then(res => {
      const fetchedProcessData = res.data;
      // const foundCloneDocUsedToCreateProcess = allDocuments.find(document => document._id === fetchedProcessData.parent_document_id);
      // if (!foundCloneDocUsedToCreateProcess) return setDraftProcessLoading(false);
      populateProcessDetails(fetchedProcessData);
      setDraftProcessLoading(false);

    }).catch(err => {
      console.log(err.response ? err.response.data : err.message);
      setDraftProcessLoading(false);
    })
    
  }, [searchParams, allProcesses, allDocuments, allWorkflows])

  const populateProcessDetails = (process) => {
    // console.log(process);
    const foundOriginalDoc = allDocuments.find(document => document._id === process.parent_item_id && document.document_type === 'original');
    // console.log(foundOriginalDoc);
    if (!foundOriginalDoc) return setDraftProcessLoading(false);

    setDraftProcess(process);
    dispatch(contentDocument(foundOriginalDoc._id));
    dispatch(setCurrentDocToWfs(foundOriginalDoc));

    // This logic would be updated later when multiple workflows would be allowed in a process creation
    const foundWorkflow = allWorkflows.find(workflow => workflow._id === process.workflow_construct_ids[0]);
    if (!foundWorkflow) return setDraftProcessLoading(false);

    dispatch(setSelectedWorkflowsToDoc(foundWorkflow));
    dispatch(setWfToDocument());
    // console.log(foundWorkflow)
    dispatch(setDocCurrentWorkflow(foundWorkflow))
    
    return
    process?.process_steps.forEach((step, currentStepIndex) => {
      const stepKeys = Object.keys(step);

      stepKeys.forEach(key => {
        // console.log(key)
        if (key === 'stepName') dispatch(updateSingleProcessStep({ 'step_name': step[key], "indexToUpdate": currentStepIndex, "workflow": foundWorkflow._id }))
        if (key === 'stepRole') dispatch(updateSingleProcessStep({ 'role': step[key], "indexToUpdate": currentStepIndex, "workflow": foundWorkflow._id }))
        
        if (key === 'stepPublicMembers') {
          step[key].forEach(user => {
            // console.log(user)
            dispatch(setPublicMembersSelectedForProcess({ member: user.member, portfolio: user.portfolio, stepIndex: currentStepIndex }))
          })
        }

        if (key === 'stepTeamMembers') {
          step[key].forEach(user => {
            // console.log(user)
            dispatch(setTeamMembersSelectedForProcess({ member: user.member, portfolio: user.portfolio, stepIndex: currentStepIndex }))
          })
        }
        
        if (key === 'stepUserMembers') {
          step[key].forEach(user => {
            dispatch(setUserMembersSelectedForProcess({ member: user.member, portfolio: user.portfolio, stepIndex: currentStepIndex }))
          });
        }
        
        if (key === 'stepDocumentMap') {
          step[key].forEach(item => {
            const newTableOfContentObj = {
              id: item,
              workflow: foundWorkflow[0]._id,
              stepIndex: currentStepIndex,
            };
            dispatch(setTableOfContentForStep(newTableOfContentObj));
          })
        }

        dispatch(updateSingleProcessStep({ [`${key}`]: step[key], "indexToUpdate": currentStepIndex, "workflow": foundWorkflow._id }));
      })
    
    })

    setDraftProcessDoc(foundOriginalDoc);
  }

  return (
    <WorkflowLayout>
      <div
        style={{ position: "relative", display: "flex" }}
        className={`${styles.container} set-workflow-in-document-container `}
      >
        {
          draftProcessLoading ? <div className={styles.saved__process__loading}>
            <Spinner />
          </div> : <></>
        }
        <h2 className={`${styles.title} h2-large `}>
          {
           draftProcess ? draftProcess?.process_title :
           'Set WorkFlows in Documents'
          }
        </h2>
        {
          isDraftProcess ?
            !draftProcessLoading && draftProcess && draftProcessDOc ?
            <ConstructionPage hideLogo={true} message={'The viewing of draft processes is currently being fixed'} />
            // <>
            //   <SelectDoc savedDoc={draftProcessDOc} />
            //   <ContentMapOfDoc />
            //   <div className={styles.diveder}></div>
            //   <SelectWorkflow savedDoc={draftProcessDOc} />
            //   <div className={styles.diveder}></div>
            //   <ConnectWorkFlowToDoc stepsPopulated={true} />
            //   <div className={styles.diveder}></div>
            //   <CheckErrors />
            //   <div className={styles.diveder}></div>
            //   <ProcessDocument />
            // </> 
            :
            <>
            
              {
                draftProcessLoading ? <></> : 
                <ConstructionPage hideLogo={true} message={'The viewing of draft processes is currently being fixed'} />
                // <p style={{ textAlign: 'center' }}>Draft could not be loaded.</p>
              }
            </>
          :
          <>
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
          </>
        }
        
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
