import { useEffect } from "react";
import globalStyles from "../../connectWorkFlowToDoc.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import AssignButton from "../../../../assignButton/AssignButton";
import { useState } from "react";
import FormLayout from "../../../../formLayout/FormLayout";
import Select from "../../../../select/Select";
import { useDispatch, useSelector } from "react-redux";
import Contents from "../../../../contents/Contents";
import { LoadingSpinner } from "../../../../../LoadingSpinner/LoadingSpinner";

import { useTranslation } from 'react-i18next';
import { removeFromTableOfContentForStep, setTableOfContentForStep } from "../../../../../../features/processes/processesSlice";

const AssignDocumentMap = ({ currentStepIndex, stepsPopulated }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { contentOfDocument } = useSelector((state) => state.document);
  const { docCurrentWorkflow, tableOfContentForStep, processSteps } =
    useSelector((state) => state.processes);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [copiedDoc, setCopiedDoc] = useState([])

  ////copied process
  const copiedProcess = useSelector((state) => state.copyProcess.processStep);
  
  useEffect(() => {
    if (copiedProcess == null) {
      return;
    }
    // // console.log('entered the pick document phase', copiedProcess.process_steps);
  
    // Create a temporary array to accumulate the changes
    const newTableOfContentArr = [];
  
    for (let i = 0; i < copiedProcess.process_steps.length; i++) {
      for (let y = 0; y < copiedProcess.process_steps[i].stepDocumentMap.length; y++) {
        const content = {
          "id": `${copiedProcess.process_steps[i].stepDocumentMap[y].content}`,
          "pageNum": copiedProcess.process_steps[i].stepDocumentMap[y].page
        };
        const jsonContent = JSON.stringify(content);
        const newTableOfContentObj = {
          ...content,
          workflow: docCurrentWorkflow._id,
          stepIndex: i,
          required: false,
          page: copiedProcess.process_steps[i].stepDocumentMap[y].page,
        };
        // // console.log('the step copy doc is ', newTableOfContentObj);
        const contentStepAlreadyAdded = newTableOfContentArr.find(
          (step) =>
            step.workflow === docCurrentWorkflow._id &&
            step.id === content.id &&
            step.stepIndex === currentStepIndex
        );
  
        if (!contentStepAlreadyAdded) {
          // // console.log('content added')
          newTableOfContentArr.push(newTableOfContentObj);
        }
      }
    }
  
    // Update the state after the loop is completed
    if (newTableOfContentArr.length > 0) {
      setCopiedDoc([...copiedDoc, ...newTableOfContentArr]);
      newTableOfContentArr.forEach((newTableOfContentObj) => {
        dispatch(setTableOfContentForStep(newTableOfContentObj));
      });
    }
  
    // // console.log('finished the pick document phase');
  
  }, []);
  
        

  const onSubmit = (data) => {
    setLoading(true);

    // setTimeout(() => setLoading(false), 2000);

    if (data.document) {
      const addNewTableOfContentStep = (stepContent) => {
        const newTableOfContentObj = {
          ...stepContent,
          workflow: docCurrentWorkflow._id,
          stepIndex: currentStepIndex,
        };
        // // console.log('the newTableOfContentObj is ',newTableOfContentObj)
        dispatch(setTableOfContentForStep(newTableOfContentObj));
      };

      const currentSelectedContentForCurrentStep = tableOfContentForStep.filter(
        (content) => content.stepIndex === currentStepIndex
      );
      const currentSelectedContentForPreviousStep =
        tableOfContentForStep.filter(
          (content) => content.stepIndex === currentStepIndex - 1
        );
// // console.log('the tableOfContentForStep is ', tableOfContentForStep)
      switch (data.document) {
        case "Current Selection":
          // // console.log('content on current selection', data);
          return setLoading(false);
        case "All Document":
          contentOfDocument.forEach((content) => {
            const contentStepAlreadyAdded = tableOfContentForStep.find(
              (step) =>
                step.workflow === docCurrentWorkflow._id &&
                step._id === content._id &&
                step.stepIndex === currentStepIndex
            );

            if (contentStepAlreadyAdded) return;
              // // console.log('the content of document is ', content)
            addNewTableOfContentStep(content);
          });
          return setLoading(false);
        case "Balance Document":
          currentSelectedContentForCurrentStep.forEach(
            (tableOfContentForStep) =>
              dispatch(
                removeFromTableOfContentForStep({
                  id: tableOfContentForStep._id,
                  stepIndex: currentStepIndex,
                })
              )
          );

          contentOfDocument.forEach((content) => {
            const contentStepAlreadyAdded = tableOfContentForStep.find(
              (step) =>
                step.workflow === docCurrentWorkflow._id &&
                step._id === content._id
            );

            if (contentStepAlreadyAdded) return;
            // // console.log('the content of document is ', content)
            addNewTableOfContentStep(content);
          });
          return setLoading(false);
        case "Same as Previous":
          currentSelectedContentForCurrentStep.forEach(
            (tableOfContentForStep) =>
              dispatch(
                removeFromTableOfContentForStep({
                  id: tableOfContentForStep._id,
                  stepIndex: currentStepIndex,
                })
              )
          );

          currentSelectedContentForPreviousStep.forEach(
            (tableOfContentStep) => {
              const copyOfTableOfContentStep = { ...tableOfContentStep };
              copyOfTableOfContentStep.stepIndex = currentStepIndex;
              // // console.log('the content of document is ', copyOfTableOfContentStep)
              addNewTableOfContentStep(copyOfTableOfContentStep);
            }
          );
          return setLoading(false);
        default:
          setTimeout(() => setLoading(false), 1000);
      }
    }
  };
  // // console.log("the process steps are ", processSteps);

  return (
    <>
      <p style={{ padding: "0 6px", marginBottom: "2px" }}>
        <b>{t('Table of Contents')}</b>
      </p>
      {processSteps.find(
        (process) => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.skipStep ? (
        <p>{t('Step skipped')}</p>
      ) : processSteps.find(
          (process) => process.workflow === docCurrentWorkflow?._id
        )?.steps[currentStepIndex]?.stepRights === "view" ? (
        <p>
          {t('Contents skipped because rights have been set to ')}<b>{t('view')}</b>
        </p>
      ) : processSteps.find(
          (process) => process.workflow === docCurrentWorkflow?._id
        )?.steps[currentStepIndex]?.stepRights === "comment" ? (
        <p>
          {t('Contents skipped because rights have been set to ')}<b>{t('comment')}</b>
        </p>
      ) : processSteps.find(
          (process) => process.workflow === docCurrentWorkflow?._id
        )?.steps[currentStepIndex]?.stepRights === "approve" ? (
        <p>
          {t('Contents skipped because rights have been set to ')}<b>{t('approve')}</b>
        </p>
      ) : contentOfDocument ? (
        <Contents
          feature={"table-of-contents"}
          contents={contentOfDocument}
          toggleContent={true}
          currentStepIndex={currentStepIndex}
          stepsPopulated={stepsPopulated}
        />
      ) : (
        <LoadingSpinner />
      )}
      {processSteps.find(
        (process) => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.skipStep ? (
        <p>{t('Step skipped')}</p>
      ) : processSteps.find(
          (process) => process.workflow === docCurrentWorkflow?._id
        )?.steps[currentStepIndex]?.stepRights === "view" ? (
        <></>
      ) : (
        <FormLayout isSubmitted={isSubmitted} loading={loading}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={globalStyles.assign__document__map}
          >
            <Select
              register={register}
              takeOptionValue={true}
              name="document"
              options={documents}
              currentValue={
                processSteps.find((process) => process.workflow === docCurrentWorkflow?._id)?.steps[currentStepIndex]?.stepRights === "comment" ||
                processSteps.find((process) => process.workflow === docCurrentWorkflow?._id)?.steps[currentStepIndex]?.stepRights === "approve"
                  ? "All Document"
                  : undefined 
              }
            />
            <AssignButton buttonText="paste document map" loading={loading} />
          </form>
        </FormLayout>
      )}
    </>
  );
};

export default AssignDocumentMap;

export const documents = [
  { id: uuidv4(), option: "Current Selection" },
  { id: uuidv4(), option: "All Document" },
  { id: uuidv4(), option: "Balance Document" },
  { id: uuidv4(), option: "Same as Previous" },
];