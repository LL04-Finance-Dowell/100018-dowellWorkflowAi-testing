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
import {
  resetSetWorkflows,
  setContinents,
  setContinentsLoaded,
  setCurrentDocToWfs,
  setDocCurrentWorkflow,
  setPublicMembersSelectedForProcess,
  setSelectedMembersForProcess,
  setSelectedWorkflowsToDoc,
  setTableOfContentForStep,
  setTeamMembersSelectedForProcess,
  setUserMembersSelectedForProcess,
  setWfToDocument,
  updateSingleProcessStep,
} from '../../features/app/appSlice';
import { setContentOfDocument } from '../../features/document/documentSlice';
import { getContinents } from '../../services/locationServices';
import { useSearchParams } from 'react-router-dom';
import { getSingleProcessV2 } from '../../services/processServices';
import Spinner from '../spinner/Spinner';
import { contentDocument } from '../../features/document/asyncThunks';

import { useTranslation } from 'react-i18next';

const SetWorkflowInDoc = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const { continentsLoaded, allProcesses } = useSelector((state) => state.app);
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftProcessLoading, setDraftProcessLoading] = useState(false);
  const { allDocuments } = useSelector((state) => state.document);
  const { allWorkflows } = useSelector((state) => state.workflow);
  const [draftProcess, setDraftProcess] = useState(null);
  const [draftProcessDOc, setDraftProcessDoc] = useState(null);
  const [isDraftProcess, setIsDraftProcess] = useState(false);
  const [draftProcessLoaded, setDraftProcessLoaded] = useState(false);

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
        console.log('Failed to fetch continents');
        dispatch(setContinentsLoaded(true));
      });
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
        console.log(err.response ? err.response.data : err.message);
        setDraftProcessLoading(false);
        setDraftProcessLoaded(true);
      });
  }, [
    searchParams,
    allProcesses,
    allDocuments,
    allWorkflows,
    draftProcessLoaded,
  ]);

  const populateProcessDetails = (process) => {
    // console.log(process);
    const foundOriginalDoc = allDocuments.find(
      (document) =>
        document._id === process.parent_item_id &&
        document.document_type === 'original'
    );
    // console.log(foundOriginalDoc);
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
    // console.log(foundWorkflow)
    dispatch(setDocCurrentWorkflow(foundWorkflow));

    process?.process_steps.forEach((step, currentStepIndex) => {
      const stepKeys = Object.keys(step);
      const keysProcessed = [];
      stepKeys.forEach((key) => {
        if (keysProcessed.includes(key)) return;
        if (key === 'stepPublicMembers') {
          step[key].forEach((user) => {
            // console.log(user)
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
            // console.log(user)
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
        <h2 className={`${styles.title} h2-large `}>
          {draftProcess
            ? draftProcess?.process_title
            : t('Set WorkFlows in Documents')}
        </h2>
        {isDraftProcess ? (
          !draftProcessLoading && draftProcess && draftProcessDOc ? (
            // <ConstructionPage hideLogo={true} message={'The viewing of draft processes is currently being fixed'} />
            <>
              <SelectDoc savedDoc={draftProcessDOc} />
              <ContentMapOfDoc />
              <div className={styles.diveder}></div>
              <SelectWorkflow savedDoc={draftProcessDOc} />
              <div className={styles.diveder}></div>
              <ConnectWorkFlowToDoc
                stepsPopulated={true}
                savedProcessSteps={
                  draftProcess.savedProcessSteps
                    ? draftProcess.savedProcessSteps
                    : []
                }
              />
              <div className={styles.diveder}></div>
              <CheckErrors />
              <div className={styles.diveder}></div>
              <ProcessDocument savedProcess={draftProcess} />
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
        )}
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
