import React, { useEffect, useState } from "react";
import FormLayout from "../../../../formLayout/FormLayout";
import globalStyles from "../../connectWorkFlowToDoc.module.css";
import styles from "./copiesOdDoc.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import AssignButton from "../../../../assignButton/AssignButton";
import { useDispatch, useSelector } from "react-redux";
import { updateSingleProcessStep } from "../../../../../../features/app/appSlice";

const CopiesOfDoc = ({ currentStepIndex }) => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitSuccessful },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { currentDocToWfs, docCurrentWorkflow } = useSelector(state => state.app);
  const [ copiesFeaturesSet, setCopiesFeaturesSet ] = useState(false);
  const [ copiesFeaturesToDisplay, setCopiesFeaturesToDisplay ] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    
    if(!currentDocToWfs) return

    if (copiesFeaturesSet) return

    const currentCopies = copiesFeaturesToDisplay.slice()
    const singleCopyOfCurrentDocument = {
      id: uuidv4(), 
      feature: currentDocToWfs?.document_name
    }
    currentCopies.push(singleCopyOfCurrentDocument);

    setCopiesFeaturesToDisplay(currentCopies);
    setCopiesFeaturesSet(true);

  }, [currentDocToWfs])

  const onSubmit = (data) => {
    setLoading(true);
    console.log("documentCopies", data);
    dispatch(updateSingleProcessStep({
      stepCloneCount: copiesFeaturesToDisplay.length,
      workflow: docCurrentWorkflow._id,
      indexToUpdate: currentStepIndex,
    }))
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <FormLayout isSubmitted={isSubmitSuccessful} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.header}>
          Copies of document from previous step (select for processing)
        </h2>
        <select
          required
          {...register("taskFeature")}
          size={taskFeatures.length}
          className={globalStyles.task__features}
        >
          {copiesFeaturesToDisplay.map((item) => (
            <option className={globalStyles.task__features__text} key={item.id}>
              {item.feature}
            </option>
          ))}
        </select>
        <AssignButton
          loading={loading}
          buttonText="Copies of document from previous step (select for processing)"
        />
      </form>
    </FormLayout>
  );
};

export default CopiesOfDoc;

export const taskFeatures = [
  { id: uuidv4(), feature: "document clone 1" },
  { id: uuidv4(), feature: "document clone 1" },
  { id: uuidv4(), feature: "document clone 1" },
  { id: uuidv4(), feature: "document clone 1" },
];
