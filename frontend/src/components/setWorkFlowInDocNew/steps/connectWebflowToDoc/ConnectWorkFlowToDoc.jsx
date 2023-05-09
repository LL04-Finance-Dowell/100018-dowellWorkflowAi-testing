import styles from "./connectWorkFlowToDoc.module.css";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronUp } from "react-icons/bs";
import Contents from "../../contents/Contents";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocCurrentWorkflow, setProcessSteps, setSavedProcessConfigured, updateSingleProcessStep } from "../../../../features/app/appSlice";
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
import React from "react";
import { useTranslation } from "react-i18next";

const ConnectWorkFlowToDoc = ({ stepsPopulated, savedProcessSteps }) => {
  const { register } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { savedProcessConfigured } = useSelector((state) => state.app);

  const { contentOfDocument, contentOfDocumentStatus } = useSelector(
    (state) => state.document
  );
  const { wfToDocument, docCurrentWorkflow, processSteps } = useSelector(
    (state) => state.app
  );

  // console.log("wftooooooooooo", wfToDocument);

  const [currentSteps, setCurrentSteps] = useState([]);
  const [ enabledSteps, setEnabledSteps ] = useState([]);
  const [showSteps, setShowSteps] = useState([]);

  useEffect(() => {
    setCurrentSteps(docCurrentWorkflow?.workflows?.steps);
  }, [docCurrentWorkflow]);

  const [contentToggle, setContentToggle] = useState(false);

  // console.log("sssssssssssssssssss", wfToDocument);

  useEffect(() => {
    if (stepsPopulated && !savedProcessConfigured) {
      const processStepsToSet = savedProcessSteps[0].steps.map(step => {
        const copyOfStep = {...step};
        const tt = Object.keys(copyOfStep)
        .filter(key => key !== 'stepPublicMembers' && key !== 'stepTeamMembers' && key !== 'stepUserMembers' && key !== 'stepDocumentMap')
        .reduce((obj, key) => {
          obj[key] = copyOfStep[key];
          return obj;
        }, {});
        return tt
      })
      
      const savedProcessStepsToSet = [{
        workflow: savedProcessSteps[0].workflow,
        steps: processStepsToSet,
      }]

      dispatch(setProcessSteps(savedProcessStepsToSet));
      
      // this will also be updated in the nearest future to capture multiple workflows
      const enabledSavedSteps = savedProcessSteps[0]?.steps?.map((step, index) => {
        if (step.stepPublicMembers.length > 0 || step.stepTeamMembers.length > 0 || step?.stepDocumentMap?.length > 0 || step?.stepRights?.length > 0) {
          return {
            _id: docCurrentWorkflow?.workflows?.steps[index]._id,
            index: index,
            enableStep: true
          }
        }
        return null
      }).filter(step => step);
      setEnabledSteps(enabledSavedSteps);
      dispatch(setSavedProcessConfigured(true));
      return
    }
    setCurrentSteps(
      docCurrentWorkflow ? docCurrentWorkflow?.workflows?.steps : []
    );

    let stepsEnabled = docCurrentWorkflow ? 
      docCurrentWorkflow?.workflows?.steps.map((step, index) => {
        return {
          _id: step._id,
          index: index,
          enableStep: false,
        };
      }) : 
    [];

    if (stepsEnabled.length > 0) stepsEnabled[0].enableStep = true;
    setEnabledSteps(stepsEnabled)

    let singleShowStepArr = docCurrentWorkflow ? 
      docCurrentWorkflow?.workflows?.steps.map((step) => {
        return {
          _id: step._id,
          showStep: true,
        };
      }) : 
    [];
    setShowSteps(singleShowStepArr);

    
    if (!docCurrentWorkflow || stepsPopulated) return

    const [stepsForWorkflow, stepsObj] = [
      [],
      {
        workflow: docCurrentWorkflow?._id,
        steps: docCurrentWorkflow?.workflows?.steps,
      },
    ];
    stepsForWorkflow.push(stepsObj);

    dispatch(setProcessSteps(stepsForWorkflow));
  }, [docCurrentWorkflow, stepsPopulated, savedProcessSteps]);

  const handleToggleContent = (id) => {
    setCurrentSteps((prev) =>
      prev.map((step) =>
        step._id === id ? { ...step, toggleContent: !step.toggleContent } : step
      )
    );
  };

  // console.log("currrrr", contentOfDocument);

  const handleSkipSelection = (e, showStepIdToUpdate, workflowId, stepIndexToUpdate) => {
    let currentShowSteps = showSteps.slice();
    let foundStepIndex = currentShowSteps.findIndex((step) => step._id === showStepIdToUpdate);

    if (foundStepIndex === -1) return;

    if (e.target.checked) {
      currentShowSteps[foundStepIndex].showStep = false;
      dispatch(
        updateSingleProcessStep({
          skipStep: true,
          workflow: workflowId,
          indexToUpdate: stepIndexToUpdate,
          stepPublicMembers: [],
          stepTeamMembers: [],
          stepUserMembers: [],
          stepDisplay: "",
        })
      );
      handleSetStepAndProceedToNext(stepIndexToUpdate);
      return setShowSteps(currentShowSteps);
    }

    currentShowSteps[foundStepIndex].showStep = true;
    dispatch(
      updateSingleProcessStep({
        skipStep: false,
        workflow: workflowId,
        indexToUpdate: stepIndexToUpdate,
      })
    );
    setShowSteps(currentShowSteps);
    handleSetStepAndProceedToNext(stepIndexToUpdate, true);
  };

  const handlePermitInternalSelection = (e, workflowId, stepIndexToUpdate) => {
    const stepSkipped = processSteps.find(
      process => process.workflow === docCurrentWorkflow?._id
    )?.steps[stepIndexToUpdate]?.skipStep;

    if (stepSkipped) {
      e.target.checked = false;
      return;
    }

    if (e.target.checked) {
      dispatch(
        updateSingleProcessStep({
          permitInternalWorkflow: true,
          workflow: workflowId,
          indexToUpdate: stepIndexToUpdate,
        })
      );
      return
    }
    dispatch(
      updateSingleProcessStep({
        permitInternalWorkflow: false,
        workflow: workflowId,
        indexToUpdate: stepIndexToUpdate,
      })
    );
  }

  const handleResetStepAndSuccessors = (indexPassed) => {
    console.log("resetting...")
  }

  const handleSetStepAndProceedToNext = (indexPassed, disableNextStep=false) => {
    const currentEnabledSteps = enabledSteps.slice();
    const foundCurrentStepIndex = currentEnabledSteps.findIndex(step => step.index === indexPassed)

    if (foundCurrentStepIndex === -1) return

    if (currentEnabledSteps[foundCurrentStepIndex + 1]) {
      currentEnabledSteps[foundCurrentStepIndex + 1].enableStep = disableNextStep ? false : true;
      setEnabledSteps(currentEnabledSteps);
      if (disableNextStep) return;
      const foundNextStepElem = document.getElementById(`process-step-${foundCurrentStepIndex + 1}`);
      if (foundNextStepElem) foundNextStepElem.scrollIntoView();
    }
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className="h2-small step-title align-left">
          3. {t("Connect Selected Workflows to the selected Document")}
        </h2>

        {"contentOfDocumentStatus" === "pending" ? (
          <div style={{ marginBottom: "15px" }}>
            <BookSpinner />
          </div>
        ) : (
          <>
            <Dropdown disableClick={stepsPopulated ? true : false} />
            {docCurrentWorkflow && (
              <div className={styles.step__container}>
                {currentSteps &&
                  React.Children.toArray(currentSteps?.map((item, index) => (
                    <div 
                      className={styles.step__box} 
                      style={{ 
                        pointerEvents: enabledSteps.find(
                          step => 
                            step.index === index && 
                            step._id === item._id && 
                            step.enableStep === true
                        ) ? 
                        "" : 
                        "none"
                      }}
                      id={`process-step-${index}`}
                    >
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
                          {item.step_name ? item.step_name : item.steps ? item.steps[index]?.stepName : ''}
                        </div>
                      </div>
                      <div>
                        <div className={styles.checkbox}>
                          <input
                            {...register("skip")}
                            id={"skip-" + index}
                            type="checkbox"
                            onChange={(e) =>
                              handleSkipSelection(
                                e,
                                item._id,
                                docCurrentWorkflow._id,
                                index
                              )
                            }
                            value={
                              processSteps.find(
                                process => process.workflow === docCurrentWorkflow?._id
                              )?.steps[index]?.skipStep
                            }
                            checked={
                              processSteps.find(
                                process => process.workflow === docCurrentWorkflow?._id
                              )?.steps[index]?.skipStep
                            }
                          />
                          <label htmlFor={"skip-" + index}>Skip this Step</label>
                        </div>
                        <div className={styles.checkbox}>
                          <input
                            {...register("permit")}
                            id={"permit-" + index}
                            type="checkbox"
                            onChange={(e) => {
                              handlePermitInternalSelection(
                                e,
                                docCurrentWorkflow._id,
                                index
                              )
                            }}
                            value={
                              processSteps.find(
                                process => process.workflow === docCurrentWorkflow?._id
                              )?.steps[index]?.permitInternalWorkflow
                            }
                            style={
                              {
                                cursor: processSteps.find(
                                  process => process.workflow === docCurrentWorkflow?._id
                                )?.steps[index]?.skipStep ? "not-allowed" : "default"
                              }
                            }
                            checked={
                              processSteps.find(
                                process => process.workflow === docCurrentWorkflow?._id
                              )?.steps[index]?.permitInternalWorkflow
                            }
                          />
                          <label htmlFor={"permit-" + index}>
                            Permit internal workflow in this Step
                          </label>
                        </div>
                      </div>
                      <div className={styles.diveder}></div>
                      <CopiesOfDoc currentStepIndex={index} stepsPopulated={stepsPopulated} />
                      <div className={styles.diveder}></div>
                      <AssignDocumentMap currentStepIndex={index} stepsPopulated={stepsPopulated} />
                      <div className={styles.diveder}></div>
                      <SelectMembersToAssign currentStepIndex={index} stepsPopulated={stepsPopulated} currentEnabledSteps={enabledSteps} />
                      <div className={styles.diveder}></div>
                      <AssignCollapse currentStepIndex={index} stepsPopulated={stepsPopulated} />
                      <div className={styles.container__button__box}>
                        <PrimaryButton hoverBg="error" onClick={() => handleResetStepAndSuccessors(index)}>
                          Reset this step & its successors
                        </PrimaryButton>
                        <PrimaryButton hoverBg="success" onClick={() => handleSetStepAndProceedToNext(index)}>
                          Set this step & proceed to next
                        </PrimaryButton>
                      </div>
                    </div>
                  )))}
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
