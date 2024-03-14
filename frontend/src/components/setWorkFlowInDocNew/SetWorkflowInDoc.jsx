import { useState } from 'react';
import ConnectWorkFlowToDoc from './steps/connectWebflowToDoc/ConnectWorkFlowToDoc';
import SelectDoc from './steps/selectDoc/SelectDoc';
import SelectWorkflow from './steps/selectWorkflow/SelectWorkflow';
import styles from './setWorkflowInDoc.module.css';
import CheckErrors from './steps/checkErrors/CheckErrors';
import ProcessDocument from './steps/processDocument/ProcessDocument';

import ContentMapOfDoc from './contentMapOfDoc/ContentMapOfDoc';

import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setContentOfDocument } from '../../features/document/documentSlice';
import { getContinents } from '../../services/locationServices';
import { useSearchParams } from 'react-router-dom';
import { getSingleProcessV2 } from '../../services/processServices';
import Spinner from '../spinner/Spinner';
import { contentDocument } from '../../features/document/asyncThunks';

import ProcessName from './steps/setProcessName/ProcessName';
import { useTranslation } from 'react-i18next';
import Tabs from './Tabs';

//driver js for showing the steps
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";
import ImgOne from '../../assets/sec1.gif'
import ImgTwo from '../../assets/sec2.gif';
import ImgThree from '../../assets/sec3.gif';
import ImgFour from '../../assets/sec4.gif';
import ImgFive from '../../assets/sec5.gif';
import ImgSix from '../../assets/sec6.gif';
import { toggleHighlight } from '../../features/processCopyReducer';
import {    resetSetWorkflows,
  setContinents,
  setContinentsLoaded,
  setCurrentDocToWfs,
  setDocCurrentWorkflow,
  setPublicMembersSelectedForProcess,
  setSelectedWorkflowsToDoc,
  setTableOfContentForStep,
  setTeamMembersSelectedForProcess,
  setUserMembersSelectedForProcess,
  setWfToDocument, } from '../../features/processes/processesSlice';

const SetWorkflowInDoc = ({addWorkflowStep}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const { continentsLoaded, allProcesses } = useSelector((state) => state.processes);
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftProcessLoading, setDraftProcessLoading] = useState(false);
  const { allDocuments } = useSelector((state) => state.document);
  const { allWorkflows } = useSelector((state) => state.workflow);
  const [draftProcess, setDraftProcess] = useState(null);
  const [draftProcessDOc, setDraftProcessDoc] = useState(null);
  const [isDraftProcess, setIsDraftProcess] = useState(false);
  const [draftProcessLoaded, setDraftProcessLoaded] = useState(false);
  const [Process_title, setProcess_title] = useState('');

  //
  const [driverCounter, setDriverCounter] = useState(false)
  const showHighlight = useSelector((state) => state.copyProcess.showHighlight);

  const currentURL = window.location.href;
  const parts = currentURL.split('/'); 
  const whichApproval =  parts[parts.length - 1];

  // useEffect(()=>{
  //   dispatch(resetSetWorkflows());
  //   dispatch(setContentOfDocument(null));
  //   // console.log('form reset')
  // },[])
  useEffect(() => {
    const processId = searchParams.get('id');
    const processState = searchParams.get('state');
    
    if (!processId && !processState) {
      dispatch(resetSetWorkflows());
      dispatch(setContentOfDocument(null));
      setDraftProcess(null);
      setDraftProcessDoc(null);
      setIsDraftProcess(false);
      setDraftProcessLoaded(false);
    }

    if (continentsLoaded) return;

    getContinents(userDetail?.userinfo?.username, session_id)
      .then((res) => {
        const formattedContinents = res.data.map((item) => {
          const copyOfItem = { ...item };
          copyOfItem.id = crypto.randomUUID();
          copyOfItem.option = item.name;
          return copyOfItem;
        });
        dispatch(setContinents(formattedContinents));
        dispatch(setContinentsLoaded(true));
      })
      .catch((err) => {
        // console.log('Failed to fetch continents');
        dispatch(setContinentsLoaded(true));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const processId = searchParams.get('id');
    const processState = searchParams.get('state');
    const localStorageProcess = searchParams.get('local');
    
    if (!processId || !processState || processState !== 'draft') {
      // dispatch(resetSetWorkflows());
      // dispatch(setContentOfDocument(null));
      setDraftProcess(null);
      setDraftProcessDoc(null);
      setIsDraftProcess(false);
      setDraftProcessLoaded(false);
      return;
    }

    if (draftProcessLoaded) return;

    setDraftProcessLoading(true);
    setIsDraftProcess(true);

    if (
      allProcesses.length < 1 ||
      !allDocuments ||
      (allDocuments && allDocuments.length < 1) ||
      !allWorkflows ||
      (allDocuments && allWorkflows.length < 1)
    )
      return;

    const foundProcess = allProcesses.find(
      (process) => process._id === processId
    );
    if (!foundProcess) return setDraftProcessLoading(false);
    if (
      foundProcess.processing_state !== 'draft' ||
      !foundProcess.workflow_construct_ids
    )
      return setDraftProcessLoading(false);

    if (localStorageProcess) {
      populateProcessDetails(foundProcess);
      setDraftProcessLoaded(true);
      return setDraftProcessLoading(false);
    }

    getSingleProcessV2(foundProcess._id)
      .then((res) => {
        const fetchedProcessData = res.data;
        populateProcessDetails(fetchedProcessData);
        setDraftProcessLoading(false);
        setDraftProcessLoaded(true);
      })
      .catch((err) => {
        // console.log(err.response ? err.response.data : err.message);
        setDraftProcessLoading(false);
        setDraftProcessLoaded(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchParams,
    allProcesses,
    allDocuments,
    allWorkflows,
    draftProcessLoaded,
  ]);

  const populateProcessDetails = (process) => {
    const foundOriginalDoc = allDocuments.find(
      (document) =>
        document._id === process.parent_item_id &&
        document.document_type === 'original'
    );
    if (!foundOriginalDoc) return;

    // setDraftProcess(process);
    dispatch(contentDocument(foundOriginalDoc._id));
    dispatch(setCurrentDocToWfs(foundOriginalDoc));

    // This logic would be updated later when multiple workflows are configured in a process creation
    const foundWorkflow = allWorkflows.find(
      (workflow) => workflow._id === process.workflow_construct_ids[0]
    );
    if (!foundWorkflow) return;

    dispatch(setSelectedWorkflowsToDoc(foundWorkflow));
    dispatch(setWfToDocument());

    dispatch(setDocCurrentWorkflow(foundWorkflow));

    process?.process_steps.forEach((step, currentStepIndex) => {
      const stepKeys = Object.keys(step);
      const keysProcessed = [];
      stepKeys.forEach((key) => {
        if (keysProcessed.includes(key)) return;
        if (key === 'stepPublicMembers') {
          step[key].forEach((user) => {
            dispatch(
              setPublicMembersSelectedForProcess({
                member: user.member,
                portfolio: user.portfolio,
                stepIndex: currentStepIndex,
              })
            );
          });
        }

        if (key === 'stepTeamMembers') {
          step[key].forEach((user) => {
            dispatch(
              setTeamMembersSelectedForProcess({
                member: user.member,
                portfolio: user.portfolio,
                stepIndex: currentStepIndex,
              })
            );
          });
        }

        if (key === 'stepUserMembers') {
          step[key].forEach((user) => {
            dispatch(
              setUserMembersSelectedForProcess({
                member: user.member,
                portfolio: user.portfolio,
                stepIndex: currentStepIndex,
              })
            );
          });
        }

        if (key === 'stepDocumentMap') {
          step[key].forEach((item) => {
            const newTableOfContentObj = {
              id: item.content,
              workflow: foundWorkflow._id,
              stepIndex: currentStepIndex,
              required: item.required,
            };
            dispatch(setTableOfContentForStep(newTableOfContentObj));
          });
        }
        keysProcessed.push(key);
      });
    });

    const copyOfProcessObj = structuredClone(process);

    // This logic would also be updated later when multiple workflows are configured in a process creation
    const processStepsForWorkflow = [
      {
        workflow: foundWorkflow._id,
        steps: process.process_steps,
      },
    ];
    copyOfProcessObj.savedProcessSteps = processStepsForWorkflow;
    setDraftProcess(copyOfProcessObj);
    setDraftProcessDoc(foundOriginalDoc);
  };

useEffect(()=>{
  const videoElement = document.getElementById('hidenImg');
  const videoElement2 = document.getElementById('hidenImgTwo');
  const videoElement3 = document.getElementById('hidenImgThree');
  const videoElement4 = document.getElementById('hidenImgFour');
  const videoElement5 = document.getElementById('hidenImgFive');
  const videoElement6 = document.getElementById('hidenImgSix');
///driver js to show steps of the process
  const driverObj = driver({
    showProgress: true,
    onHighlightStarted: () => {
      // Show the video when highlighting starts
      videoElement.style.display = 'block';
      videoElement2.style.display = 'block';
      videoElement3.style.display = 'block';
      videoElement4.style.display = 'block';
      videoElement5.style.display = 'block';
      videoElement6.style.display = 'block';
      
    },
    steps: [
      { element: '#selectDocOne', popover: { title: 'Select Doc', description: 'Pick the right document and select it' } },
      { element: '#selectWfOne', popover: { title: 'Select Workflow', description: 'Select workflow from the given options' } },
      { element: '#connectWftoDocOne', popover: { title: 'Connect WF to Doc', description: 'Choose the specifications and also the table of contents. And do not forget to click the buttons in the end of each steps' } },
      // { element: '#copiesOfDocOne', popover: { title: 'Copy doc', description: 'Select the document and click the button to get doc from previous step.' } },
      // { element: '#assignTaskOne', popover: { title: 'Assign', description: 'Choose the member options from the given details and click Assign Task button' } },
      // { element: '#tableOfContentOne', popover: { title: 'Table of Content', description: 'Select component that you want' } },
      // { element: '#selectTeamOne', popover: { title: 'Choose For whom', description: 'Select for whom you are creating the document for' } },
      // { element: '#selectDisplayOne', popover: { title: 'Set Display', description: 'Choose the set display method' } },
      { element: '#checkError', popover: { title: 'Check Error', description: 'Test the process you created' } },
      { element: '#addName', popover: { title: 'Process Name', description: 'Give a name for the process' } },
      { element: '#createProcess', popover: { title: 'Create Process', description: 'Select the action in the document processing' } },
    ],
    onDestroyStarted: () => {
      // Hide the video when the tour is reset
      videoElement.style.display = 'none';
      videoElement2.style.display = 'none';
      videoElement3.style.display = 'none';
      videoElement4.style.display = 'none';
      videoElement5.style.display = 'none';
      videoElement6.style.display = 'none';
      dispatch(toggleHighlight())
      driverObj.destroy();
    },
  });
  if(showHighlight == true){
    driverObj.drive();
  }
  else {}
 
},[showHighlight])
  
// console.log("props.addWorkflowStep Mubeen", addWorkflowStep)

  return (
    <WorkflowLayout>
      <div
        style={{ position: 'relative', display: 'flex' }}
        className={`${styles.container} set-workflow-in-document-container `}
      >
        {draftProcessLoading ? (
          <div className={styles.saved__process__loading}>
            <Spinner />
          </div>
        ) : (
          <></>
        )}
        <div>
          <Tabs />
        </div>
        <h2 className={`${styles.title} h2-large `}>
          {draftProcess
            ? draftProcess?.process_title
            : t(`Set WorkFlows in ${whichApproval == 'new-set-workflow-document' ? 'Documents' : 'Templates'}`)}
        </h2>
        {isDraftProcess ? (
          !draftProcessLoading && draftProcess && draftProcessDOc ? (
            // <ConstructionPage hideLogo={true} message={'The viewing of draft processes is currently being fixed'} />
            <>
              <SelectDoc savedDoc={draftProcessDOc} driverCounter={driverCounter} setDriverCounter={setDriverCounter}/>
              <ContentMapOfDoc />
              <div className={styles.diveder}></div>
              <SelectWorkflow savedDoc={draftProcessDOc} driverCounter={driverCounter} setDriverCounter={setDriverCounter}/>
              <div className={styles.diveder}></div>
              <ConnectWorkFlowToDoc
                stepsPopulated={true}
                savedProcessSteps={
                  draftProcess.savedProcessSteps
                    ? draftProcess.savedProcessSteps
                    : []
                }
                driverCounter={driverCounter}
                setDriverCounter={setDriverCounter}
              />
              <div className={styles.diveder}></div>
              <CheckErrors driverCounter={driverCounter} setDriverCounter={setDriverCounter}/>
              <div className={styles.diveder}></div>
              <ProcessName
                Process_title={Process_title}
                setProcess_title={setProcess_title}
                driverCounter={driverCounter}
                setDriverCounter={setDriverCounter}
              />
              <div className={styles.diveder}></div>
              <ProcessDocument
                savedProcess={draftProcess}
                Process_title={Process_title}
                setProcess_title={setProcess_title}
                driverCounter={driverCounter}
                setDriverCounter={setDriverCounter}
                addWorkflowStep={addWorkflowStep}
              />
            </>
          ) : (
            <>
              {draftProcessLoading ? (
                <></>
              ) : (
                // <ConstructionPage hideLogo={true} message={'The viewing of draft processes is currently being fixed'} />
                <p style={{ textAlign: 'center' }}>
                  Draft could not be loaded.
                </p>
              )}
            </>
          )
        ) : (
          <>
          <div style={{ position: 'relative' }}>
            <div id='hidenImg'  style={{ display: 'none', position: 'absolute', top: 0, left: 0, zIndex: 100000 }}>
              <img id='selectDocOne' src={ImgOne} width={'100%'} height={'100%'} />
            </div>
            <SelectDoc driverCounter={driverCounter} setDriverCounter={setDriverCounter} addWorkflowStep={addWorkflowStep}/>
          </div>
          
            <ContentMapOfDoc />
            
            <div style={{ position: 'relative' }}>
              <div className={styles.diveder}></div>
              <div id='hidenImgTwo'  style={{ display: 'none', position: 'absolute', top: 0, left: 0, zIndex: 100000 }}>
                <img id='selectWfOne' src={ImgTwo} width={'100%'} height={'100%'} />
              </div>
              <SelectWorkflow driverCounter={driverCounter} setDriverCounter={setDriverCounter}/>
            </div>
            <div style={{ position: 'relative' }}>
              <div className={styles.diveder}></div>
              <div id='hidenImgThree'  style={{ display: 'none', position: 'absolute', top: 150, left: 0, zIndex: 100000 }}>
                <img id='connectWftoDocOne' src={ImgThree} width={'100%'} height={'100%'} />
              </div>
              <ConnectWorkFlowToDoc driverCounter={driverCounter} setDriverCounter={setDriverCounter} addWorkflowStep={addWorkflowStep}/>
            </div>
            <div style={{ position: 'relative' }}>
              <div className={styles.diveder}></div>
              <div id='hidenImgFour'  style={{ display: 'none', position: 'absolute', top: 400, left: 0, zIndex: 100000 }}>
                <img id='checkError' src={ImgFour} width={'100%'} height={'100%'} />
              </div>
              <CheckErrors driverCounter={driverCounter} setDriverCounter={setDriverCounter}/>
            </div>
            <div style={{ position: 'relative' }}>
              <div className={styles.diveder}></div>
              <div id='hidenImgFive'  style={{ display: 'none', position: 'absolute', top: 450, left: 0, zIndex: 100000 }}>
                <img id='addName' src={ImgFive} width={'100%'} height={'100%'} />
              </div>
           
              <ProcessName
                Process_title={Process_title}
                setProcess_title={setProcess_title}
                driverCounter={driverCounter} setDriverCounter={setDriverCounter}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <div className={styles.diveder}></div>
              <div id='hidenImgSix'  style={{ display: 'none', position: 'absolute', top: 430, left: 0, zIndex: 100000 }}>
                <img id='createProcess' src={ImgSix} width={'100%'} height={'100%'}/>
              </div>
              <ProcessDocument
                Process_title={Process_title}
                setProcess_title={setProcess_title}
                driverCounter={driverCounter} setDriverCounter={setDriverCounter}
                addWorkflowStep={addWorkflowStep}
              />
            </div>
          </>
        )}
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
