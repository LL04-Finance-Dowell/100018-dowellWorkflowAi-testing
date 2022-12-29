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
import { setDocCurrentWorkflow, setProcessSteps, updateSingleProcessStep } from "../../../../features/app/appSlice";
import Collapse from "../../../../layouts/collapse/Collapse";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import Dropdown from "./dropdown/Dropdown";
import { LoadingSpinner } from "../../../LoadingSpinner/LoadingSpinner";
import BookSpinner from "../../../bookSpinner/BookSpinner";

const ConnectWorkFlowToDoc = () => {
  const dispatch = useDispatch();

  const { contentOfDocument, contentOfDocumentStatus } = useSelector(
    (state) => state.document
  );
  const { wfToDocument, docCurrentWorkflow, selectedWorkflowsToDoc } = useSelector(
    (state) => state.app
  );

  console.log("wftooooooooooo", wfToDocument);

  const [currentSteps, setCurrentSteps] = useState([]);

  useEffect(() => {
    setCurrentSteps(docCurrentWorkflow?.workflows?.steps);
  }, [docCurrentWorkflow]);

  const [contentToggle, setContentToggle] = useState(false);
  const [ showSteps, setShowSteps ] = useState([]);

  console.log("sssssssssssssssssss", wfToDocument);

  useEffect(() => {
    setCurrentSteps(
      docCurrentWorkflow ? docCurrentWorkflow?.workflows?.steps : []
    );
    let singleShowStepArr = docCurrentWorkflow ? docCurrentWorkflow?.workflows?.steps.map(step => {
      return {
        _id: step._id,
        showStep: true
      }
    }) : []
    setShowSteps(singleShowStepArr)

    if (!docCurrentWorkflow) return

    const [ stepsForWorkflow, stepsObj ] = [ [], { workflow: docCurrentWorkflow._id, steps: docCurrentWorkflow.workflows?.steps, }];
    stepsForWorkflow.push(stepsObj);
    
    dispatch(setProcessSteps(stepsForWorkflow));

  }, [docCurrentWorkflow]);

  const handleToggleContent = (id) => {
    setCurrentSteps((prev) =>
      prev.map((step) =>
        step._id === id ? { ...step, toggleContent: !step.toggleContent } : step
      )
    );
  };

  console.log("currrrr", contentOfDocument);

  const handleSkipSelection = (e, showStepIdToUpdate, workflowId, stepIndexToUpdate) => {
    let currentShowSteps = showSteps.slice();
    let foundStepIndex = currentShowSteps.findIndex(step => step._id === showStepIdToUpdate);
    
    if (foundStepIndex === -1) return
    
    if (e.target.checked) {
      currentShowSteps[foundStepIndex].showStep = false;
      dispatch(updateSingleProcessStep({ 
        'skip': true, 
        'workflow': workflowId, 
        'indexToUpdate': stepIndexToUpdate, 
        'member_type': '',
        'member': '',
        'member_portfolio': '',
        'rights': '',
        'display_before': ''
      }))
      return setShowSteps(currentShowSteps)
    }

    currentShowSteps[foundStepIndex].showStep = true;
    setShowSteps(currentShowSteps)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.step__title__box}>
          <h2 className="h2-small step-title">
            3. Connect Selected Workflows to the selected Document
          </h2>
        </div>

        {contentOfDocumentStatus === "pending" ? (
          <div style={{ marginBottom: "15px" }}>
            <BookSpinner />
          </div>
        ) : (
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
                  currentSteps?.map((item, index) => (
                    <div key={item._id} className={styles.step__box}>
                      <div
                        onClick={() => setContentToggle((prev) => !prev)}
                        className={`${styles.header} h2-medium`}
                      >
                        {docCurrentWorkflow.workflows?.workflow_title}
                      </div>
                      <div className={styles.step__header}>
                        {item.step_name}
                      </div>
                      <div className={styles.skip}>
                        <input type="checkbox" onChange={(e) => handleSkipSelection(e, item._id, docCurrentWorkflow._id, index)} />
                        Skip this Step
                      </div>

                      <AssignDocumentMap currentStepIndex={index} />
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
                        {contentOfDocument && (
                          <Contents
                            contents={contentOfDocument}
                            toggleContent={item.toggleContent}
                          />
                        )}
                      </div>
                      <AsignTask currentStepIndex={index} stepSkipped={showSteps.find(step => step._id === item._id && step.showStep)} />
                      <AssignLocation currentStepIndex={index} />
                      <AssignTime currentStepIndex={index} />
                    </div> 
                  ))}
              </div>
            )}
          </>
        )}

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
