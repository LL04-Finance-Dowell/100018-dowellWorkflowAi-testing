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
import { createNewProcess } from "../../../../services/processServices";
import { LoadingSpinner } from "../../../LoadingSpinner/LoadingSpinner";
import { setContentOfDocument } from "../../../../features/document/documentSlice";

const ProcessDocument = () => {
  const [currentProcess, setCurrentProcess] = useState();
  const { currentDocToWfs, selectedWorkflowsToDoc, processSteps } = useSelector((state) => state.app);
  const [ workflowsDataToDisplay, setWorkflowsDataToDisplay ] = useState([]);
  const { userDetail } = useSelector((state) => state.auth);
  const [ newProcessLoading, setNewProcessLoading ] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentProcess(processDocument[0]);
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

  const handleSaveWorkflowToDocument = () => {
    if (workflowsDataToDisplay.length < 1) return
    toast.success("Sucessfully saved workflows to document")
  }

  const handleStartNewProcess = async () => {
    if (!userDetail) return
    if (!currentDocToWfs) return toast.info("You have not selected a document");
    if (selectedWorkflowsToDoc.length < 1) return toast.info("You have not selected any workflows");
    if (processSteps.length < 1) return toast.info("You have not configured steps for any workflow");
    
    setNewProcessLoading(true);

    const newProcessObj = {
      "document_id": currentDocToWfs?._id,
      "company_id": userDetail?.portfolio_info[0]?.org_id,
      "created_by": userDetail?.userinfo?.username,
      "data_type": userDetail?.portfolio_info[0].data_type,
      "workflows": [],
    }

    selectedWorkflowsToDoc.forEach(workflow => {
      const foundProcessSteps = processSteps.filter(process => process.workflow === workflow._id)
      let newWorkflowObj = {
        "created_by": workflow?.created_by,
        "company_id": workflow?.company_id,
        "data_type": workflow?.workflows?.data_type,
        "wf_title": workflow?.workflows?.workflow_title,
        "steps": foundProcessSteps,
      }
      newProcessObj.workflows.push(newWorkflowObj);
    })

    console.log("Process obj to post: ", newProcessObj);
    
    try {
      const response = await (await createNewProcess(newProcessObj)).data;
      console.log("process response: ", response);
      toast.success("Succesfully saved workflows to document!");
      setNewProcessLoading(false);
      
      dispatch(resetSetWorkflows());
      dispatch(setContentOfDocument(null));
      dispatch(setProcessSteps([]));
      dispatch(setSelectedMembersForProcess([]));

    } catch (error) {
      setNewProcessLoading(false);
      console.log(error);
      toast.error("An error occured while trying to save your workflows to your document");
    }
  }

  return (
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

          <div className={styles.button__container} onClick={handleSaveWorkflowToDocument}>
            <a className={styles.save__workflows__button}>
              Save Workflows to document
            </a>
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
                    onClick={() => handleCurrentProcess(item)}
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
                        newProcessLoading ? <LoadingSpinner /> : 
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
