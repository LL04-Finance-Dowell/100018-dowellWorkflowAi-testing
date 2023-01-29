import styles from "./connectWorkFlowToDoc.module.css";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronUp } from "react-icons/bs";
import Contents from "../../contents/Contents";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocCurrentWorkflow } from "../../../../features/app/appSlice";
import Collapse from "../../../../layouts/collapse/Collapse";
import { FaArrowDown, FaRegistered } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import Dropdown from "./dropdown/Dropdown";
import { LoadingSpinner } from "../../../LoadingSpinner/LoadingSpinner";
import BookSpinner from "../../../bookSpinner/BookSpinner";
import { PrimaryButton } from "../../../styledComponents/styledComponents";
import { useForm } from "react-hook-form";
import CopiesOfDoc from "./contents/copiesOfDoc/CopiesOfDoc";
import AssignDocumentMap from "./contents/assignDocumentMap/AssignDocumentMap";
import SelectMembersToAssign from "./contents/selectMembersToAssign/SelectMembersToAssign";
import AssignCollapse from "./contents/assignCollapse/AssignCollapse";

const ConnectWorkFlowToDoc = () => {
  const { register } = useForm();
  const dispatch = useDispatch();

  const { contentOfDocument, contentOfDocumentStatus } = useSelector(
    (state) => state.document
  );
  const { wfToDocument, docCurrentWorkflow } = useSelector(
    (state) => state.app
  );

  console.log("wftooooooooooo", wfToDocument);

  const [currentSteps, setCurrentSteps] = useState([]);

  useEffect(() => {
    setCurrentSteps(docCurrentWorkflow?.workflows?.steps);
  }, [docCurrentWorkflow]);

  const [contentToggle, setContentToggle] = useState(false);

  console.log("sssssssssssssssssss", wfToDocument);

  useEffect(() => {
    setCurrentSteps(
      docCurrentWorkflow ? docCurrentWorkflow?.workflows?.steps : []
    );
  }, [docCurrentWorkflow]);

  const handleToggleContent = (id) => {
    setCurrentSteps((prev) =>
      prev.map((step) =>
        step._id === id ? { ...step, toggleContent: !step.toggleContent } : step
      )
    );
  };

  console.log("currrrr", contentOfDocument);

  return (
    <>
      <div className={styles.container}>
        <h2 className="h2-small step-title align-left">
          3. Connect Selected Workflows to the selected Document
        </h2>

        {"contentOfDocumentStatus" === "pending" ? (
          <div style={{ marginBottom: "15px" }}>
            <BookSpinner />
          </div>
        ) : (
          <>
            <Dropdown />
            {docCurrentWorkflow && (
              <div className={styles.step__container}>
                {currentSteps &&
                  currentSteps?.map((item, index) => (
                    <div className={styles.step__box}>
                      <div>
                        <div
                          onClick={() => setContentToggle((prev) => !prev)}
                          className={`${styles.header} ${styles.title__box}`}
                        >
                          {docCurrentWorkflow.workflows?.workflow_title}
                        </div>
                        <div
                          className={`${styles.step__header} ${styles.title__box}`}
                        >
                          {item.step_name}
                        </div>
                      </div>
                      <div>
                        <div className={styles.checkbox}>
                          <input
                            {...register("skip")}
                            id="skip"
                            type="checkbox"
                          />
                          <label htmlFor="skip"> Skip this Step</label>
                        </div>
                        <div className={styles.checkbox}>
                          <input
                            {...register("permit")}
                            id="permit"
                            type="checkbox"
                          />
                          <label htmlFor="permit">
                            Permit internal workflow in this Step
                          </label>
                        </div>
                      </div>
                      <div className={styles.diveder}></div>
                      <CopiesOfDoc />
                      <div className={styles.diveder}></div>
                      <AssignDocumentMap />
                      <div className={styles.diveder}></div>
                      <SelectMembersToAssign />
                      <div className={styles.diveder}></div>
                      <AssignCollapse />
                      <div className={styles.container__button__box}>
                        <PrimaryButton hoverBg="error">
                          Reset this step & its successors
                        </PrimaryButton>
                        <PrimaryButton hoverBg="success">
                          Set this step & proceed to next
                        </PrimaryButton>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ConnectWorkFlowToDoc;

const mapDocuments = [
  { id: uuidv4(), content: "Workflow" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
];
