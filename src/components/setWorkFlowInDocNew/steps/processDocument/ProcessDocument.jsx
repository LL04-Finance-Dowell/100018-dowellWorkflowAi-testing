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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import GeneratedLinksModal from './components/GeneratedLinksModal/GeneratedLinksModal';
import SaveConfimationModal from './components/SaveConfirmationModal/SaveConfirmationModal';
import { setAllProcesses } from '../../../../features/app/appSlice';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../../utils/helpers';

const ProcessDocument = ({ savedProcess }) => {
  // const [currentProcess, setCurrentProcess] = useState();

  // useEffect(() => {
  //   setCurrentProcess(processDocument[0]);
  // }, []);

  useEffect(() => {
    if (!savedProcess) return;
    // console.log(savedProcess);
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
  } = useSelector((state) => state.app);
  const [newProcessLoading, setNewProcessLoading] = useState(false);
  const [newProcessLoaded, setNewProcessLoaded] = useState(null);
  const [showGeneratedLinksPopup, setShowGeneratedLinksPopup] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState(null);
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

  const extractProcessObj = (actionVal, skipDataChecks = false) => {
    const processObj = {
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0]?.org_id,
      created_by: userDetail?.userinfo?.username,
      creator_portfolio: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.portfolio_name : userDetail?.portfolio_info[0]?.portfolio_name,
      data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0]?.data_type,
      parent_id: currentDocToWfs?._id,
      action: actionVal,
      workflows: [
        {
          workflows: {
            workflow_title: docCurrentWorkflow.workflows?.workflow_title,
            steps: [],
          },
        },
      ],
      workflows_ids: [docCurrentWorkflow._id], // this will be updated later to capture multiple workflows
      process_type: 'document',
      org_name: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_name : userDetail?.portfolio_info[0]?.org_name,
    };

    const foundProcessSteps = processSteps.find(
      (process) => process.workflow === docCurrentWorkflow._id
    );
    const tableOfContents = tableOfContentForStep.filter(
      (content) => content.workflow === docCurrentWorkflow._id
    );

    processObj.workflows[0].workflows.steps = foundProcessSteps
      ? foundProcessSteps.steps.map((step, currentIndex) => {
          let copyOfCurrentStep = { ...step };
          if (copyOfCurrentStep._id) delete copyOfCurrentStep._id;
          if (copyOfCurrentStep.toggleContent)
            delete copyOfCurrentStep.toggleContent;

          if (copyOfCurrentStep.step_name) {
            copyOfCurrentStep.stepName = copyOfCurrentStep.step_name;
            delete copyOfCurrentStep.step_name;
          }

          if (copyOfCurrentStep.role) {
            copyOfCurrentStep.stepRole = copyOfCurrentStep.role;
            delete copyOfCurrentStep.role;
          }

          copyOfCurrentStep.stepPublicMembers = publicMembersSelectedForProcess
            .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
            .map((user) => {
              const copyOfUserItem = { ...user };
              if (Array.isArray(copyOfUserItem.member))
                copyOfUserItem.member = copyOfUserItem.member[0];
              delete copyOfUserItem.stepIndex;

              return copyOfUserItem;
            });

          copyOfCurrentStep.stepTeamMembers = teamMembersSelectedForProcess
            .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
            .map((user) => {
              const copyOfUserItem = { ...user };
              if (Array.isArray(copyOfUserItem.member))
                copyOfUserItem.member = copyOfUserItem.member[0];
              delete copyOfUserItem.stepIndex;

              return copyOfUserItem;
            });

          copyOfCurrentStep.stepUserMembers = userMembersSelectedForProcess
            .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
            .map((user) => {
              const copyOfUserItem = { ...user };
              if (Array.isArray(copyOfUserItem.member))
                copyOfUserItem.member = copyOfUserItem.member[0];
              delete copyOfUserItem.stepIndex;

              return copyOfUserItem;
            });

          copyOfCurrentStep.stepDocumentCloneMap = [];

          copyOfCurrentStep.stepNumber = currentIndex + 1;
          copyOfCurrentStep.stepDocumentMap = tableOfContents
            .filter((content) => content.stepIndex === currentIndex)
            .map((content) => ({
              content: content.id,
              required: content.required,
              page: content.page,
            }));

          if (!copyOfCurrentStep.permitInternalWorkflow)
            copyOfCurrentStep.permitInternalWorkflow = false;
          if (!copyOfCurrentStep.skipStep) copyOfCurrentStep.skipStep = false;
          if (!copyOfCurrentStep.stepLocation)
            copyOfCurrentStep.stepLocation = 'any';

          if (copyOfCurrentStep.skipStep) {
            copyOfCurrentStep.stepCloneCount = 0;
            copyOfCurrentStep.stepDisplay = 'in_all_steps';
            copyOfCurrentStep.stepProcessingOrder = 'no_order';
            copyOfCurrentStep.stepRights = 'add_edit';
            copyOfCurrentStep.stepActivityType = 'individual_task';
          }
          return copyOfCurrentStep;
        })
      : [];

    if (skipDataChecks) return processObj;

    const requiredFieldKeys = Object.keys(requiredProcessStepsKeys);

    const pendingFieldsToFill = requiredFieldKeys.map((requiredKey) => {
      if (
        processObj.workflows[0].workflows.steps.every((step) =>
          step.hasOwnProperty(requiredKey)
        )
      )
        return null;
      return 'field missing';
    });

    if (pendingFieldsToFill.find((field) => field === 'field missing'))
      return {
        error: `Please make sure you ${
          requiredProcessStepsKeys[
            requiredFieldKeys[
              pendingFieldsToFill.findIndex(
                (field) => field === 'field missing'
              )
            ]
          ]
        } for each step`,
      };

    const membersMissingInStep = processObj.workflows[0].workflows.steps.map(
      (step) => {
        if (
          step.stepPublicMembers.length < 1 &&
          step.stepTeamMembers.length < 1 &&
          step.stepUserMembers.length < 1 &&
          !step.skipStep
        )
          return 'Please assign at least one user for each step';
        return null;
      }
    );

    if (
      membersMissingInStep.find(
        (member) => member === 'Please assign at least one user for each step'
      )
    )
      return {
        error: membersMissingInStep.find(
          (member) => member === 'Please assign at least one user for each step'
        ),
      };

    const documentMapMissingInStep =
      processObj.workflows[0].workflows.steps.map((step) => {
        if (step.stepDocumentMap.length < 1 && !step.skipStep)
          return 'Document map missing';
        return null;
      });

    if (
      documentMapMissingInStep.find(
        (stepMissing) => stepMissing === 'Document map missing'
      )
    )
      return {
        error:
          'Please make sure you select at least one item from the table of contents for each step',
      };

    // if (!processObj.workflows[0].workflows.steps.every(step => step.stepDocumentMap.length > 0)) return { error : "Please make sure you select at least one item from the table of contents for each step" };

    return processObj;
  };

  const handleProcessBtnClick = async () => {
    if (!processOptionSelection || processOptionSelection === 'Select') return;

    if (!userDetail) return;
    if (!currentDocToWfs) return toast.info('You have not selected a document');
    if (!docCurrentWorkflow)
      return toast.info('You have not selected any workflow');
    if (processSteps.length < 1)
      return toast.info('You have not configured steps for any workflow');

    if (processOptionSelection === 'saveAndContinueLater') {
      const processObjToSave = extractProcessObj(processOptionSelection, true);
      setProcessObjectToSave(processObjToSave);
      return setShowConfirmationModalForSaveLater(true);
    }

    const processObjToPost = extractProcessObj(
      newProcessActionOptions[`${processOptionSelection}`]
    );

    if (processObjToPost.error) return toast.info(processObjToPost.error);

    console.log('New process obj to post: ', processObjToPost);
    setNewProcessLoading(true);

    try {
      const response = await (await startNewProcessV2(processObjToPost)).data;
      // console.log("process response: ", response);
      setNewProcessLoaded(true);
      setNewProcessLoading(false);
      if (
        processActionOptionsWithLinkReturned.includes(
          newProcessActionOptions[`${processOptionSelection}`]
        )
      ) {
        console.log(response);
        setGeneratedLinks(response);
        setShowGeneratedLinksPopup(true);
        return;
      }
      toast.success(
        typeof response === 'string'
          ? response
          : 'Successfully created new process'
      );
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
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
    console.log('Process obj: ', processObjToSave);
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

    console.log('New process obj to save: ', processObjToSaveCopy);

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
    toast.success('Successfully saved process');
    navigate('/processes/#drafts');
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={`h2-small step-title align-left ${styles.header}`}>
          5. {t('Process Document')}
        </h2>
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
                {t('Save / Start Proccess')}
              </button>
            )}
          </div>
        </div>
      </div>
      {showGeneratedLinksPopup && (
        <GeneratedLinksModal
          linksObj={generatedLinks}
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

const requiredProcessStepsKeys = {
  stepCloneCount: 'select copies of document for processing',
  stepDocumentMap: 'select at least one item from the table of contents',
  stepDisplay: 'configure a display',
  stepProcessingOrder: "select a 'member order'",
  stepRights: "select a 'rights'",
  stepActivityType: "select a 'activity type'",
  stepLocation: 'configure a location',
};
