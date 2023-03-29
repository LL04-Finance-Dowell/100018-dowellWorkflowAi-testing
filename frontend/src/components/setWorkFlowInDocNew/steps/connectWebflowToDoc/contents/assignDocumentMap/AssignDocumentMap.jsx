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
import { removeFromTableOfContentForStep, setTableOfContentForStep } from "../../../../../../features/app/appSlice";

const AssignDocumentMap = ({ currentStepIndex }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { contentOfDocument } = useSelector((state) => state.document);
  const { docCurrentWorkflow, tableOfContentForStep, processSteps } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoading(true);
    console.log("docement", data);
    // setTimeout(() => setLoading(false), 2000);

    if (data.document) {
      const addNewTableOfContentStep = (stepContent) => {
        const newTableOfContentObj = {
          ...stepContent,
          workflow: docCurrentWorkflow._id,
          stepIndex: currentStepIndex,
        };
        dispatch(setTableOfContentForStep(newTableOfContentObj));
      }

      const currentSelectedContentForCurrentStep = tableOfContentForStep.filter(content => content.stepIndex === currentStepIndex);
      const currentSelectedContentForPreviousStep = tableOfContentForStep.filter(content => content.stepIndex === currentStepIndex - 1);

      switch (data.document) {
        case "Current Selection": 
          console.log("Preserving current selection")
          return setLoading(false);
        case "All Document":
          contentOfDocument.forEach(content => {
            const contentStepAlreadyAdded = tableOfContentForStep.find(
                (step) =>
                  step.workflow === docCurrentWorkflow._id &&
                  step._id === content._id &&
                  step.stepIndex === currentStepIndex
            );

            if (contentStepAlreadyAdded) return

            addNewTableOfContentStep(content);
          })
          return setLoading(false);
        case "Balance Document":
          currentSelectedContentForCurrentStep.forEach(tableOfContentForStep => dispatch(removeFromTableOfContentForStep({ id: tableOfContentForStep._id, stepIndex: currentStepIndex })))

          contentOfDocument.forEach(content => {
            const contentStepAlreadyAdded = tableOfContentForStep.find(
              (step) => 
                step.workflow === docCurrentWorkflow._id &&
                step._id === content._id
            )

            if (contentStepAlreadyAdded) return

            addNewTableOfContentStep(content);
          })
          return setLoading(false);
        case "Same as Previous":
          currentSelectedContentForCurrentStep.forEach(tableOfContentForStep => dispatch(removeFromTableOfContentForStep({ id: tableOfContentForStep._id, stepIndex: currentStepIndex })))

          currentSelectedContentForPreviousStep.forEach(tableOfContentStep => {
            const copyOfTableOfContentStep = { ...tableOfContentStep }
            copyOfTableOfContentStep.stepIndex = currentStepIndex;

            addNewTableOfContentStep(copyOfTableOfContentStep);
          })
          return setLoading(false);
        default:
          console.log("Invalid option passed");
          setTimeout(() => setLoading(false), 1000);
      }
    }
  };

  return (
    <>
    <p style={{ padding: "0 6px", marginBottom: "2px"}}><b>Table of Contents</b></p>
    {
      processSteps.find(
        process => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.skipStep ? <p>Step skipped</p> :
      contentOfDocument ? 
      <Contents
        feature={"table-of-contents"}
        contents={contentOfDocument}
        toggleContent={true}
        currentStepIndex={currentStepIndex}
      /> : 
      <LoadingSpinner />
    }
    {
      processSteps.find(
        process => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.skipStep ? <p>Step skipped</p> :
      <FormLayout isSubmitted={isSubmitted} loading={loading}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={globalStyles.assign__document__map}
        >
          <Select register={register} takeOptionValue={true} name="document" options={documents} />
          <AssignButton buttonText="paste document map" loading={loading} />
        </form>
      </FormLayout>
    }
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
