import styles from "./processDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import FormLayout from "../../formLayout/FormLayout";
import { useForm } from "react-hook-form";
import Select from "../../select/Select";
import AssignButton from "../../assignButton/AssignButton";
import { useDispatch, useSelector } from "react-redux";
import { removeFromSelectedWorkflowsToDoc, resetSetWorkflows, setProcessSteps, setSelectedMembersForProcess } from "../../../../features/app/appSlice";
import { toast } from "react-toastify";
import { saveWorkflowsToDocument, startNewProcess } from "../../../../services/processServices";
import { LoadingSpinner } from "../../../LoadingSpinner/LoadingSpinner";
import { setContentOfDocument } from "../../../../features/document/documentSlice";
import { AiOutlineClose } from "react-icons/ai";
import React from "react";
import ProgressBar from "../../../progressBar/ProgressBar";

const ProcessDocument = () => {
  const [currentProcess, setCurrentProcess] = useState();
  const { currentDocToWfs, selectedWorkflowsToDoc, processSteps, docCurrentWorkflow, tableOfContentForStep } = useSelector((state) => state.app);
  const [ workflowsDataToDisplay, setWorkflowsDataToDisplay ] = useState([]);
  const { userDetail } = useSelector((state) => state.auth);
  const [ newProcessLoading, setNewProcessLoading ] = useState(false);
  const [ newWorkflowSavedToDoc, setNewWorkflowSavedToDoc ] = useState(null);
  const [ saveWorkflowsLoading, setSaveWorkflowsLoading ] = useState(false);
  const [ currentProcessValue, setCurrentProcessValue ] = useState(null);
  const [ showGeneratedLinksPopup, setShowGeneratedLinksPopup ] = useState(false);
  const [ generatedLinks, setGeneratedLinks ] = useState([])
  const [ copiedLinks, setCopiedLinks ] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentProcess(processDocument[0]);
    setCurrentProcessValue(processDocument[0].value);
  }, []);

  useEffect(() => {
    
    let formattedSelectedWorkflowsData = selectedWorkflowsToDoc.map(workflow => {
      let workFlowObj = { ...workflow };
      if (workflow.workflows && workflow.workflows.workflow_title) workFlowObj.option = workflow.workflows.workflow_title;

      return workFlowObj
    })
    setWorkflowsDataToDisplay(formattedSelectedWorkflowsData);

  }, [selectedWorkflowsToDoc])

  const handleCurrentProcess = (item) => {
    setCurrentProcess(item);
    setCurrentProcessValue(item.value);
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(removeFromSelectedWorkflowsToDoc(data.workflows));
    console.log("workflow", data);
    setTimeout(() => setLoading(false), 2000);
  };

  const extractProcessObj = () => {
    const processObj = {
      "document_id": currentDocToWfs?._id,
      "company_id": userDetail?.portfolio_info[0]?.org_id,
      "created_by": userDetail?.userinfo?.username,
      "data_type": userDetail?.portfolio_info[0].data_type === "Real_Data" ? "real" : userDetail?.portfolio_info[0].data_type,
      "workflows": [{
        "workflows": {
          "workflow_title": docCurrentWorkflow.workflows?.workflow_title,
          steps: [],
        }
      }],
    }
    const foundProcessSteps = processSteps.find(process => process.workflow === docCurrentWorkflow._id);
    const tableOfContents = tableOfContentForStep.filter(content => content.workflow === docCurrentWorkflow._id);
    console.log("Table of contents for current workflow: ", tableOfContents)
    processObj.workflows[0].workflows.steps = foundProcessSteps ? foundProcessSteps.steps.map((step, currentIndex) => {
      let copyOfCurrentStep = { ...step };
      if (copyOfCurrentStep._id) delete copyOfCurrentStep._id;
      if (copyOfCurrentStep.toggleContent) delete copyOfCurrentStep.toggleContent;
      copyOfCurrentStep.document_map = tableOfContents.filter(content => content.stepIndex === currentIndex).map(content => content.id)
      return copyOfCurrentStep
    }) : [];

    return processObj;
  }

  const handleSaveWorkflowToDocument = async (e) => {
    e.preventDefault();

    if (!userDetail) return
    if (!currentDocToWfs) return toast.info("You have not selected a document");
    if (!docCurrentWorkflow) return toast.info("You have not selected any workflow");
    if (processSteps.length < 1) return toast.info("You have not configured steps for any workflow");
    
    const newProcessObj = extractProcessObj();

    console.log("Saving workflows process obj to post: ", newProcessObj);

    setSaveWorkflowsLoading(true);

    try {
      const response = await (await saveWorkflowsToDocument(newProcessObj)).data;
      console.log("save workflows response: ", response);
      toast.success("Successfully saved workflows to document!");
      setSaveWorkflowsLoading(false);
      setNewWorkflowSavedToDoc({ "saveSuccess" : true });
      setTimeout(() => setNewWorkflowSavedToDoc(null), 1500);
    } catch (error) {
      setSaveWorkflowsLoading(false);
      console.log(error.response ? error.response.data : error.message);
      toast.error("An error occured while trying to save your workflows to your document");
    }
  }

  const handleStartNewProcess = async () => {
    if (!userDetail) return
    if (!currentDocToWfs) return toast.info("You have not selected a document");
    if (!docCurrentWorkflow) return toast.info("You have not selected any workflow");

    const startProcessObj = extractProcessObj();
    startProcessObj.criteria = currentProcessValue;

    console.log("Starting process obj to post: ", startProcessObj);

    setNewProcessLoading(true);

    try {
      
      const response = await (await startNewProcess(startProcessObj)).data;
      console.log("process response: ", response)
      setNewProcessLoading(false);
      setGeneratedLinks(response);
      setShowGeneratedLinksPopup(true);

    } catch (error) {
      setNewProcessLoading(false);
      console.log(error.response ? error.response.data : error.message);
      toast.error("An error occured while trying to start a new process");
    }
  }

  const handleCopyLink = (link) => {
    if (!link) return

    navigator.clipboard.writeText(link);
    const currentCopiedLinks  = copiedLinks.slice();
    currentCopiedLinks.push(link);
    setCopiedLinks(currentCopiedLinks);
  }

  return (
    <>
    <div className={styles.container}>
      <h2 className={`h2-small step-title ${styles.header}`}>
        5. Process Document
      </h2>
      <div className={styles.box}>
        <div className={styles.left__container}>
          <div className={styles.form__box}>
            <FormLayout isSubmitted={isSubmitted} loading={loading}>
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="workflows">Select workflows to remove</label>
                <Select
                  register={register}
                  name="workflows"
                  options={workflowsDataToDisplay}
                  takeIdValue={true}
                />
                <AssignButton buttonText="Remove Workflows" loading={loading} />
              </form>
            </FormLayout>
          </div>

          <div className={styles.button__container}>
            { 
              newWorkflowSavedToDoc ? <p>Workflows saved to document</p> :
              saveWorkflowsLoading ? <LoadingSpinner /> : 
              <a className={styles.save__workflows__button} onClick={handleSaveWorkflowToDocument}>
                Save Workflows to document
              </a>
            }
            <a className={styles.close__button}>Close</a>
          </div>
        </div>
        <div className={styles.right__container}>
          <div className={styles.right__box}>
            <div
              style={{
                position: "relative",
              }}
              className={styles.process__container}
            >
              {processDocument.map((item) => (
                <>
                  <div
                    onClick={newProcessLoading ? () => {} : () => handleCurrentProcess(item)}
                    className={`${styles.process__box} ${
                      item.id === currentProcess?.id && styles.active__process
                    }`}
                  >
                    {item.process}
                  </div>
                  <div
                    style={{
                      display: `${
                        item.id === currentProcess?.id ? "block" : "none"
                      }`,
                    }}
                    className={styles.process__detail__container}
                  >
                    <div className={styles.process__detail__box}>
                      <p>{currentProcess && currentProcess.processDetail}</p>
                      { 
                        newProcessLoading ? <ProgressBar durationInMS={65000} /> : 
                        <p className={styles.start__processing__button} onClick={handleStartNewProcess}>
                          Save & Start Processing
                        </p>
                      }
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-line">
        <span
          style={{ backgroundColor: "var(--e-global-color-1342d1f)" }}
        ></span>
      </div>
      
    </div>
    {
      showGeneratedLinksPopup && <div className={styles.process__Generated__Links__Overlay}>
        <div className={styles.process__Generated__Links__Container}>
          <div className={styles.process__Generated__Links__Container__Close__Icon} onClick={() => setShowGeneratedLinksPopup(false)}>
            <AiOutlineClose />
          </div>
          <div className={styles.process__Generated__Links__Title__Item}>
            <span>S/No.</span>
            <span className={styles.process__Generated__Links__Link__Item}>Links</span>
            <span>QR Code</span>
            <span>Copy</span>
          </div>
          {
            React.Children.toArray(generatedLinks.map((link, index) => {
              return <div className={styles.process__Generated__Links__Title__Item}>
                <span className={styles.process__Generated__Links__Num__Item}>{index + 1}.</span>
                <span className={`${styles.process__Generated__Links__Link__Item} ${styles.single__Link}`} onClick={() => handleCopyLink(Object.values(link)[0])}>{typeof link === "object" ? Object.values(link)[0] : ""}</span>
                <span className={styles.process__Generated__Links__Num__Item}>QR Code</span>
                <span className={styles.process__Generated__Links__Copy__Item} onClick={() => handleCopyLink(Object.values(link)[0])}>{typeof link === "object" && copiedLinks.includes(Object.values(link)[0]) ? "Copied" : "Copy"}</span>
              </div>
            }))
          }
        </div>
      </div>
    }
  </>
  );
};

export default ProcessDocument;

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
    value: "member",
  },
  {
    id: uuidv4(),
    process: "Workflows (1 > 2 > 3...)",
    processDetail: "Workflows (1 > 2 > 3...)",
    value: "workflow",
  },
  {
    id: uuidv4(),
    process: "Workflow steps (Step1 > Step2 > Step3..)",
    processDetail: "Workflow steps (Step1 > Step2 > Step3..)",
    value: "steps",
  },
  {
    id: uuidv4(),
    process: "Document content",
    processDetail: "Document content",
    value: "document_content",
  },
  {
    id: uuidv4(),
    process: "Signing location",
    processDetail: "Signing location",
    value: "signing_location"
  },
  { id: uuidv4(), process: "Time limit", processDetail: "Time limit", value: "time_limit" },
];
