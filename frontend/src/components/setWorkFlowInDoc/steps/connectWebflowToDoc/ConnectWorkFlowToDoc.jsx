import styles from "./connectWorkFlowToDoc.module.css";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronUp } from "react-icons/bs";
import AssignDocumentMap from "./assignForms/forms/assignDocumentMap/AssignDocumentMap";
import AsignTask from "./assignForms/forms/assignTask/AssignTask";
import AssignLocation from "./assignForms/forms/assignLocation/AssignLocation";
import AssignTime from "./assignForms/forms/assignTime/AssignTimes";
import Contents from "../../contents/Contents";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocCurrentWorkflow } from "../../../../features/app/appSlice";
import Collapse from "../../../../layouts/collapse/Collapse";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import Dropdown from "./dropdown/Dropdown";

const ConnectWorkFlowToDoc = () => {
  const dispatch = useDispatch();

  const [toggleContent, setToggleContent] = useState(false);
  const { wfToDocument, docCurrentWorkflow } = useSelector(
    (state) => state.app
  );

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

  const handleCurrentWorkflow = (item) => {
    dispatch(setDocCurrentWorkflow(item));
  };

  const handleToggleCollapse = () => {
    setContentToggle((prev) => !prev);
  };

  console.log("currrrr", currentSteps);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.step__title__box}>
          <h2 className="h2-small step-title">
            3. Connect Selected Workflows to the selected Document
          </h2>
        </div>

        <>
          <Dropdown />
          {/* <div className={styles.workflows__container}>
              {wfToDocument.workflows?.map((item) => (
                <div
                  style={{
                    backgroundColor:
                      item._id === docCurrentWorkflow?._id &&
                      "var(--e-global-color-accent)",
                  }}
                  onClick={() => handleCurrentWorkflow(item)}
                  key={item._id}
                  className={styles.workflow__box}
                >
                  {item.workflows.workflow_title}
                </div>
              ))}
            </div> */}
          {docCurrentWorkflow && (
            <div className={styles.step__container}>
              {currentSteps &&
                currentSteps?.map((item) => (
                  <div key={item._id} className={styles.step__box}>
                    <div
                      onClick={() => setContentToggle((prev) => !prev)}
                      className={`${styles.header} h2-medium`}
                    >
                      {docCurrentWorkflow.workflows?.workflow_title}
                    </div>
                    <div className={styles.step__header}>{item.step_name}</div>
                    <div className={styles.skip}>
                      <input type="checkbox" />
                      Skip this Step
                    </div>

                    <AssignDocumentMap />
                    <div>
                      <div className={styles.table__of__contents__header}>
                        <span>Table of Contents</span>
                        <i onClick={() => handleToggleContent(item._id)}>
                          {item.toggleContent ? (
                            <BsChevronUp />
                          ) : (
                            <BsChevronDown />
                          )}
                        </i>
                      </div>
                      <Contents
                        contents={mapDocuments}
                        toggleContent={item.toggleContent}
                      />
                    </div>
                    <AsignTask />
                    <AssignLocation />
                    <AssignTime />
                  </div>
                ))}
            </div>
          )}
        </>

        <div className="bottom-line">
          <span></span>
        </div>
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
