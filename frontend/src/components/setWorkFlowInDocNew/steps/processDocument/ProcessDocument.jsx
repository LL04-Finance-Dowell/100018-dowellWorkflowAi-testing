import styles from "./processDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import FormLayout from "../../formLayout/FormLayout";
import { useForm } from "react-hook-form";
import Select from "../../select/Select";
import AssignButton from "../../assignButton/AssignButton";
import { PrimaryButton } from "../../../styledComponents/styledComponents";

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
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("workflow", data);
    setTimeout(() => setLoading(false), 2000);
  };

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
          <Select name="proccess" options={proccesses} register={register} />
          <button hoverBg="success">Save / Start Proccess</button>
        </div>
      </div>
    </div>
  );
};

export default ProcessDocument;

export const proccesses = [
  { id: uuidv4(), option: "Select" },
  { id: uuidv4(), option: "Save workflows to document and keep it in draft" },
  {
    id: uuidv4(),
    option:
      "Cancel process before completion. Document will reset to initial state",
  },
  {
    id: uuidv4(),
    option: "Pause processing after completing the ongoing step",
  },
  { id: uuidv4(), option: "Resume processing from next step" },
  {
    id: uuidv4(),
    option: "Test document processing WORKFLOW WISE (Won't update real data)",
  },
  {
    id: uuidv4(),
    option: "Test document processing CONTENT WISE (Won't update real data)",
  },
  {
    id: uuidv4(),
    option:
      "Test document processing WORKFLOW STEP WISE (Won't update real data)",
  },
  { id: uuidv4(), option: "START document processing WORKFLOW WISE" },
  { id: uuidv4(), option: "START document processing CONTENT WISE" },
  { id: uuidv4(), option: "START document processing WORKFLOW STEP WISE" },
  {
    id: uuidv4(),
    option:
      "Close processing and mark as completed (No further processing permitted)",
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
