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

  useEffect(() => {
    const processId = searchParams.get('id');
    const processState = searchParams.get('state');

    if (!processId && !processState) {
      dispatch(resetSetWorkflows());
      dispatch(setContentOfDocument(null));  
      setDraftProcess(null);
      setDraftProcessDoc(null);
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

    if (!processId || !processState || processState !== 'draft') {
      dispatch(resetSetWorkflows());
      dispatch(setContentOfDocument(null));  
      setDraftProcess(null);
      setDraftProcessDoc(null);
      return
    }
    
    setDraftProcessLoading(true);
    
    if (
      allProcesses.length < 1 || 
      allDocuments.length < 1 || 
      allWorkflows.length < 1
    ) return
    
    const foundProcess = allProcesses.find(process => process._id === processId);
    if (!foundProcess) return setDraftProcessLoading(false);

    getSingleProcessV2(foundProcess._id).then(res => {
      const fetchedProcessData = res.data;
      
      const foundCloneDocUsedToCreateProcess = allDocuments.find(document => document._id === fetchedProcessData.parent_document_id);
      if (!foundCloneDocUsedToCreateProcess) return setDraftProcessLoading(false);
      
      const foundOriginalDoc = allDocuments.find(document => document._id === foundCloneDocUsedToCreateProcess.parent_id);
      if (!foundOriginalDoc) return setDraftProcessLoading(false);
      
      // console.log(res.data)

      setDraftProcess(res.data);
      dispatch(contentDocument(foundOriginalDoc._id));
      dispatch(setCurrentDocToWfs(foundOriginalDoc));

      const foundWorkflow = allWorkflows.filter(workflow => workflow?.workflows?.workflow_title.includes(res.data.process_title));
      
      if (foundWorkflow[0]) {
        dispatch(setSelectedWorkflowsToDoc(foundWorkflow[0]));
        dispatch(setWfToDocument());
        // console.log(foundWorkflow[0])
        dispatch(setDocCurrentWorkflow(foundWorkflow[0]))

        fetchedProcessData.process_steps.forEach((step, currentStepIndex) => {
          const stepKeys = Object.keys(step);

          stepKeys.forEach(key => {
            // console.log(key)
            if (key === 'stepName') dispatch(updateSingleProcessStep({ 'step_name': step[key], "indexToUpdate": currentStepIndex, "workflow": foundWorkflow[0]._id }))
            if (key === 'stepRole') dispatch(updateSingleProcessStep({ 'role': step[key], "indexToUpdate": currentStepIndex, "workflow": foundWorkflow[0]._id }))
            
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

            dispatch(updateSingleProcessStep({ [`${key}`]: step[key], "indexToUpdate": currentStepIndex, "workflow": foundWorkflow[0]._id }));
          })
        
        })

        setDraftProcessDoc(foundOriginalDoc);
        setDraftProcessLoading(false);

        return
      }

      setDraftProcessLoading(false);

    }).catch(err => {
      console.log(err.response ? err.response.data : err.message);
      setDraftProcessLoading(false);
    })
    
  }, [searchParams, allProcesses, allDocuments, allWorkflows])

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
        <SelectDoc savedDoc={draftProcessDOc} />
        <ContentMapOfDoc />
        <div className={styles.diveder}></div>
        <SelectWorkflow workflowBoxOpen={draftProcessDOc ? true : false} />
        <div className={styles.diveder}></div>
        <ConnectWorkFlowToDoc stepsPopulated={draftProcessDOc ? true : false} />
        <div className={styles.diveder}></div>
        <CheckErrors />
        <div className={styles.diveder}></div>
        <ProcessDocument />
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
