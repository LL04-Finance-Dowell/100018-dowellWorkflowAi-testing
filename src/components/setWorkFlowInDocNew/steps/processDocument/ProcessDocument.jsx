import styles from './processDocument.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import Select from '../../select/Select';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  newProcessActionOptions,
  processActionOptionsWithLinkReturned,
  startNewProcessV2,
} from '../../../../services/processServices';
import ProgressBar from '../../../progressBar/ProgressBar';
import SelectDoc from '../selectDoc/SelectDoc';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GeneratedLinksModal from './components/GeneratedLinksModal/GeneratedLinksModal';
import SaveConfimationModal from './components/SaveConfirmationModal/SaveConfirmationModal';
import {
  setAllProcesses,
  setAllowErrorChecksStatusUpdateForNewProcess,
  setNewProcessErrorMessage,
} from '../../../../features/app/appSlice';
import { useTranslation } from 'react-i18next';
import { extractProcessObj } from './utils/utils';

const ProcessDocument = ({ savedProcess }) => {
  // const [ScrollView , SetScrollView] = useState();

  // useEffect(() => {
  //   setCurrentProcess(processDocument[0]);
  // }, []);

  useEffect(() => {
    if (!savedProcess) return;

    setProcessObjectToSaveTitle(savedProcess.process_title);
  }, [savedProcess]);

  // const handleCurrentProcess = (item) => {
  //   setCurrentProcess(item);
  // };

  const { register, watch } = useForm();
  const { processOptionSelection } = watch();

  const { userDetail } = useSelector((state) => state.auth);
  const {
    currentDocToWfs,

    processSteps,
    docCurrentWorkflow,
    tableOfContentForStep,
    teamMembersSelectedForProcess,
    userMembersSelectedForProcess,
    publicMembersSelectedForProcess,

    allProcesses,
    errorsCheckedInNewProcess,
  } = useSelector((state) => state.app);
  const [newProcessLoading, setNewProcessLoading] = useState(false);
  const [newProcessLoaded, setNewProcessLoaded] = useState(null);
  const [showGeneratedLinksPopup, setShowGeneratedLinksPopup] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState(null);
  const [masterLink, setmasterLink] = useState(null)
  const [copiedLinks, setCopiedLinks] = useState([]);
  const [processObjToSave, setProcessObjectToSave] = useState(null);
  const [processObjToSaveTitle, setProcessObjectToSaveTitle] = useState('');
  const [
    showConfirmationModalForSaveLater,
    setShowConfirmationModalForSaveLater,
  ] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleProcessBtnClick = async () => {
    if (!processOptionSelection || processOptionSelection === 'Select') return;

    if (!userDetail) return;
    if (!currentDocToWfs) {
      document.querySelector('#select-doc').scrollIntoView({ block: 'center' })
      return toast.info('You have not selected a document');

    };
    if (!docCurrentWorkflow) {
      document.querySelector('#step-title').scrollIntoView({ block: 'center' });
      return toast.info('You have not selected any workflow');
    }
    if (processSteps.length < 1) {

      return toast.info('You have not configured steps for any workflow')
    }
    if (!errorsCheckedInNewProcess) {
      document.querySelector('#h2__Doc__Title').scrollIntoView({ block: 'center' })
      return toast.info('Please click the "Show process" button above to make sure there are no errors before processing.');
    }



    if (processOptionSelection === 'saveAndContinueLater') {
      const processObjToSave = extractProcessObj(
        processOptionSelection,
        userDetail,
        currentDocToWfs,
        docCurrentWorkflow,
        processSteps,
        tableOfContentForStep,
        teamMembersSelectedForProcess,
        publicMembersSelectedForProcess,
        userMembersSelectedForProcess,
        true
      );
      setProcessObjectToSave(processObjToSave);
      dispatch(setAllowErrorChecksStatusUpdateForNewProcess(true));
      return setShowConfirmationModalForSaveLater(true);
    }

    const processObjToPost = extractProcessObj(
      newProcessActionOptions[`${processOptionSelection}`],
      userDetail,
      currentDocToWfs,
      docCurrentWorkflow,
      processSteps,
      tableOfContentForStep,
      teamMembersSelectedForProcess,
      publicMembersSelectedForProcess,
      userMembersSelectedForProcess
    );

    if (processObjToPost.error) {
      dispatch(setNewProcessErrorMessage(processObjToPost.error));
      document.querySelector('#h2__Doc__Title').scrollIntoView({ block: 'center' })

      return toast.info(processObjToPost.error);
    }

    dispatch(setAllowErrorChecksStatusUpdateForNewProcess(true));
    dispatch(setNewProcessErrorMessage(null));

    if (!errorsCheckedInNewProcess)
      return toast.info(
        'Please click the "Show process" button above to make sure there are no errors before processing.'
      );

    setNewProcessLoading(true);

    try {
      const response = await (await startNewProcessV2(processObjToPost)).data;

      setNewProcessLoaded(true);
      setNewProcessLoading(false);
      if (
        processActionOptionsWithLinkReturned.includes(
          newProcessActionOptions[`${processOptionSelection}`]
        )
      ) {
        console.log(response)
        setGeneratedLinks(Array.isArray(response) ? response[0] : response);
        setmasterLink(Array.isArray(response) ? response.master_link : response)
        setShowGeneratedLinksPopup(true);
        setNewProcessLoaded(false);
        return;
      }
      toast.success(
        typeof response === 'string'
          ? response
          : 'Successfully created new process'
      );
      setNewProcessLoaded(false);
    } catch (err) {
      setNewProcessLoading(false);
      toast.info(
        err.response
          ? err.response.status === 500
            ? 'New process creation failed'
            : err.response.data
          : 'New process creation failed'
      );
    }
  };

  const handleSaveForLaterBtnClick = () => {

    const processObjToSaveCopy = structuredClone(processObjToSave);

    processObjToSaveCopy._id = savedProcess
      ? savedProcess._id
      : crypto.randomUUID();
    processObjToSaveCopy.process_title = processObjToSaveTitle;
    processObjToSaveCopy.parent_item_id = processObjToSave.parent_id;
    processObjToSaveCopy.processing_action = processOptionSelection;
    processObjToSaveCopy.processing_state = 'draft';
    processObjToSaveCopy.process_type = 'document';
    processObjToSaveCopy.process_kind = 'original';
    processObjToSaveCopy.workflow_construct_ids =
      processObjToSave.workflows_ids;
    processObjToSaveCopy.created_at = new Date();
    processObjToSaveCopy.saved_at = new Date();
    processObjToSaveCopy.isFromLocalStorage = true;
    processObjToSaveCopy.process_steps =
      processObjToSave.workflows[0].workflows.steps;

    delete processObjToSaveCopy.workflows;
    delete processObjToSaveCopy.parent_id;
    delete processObjToSaveCopy.workflows_ids;



    // saving to local storage
    const savedProcessesInLocalStorage = JSON.parse(
      localStorage.getItem('user-saved-processes')
    );

    // user has never saved any processes locally before
    if (!savedProcessesInLocalStorage) {
      localStorage.setItem(
        'user-saved-processes',
        JSON.stringify([processObjToSaveCopy])
      );
      updateUIAfterLocalProcessSave(processObjToSaveCopy);
      return;
    }

    // user has saved processes locally before and is not making an update to a previously saved process
    if (!savedProcess) {
      savedProcessesInLocalStorage.push(processObjToSaveCopy);
      localStorage.setItem(
        'user-saved-processes',
        JSON.stringify(savedProcessesInLocalStorage)
      );
      updateUIAfterLocalProcessSave(processObjToSaveCopy);
      return;
    }

    // user has saved processes locally before and is making an update to a previously saved process
    const foundProcessIndex = savedProcessesInLocalStorage.findIndex(
      (process) => process._id === processObjToSaveCopy._id
    );

    // (SHOULD REALLY NEVER HAPPEN BUT OH WELL) for some weird reason, the previously saved process is missing from the local storage
    if (foundProcessIndex === -1) {
      savedProcessesInLocalStorage.push(processObjToSaveCopy);
      localStorage.setItem(
        'user-saved-processes',
        JSON.stringify(savedProcessesInLocalStorage)
      );
      updateUIAfterLocalProcessSave(processObjToSaveCopy);
      return;
    }

    savedProcessesInLocalStorage[foundProcessIndex] = processObjToSaveCopy;
    localStorage.setItem(
      'user-saved-processes',
      JSON.stringify(savedProcessesInLocalStorage)
    );
    updateUIAfterLocalProcessSave(processObjToSaveCopy, true);
  };

  const updateUIAfterLocalProcessSave = (
    process,
    previouslySavedProcess = false
  ) => {
    /**
     * Update the UI after a process is saved locally.
     *
     * @returns null
     */

    setProcessObjectToSave(null);
    setShowConfirmationModalForSaveLater(false);

    const copyOfProcesses = structuredClone(allProcesses);
    const foundProcessIndex = copyOfProcesses.findIndex(
      (p) => p._id === process._id
    );

    if (previouslySavedProcess && foundProcessIndex !== -1) {
      copyOfProcesses[foundProcessIndex] = process;
    } else {
      copyOfProcesses.unshift(process);
    }

    dispatch(setAllProcesses(copyOfProcesses));
    dispatch(setAllowErrorChecksStatusUpdateForNewProcess(false));
    toast.success('Successfully saved process');
    navigate('/processes/#drafts');
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.h2__Doc__Title}>5. {t('Process Document')}</h2>
        <div className={styles.box}>
          <div className={styles.box__inner}>
            <h3 className={styles.box__header}>
              {t('Select next Action in Document processing')}
            </h3>
            <Select
              name='processOptionSelection'
              options={proccesses}
              takeActionValue={true}
              register={register}
            />
            {newProcessLoading ? (
              <ProgressBar
                durationInMS={18000}
                finalWidth={newProcessLoaded ? '100' : null}
                style={{ height: '40px' }}
              />
            ) : (
              <button hoverBg='success' onClick={handleProcessBtnClick}>
                {t('Save / Start Process')}
              </button>
            )}
          </div>
        </div>
      </div>
      {showGeneratedLinksPopup && (
        <GeneratedLinksModal
          linksObj={generatedLinks}
          masterLink={masterLink}
          copiedLinks={copiedLinks}
          updateCopiedLinks={(links) => setCopiedLinks(links)}
          handleCloseBtnClick={() => setShowGeneratedLinksPopup(false)}
        />
      )}
      {showConfirmationModalForSaveLater && (
        <SaveConfimationModal
          handleCloseBtnClick={() =>
            setShowConfirmationModalForSaveLater(false)
          }
          handleSaveBtnClick={() => handleSaveForLaterBtnClick()}
          inputValue={processObjToSaveTitle}
          handleInputChange={(value) => setProcessObjectToSaveTitle(value)}
        />
      )}
    </>
  );
};

export default ProcessDocument;

export const proccesses = [
  { id: uuidv4(), option: 'Select', actionKey: 'Select' },
  {
    id: crypto.randomUUID(),
    option: 'Save and continue later',
    actionKey: 'saveAndContinueLater',
  },
  {
    id: uuidv4(),
    option: 'Save workflows to document and keep it in draft',
    actionKey: 'saveWorkflowToDocumentAndDrafts',
  },
  {
    id: uuidv4(),
    option:
      'Cancel process before completion. Document will reset to initial state',
    actionKey: 'cancelProcessBeforeCompletion',
  },
  {
    id: uuidv4(),
    option: 'Pause processing after completing the ongoing step',
    actionKey: 'pauseProcessAfterCompletingOngoingStep',
  },
  {
    id: uuidv4(),
    option: 'Resume processing from next step',
    actionKey: 'resumeProcessingFromNextStep',
  },
  {
    id: uuidv4(),
    option: "Test document processing WORKFLOW WISE (Won't update real data)",
    actionKey: 'testDocumentProcessWorkflowWise',
  },
  {
    id: uuidv4(),
    option: "Test document processing CONTENT WISE (Won't update real data)",
    actionKey: 'testDocumentProcessWorkflowStepWise',
  },
  {
    id: uuidv4(),
    option:
      "Test document processing WORKFLOW STEP WISE (Won't update real data)",
    actionKey: 'testDocumentProcessContentWise',
  },
  {
    id: uuidv4(),
    option: 'START document processing WORKFLOW WISE',
    actionKey: 'startDocumentProcessingWorkflowWise',
  },
  {
    id: uuidv4(),
    option: 'START document processing CONTENT WISE',
    actionKey: 'startDocumentProcessingWorkflowStepWise',
  },
  {
    id: uuidv4(),
    option: 'START document processing WORKFLOW STEP WISE',
    actionKey: 'startDocumentProcessingContentWise',
  },
  {
    id: uuidv4(),
    option:
      'Close processing and mark as completed (No further processing permitted)',
    actionKey: 'closeProcessingAndMarkCompleted',
  },
];

export const workflows = [
  { id: uuidv4(), option: 'Workflow 1' },
  { id: uuidv4(), option: 'Workflow 2' },
  { id: uuidv4(), option: 'Workflow 3' },
  { id: uuidv4(), option: 'All Workflows' },
];

export const processDocument = [
  {
    id: uuidv4(),
    process: 'Member (Team > Guest > Public)',
    processDetail: 'Member (Team > Guest > Public)',
  },
  {
    id: uuidv4(),
    process: 'Workflows (1 > 2 > 3...)',
    processDetail: 'Workflows (1 > 2 > 3...)',
  },
  {
    id: uuidv4(),
    process: 'Workflow steps (Step1 > Step2 > Step3..)',
    processDetail: 'Workflow steps (Step1 > Step2 > Step3..)',
  },
  {
    id: uuidv4(),
    process: 'Document content',
    processDetail: 'Document content',
  },
  {
    id: uuidv4(),
    process: 'Signing location',
    processDetail: 'Signing location',
  },
  { id: uuidv4(), process: 'Time limit', processDetail: 'Time limit' },
];
