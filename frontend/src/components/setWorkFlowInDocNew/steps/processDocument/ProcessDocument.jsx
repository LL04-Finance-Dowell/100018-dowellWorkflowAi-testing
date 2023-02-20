import styles from "./processDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import FormLayout from "../../formLayout/FormLayout";
import { useForm } from "react-hook-form";
import Select from "../../select/Select";
import AssignButton from "../../assignButton/AssignButton";
import { PrimaryButton } from "../../../styledComponents/styledComponents";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { newProcessActionOptions, startNewProcessV2 } from "../../../../services/processServices";
import ProgressBar from "../../../progressBar/ProgressBar";

const ProcessDocument = () => {
  const [currentProcess, setCurrentProcess] = useState();

  useEffect(() => {
    setCurrentProcess(processDocument[0]);
  }, []);

  const handleCurrentProcess = (item) => {
    setCurrentProcess(item);
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
    watch
  } = useForm();
  const { processOptionSelection } = watch();
  const [loading, setLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const { currentDocToWfs, selectedWorkflowsToDoc, processSteps, docCurrentWorkflow, tableOfContentForStep, teamMembersSelectedForProcess, userMembersSelectedForProcess, publicMembersSelectedForProcess } = useSelector((state) => state.app);
  const [ newProcessLoading, setNewProcessLoading ] = useState(false);
  const [ newProcessLoaded, setNewProcessLoaded ] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoading(true);
    console.log("workflow", data);
    setTimeout(() => setLoading(false), 2000);
  };

  const extractProcessObj = (actionVal) => {
    const processObj = {
      "company_id": userDetail?.portfolio_info[0]?.org_id,
      "created_by": userDetail?.userinfo?.username,
      "data_type": userDetail?.portfolio_info[0].data_type,
      "parent_document_id": currentDocToWfs?._id,
      "action": actionVal,
      "workflows": [{
        "workflows": {
          "workflow_title": docCurrentWorkflow.workflows?.workflow_title,
          steps: [],
        }
      }],
    }

    const foundProcessSteps = processSteps.find(process => process.workflow === docCurrentWorkflow._id);
    const tableOfContents = tableOfContentForStep.filter(content => content.workflow === docCurrentWorkflow._id);
    
    processObj.workflows[0].workflows.steps = foundProcessSteps ? foundProcessSteps.steps.map((step, currentIndex) => {
      let copyOfCurrentStep = { ...step };
      if (copyOfCurrentStep._id) delete copyOfCurrentStep._id;
      if (copyOfCurrentStep.toggleContent) delete copyOfCurrentStep.toggleContent;
      
      copyOfCurrentStep.stepRole = copyOfCurrentStep.role;
      delete copyOfCurrentStep.role;

      copyOfCurrentStep.stepPublicMembers = publicMembersSelectedForProcess.filter(selectedUser => selectedUser.stepIndex === currentIndex).map(user => {
        const copyOfUserItem = { ...user }
        delete copyOfUserItem.stepIndex;

        return copyOfUserItem
      })

      copyOfCurrentStep.stepTeamMembers = teamMembersSelectedForProcess.filter(selectedUser => selectedUser.stepIndex === currentIndex).map(user => {
        const copyOfUserItem = { ...user }
        delete copyOfUserItem.stepIndex;

        return copyOfUserItem
      })

      copyOfCurrentStep.stepUserMembers = userMembersSelectedForProcess.filter(selectedUser => selectedUser.stepIndex === currentIndex).map(user => {
        const copyOfUserItem = { ...user }
        delete copyOfUserItem.stepIndex;

        return copyOfUserItem
      })

      copyOfCurrentStep.stepDocumentCloneMap = []

      copyOfCurrentStep.stepNumber = currentIndex + 1;
      copyOfCurrentStep.stepDocumentMap = tableOfContents.filter(content => content.stepIndex === currentIndex).map(content => content.id);

      if (!copyOfCurrentStep.permitInternalWorkflow) copyOfCurrentStep.permitInternalWorkflow = false
      if (!copyOfCurrentStep.skipStep) copyOfCurrentStep.skipStep = false

      return copyOfCurrentStep
    
    }) : [];
    
    const requiredFieldKeys = Object.keys(requiredProcessStepsKeys);

    const pendingFieldsToFill = requiredFieldKeys.map(requiredKey => {
      return processObj.workflows[0].workflows.steps.every(step => step[`${requiredKey}`])
    })

    if (!pendingFieldsToFill.find(field => field === false)) return { error: `Please make sure you ${requiredProcessStepsKeys[requiredFieldKeys[pendingFieldsToFill.findIndex(field => field === false)]]} for each step` }

    const membersMissingInStep = processObj.workflows[0].workflows.steps.map(step => {
      if ((step.stepPublicMembers.length < 1) && (step.stepTeamMembers.length < 1) && (step.stepUserMembers.length < 1)) return "Please assign at least one user for each step";
      return null
    })

    if (membersMissingInStep.find(member => !null)) return { error: membersMissingInStep.find(member => !null) }

    if (!processObj.workflows[0].workflows.steps.every(step => step.stepDocumentMap.length > 0)) return { error : "Please make sure you select at least one item from the table of contents for each step" };
    
    return processObj;
  }

  const handleProcessBtnClick = async () => {
    if (!processOptionSelection || processOptionSelection === "Select") return
    
    if (!userDetail) return
    if (!currentDocToWfs) return toast.info("You have not selected a document");
    if (!docCurrentWorkflow) return toast.info("You have not selected any workflow");
    if (processSteps.length < 1) return toast.info("You have not configured steps for any workflow");
    
    const processObjToPost = extractProcessObj(newProcessActionOptions[`${processOptionSelection}`]);
    if (processObjToPost.error) return toast.info(processObjToPost.error)
    
    console.log("New process obj to post: ", processObjToPost)
    setNewProcessLoading(true);

    try {
      const response = await (await startNewProcessV2(processObjToPost)).data;
      console.log("process response: ", response);
      setNewProcessLoaded(true);
      setNewProcessLoading(false);
      toast.success(typeof response === "string" ? response : "Successfully created new process");
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
      setNewProcessLoading(false);
      toast.info(err.response ? err.response.status === 500 ? "New process creation failed" : err.response.data : "New process creation failed")
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={`h2-small step-title align-left ${styles.header}`}>
        5. Process Document
      </h2>
      <div className={styles.box}>
        <div className={styles.box__inner}>
          <h3 className={styles.box__header}>
            Select next Action in Document processing
          </h3>
          <Select name="processOptionSelection" options={proccesses} takeActionValue={true} register={register} />
          { 
            newProcessLoading ? 
            <ProgressBar durationInMS={10000} finalWidth={newProcessLoaded ? "100" : null} style={{ height: "40px" }} /> :
            <button hoverBg="success" onClick={handleProcessBtnClick}>Save / Start Proccess</button>
          }
        </div>
      </div>
    </div>
  );
};

export default ProcessDocument;

export const proccesses = [
  { id: uuidv4(), option: "Select", actionKey: "Select" },
  { id: uuidv4(), option: "Save workflows to document and keep it in draft", actionKey: "saveWorkflowToDocumentAndDrafts" },
  {
    id: uuidv4(),
    option:
      "Cancel process before completion. Document will reset to initial state",
    actionKey: "cancelProcessBeforeCompletion"
  },
  {
    id: uuidv4(),
    option: "Pause processing after completing the ongoing step",
    actionKey: "pauseProcessAfterCompletingOngoingStep"
  },
  { id: uuidv4(), option: "Resume processing from next step", actionKey: "resumeProcessingFromNextStep" },
  {
    id: uuidv4(),
    option: "Test document processing WORKFLOW WISE (Won't update real data)",
    actionKey: "testDocumentProcessWorkflowWise"
  },
  {
    id: uuidv4(),
    option: "Test document processing CONTENT WISE (Won't update real data)",
    actionKey: "testDocumentProcessWorkflowStepWise"
  },
  {
    id: uuidv4(),
    option:
      "Test document processing WORKFLOW STEP WISE (Won't update real data)",
      actionKey: "testDocumentProcessContentWise"
  },
  { id: uuidv4(), option: "START document processing WORKFLOW WISE", actionKey: "startDocumentProcessingWorkflowWise" },
  { id: uuidv4(), option: "START document processing CONTENT WISE", actionKey: "startDocumentProcessingWorkflowStepWise" },
  { id: uuidv4(), option: "START document processing WORKFLOW STEP WISE", actionKey: "startDocumentProcessingContentWise" },
  {
    id: uuidv4(),
    option:
      "Close processing and mark as completed (No further processing permitted)",
    actionKey: "closeProcessingAndMarkCompleted"
  },
];

export const workflows = [
  { id: uuidv4(), option: "Workflow 1" },
  { id: uuidv4(), option: "Workflow 2" },
  { id: uuidv4(), option: "Workflow 3" },
  { id: uuidv4(), option: "All Workflows" },
];

export const processDocument = [
  {
    id: uuidv4(),
    process: "Member (Team > Guest > Public)",
    processDetail: "Member (Team > Guest > Public)",
  },
  {
    id: uuidv4(),
    process: "Workflows (1 > 2 > 3...)",
    processDetail: "Workflows (1 > 2 > 3...)",
  },
  {
    id: uuidv4(),
    process: "Workflow steps (Step1 > Step2 > Step3..)",
    processDetail: "Workflow steps (Step1 > Step2 > Step3..)",
  },
  {
    id: uuidv4(),
    process: "Document content",
    processDetail: "Document content",
  },
  {
    id: uuidv4(),
    process: "Signing location",
    processDetail: "Signing location",
  },
  { id: uuidv4(), process: "Time limit", processDetail: "Time limit" },
];

const requiredProcessStepsKeys = {
  stepCloneCount: "select copies of document for processing",
  stepDocumentMap: "select at least one item from the table of contents",
  stepDisplay: "configure a display",
  stepProcessingOrder: "select a 'member order'",
  stepRights: "select a 'rights'",
  stepActivityType: "select a 'activity type'",
  stepLocation: "configure a location",
}