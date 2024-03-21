import React, { useEffect, useState } from 'react';
import FormLayout from '../../../../formLayout/FormLayout';
import globalStyles from '../../connectWorkFlowToDoc.module.css';
import styles from './copiesOdDoc.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import AssignButton from '../../../../assignButton/AssignButton';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingSpinner } from '../../../../../LoadingSpinner/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { updateSingleProcessStep } from '../../../../../../features/processes/processesSlice';

const CopiesOfDoc = ({ currentStepIndex, stepsPopulated }) => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitSuccessful },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const {
    currentDocToWfs,
    docCurrentWorkflow,
    processSteps,
    publicMembersSelectedForProcess,
    userMembersSelectedForProcess,
    teamMembersSelectedForProcess,
  } = useSelector((state) => state.processes);
  const [copiesFeaturesSet, setCopiesFeaturesSet] = useState(false);
  const [copiesFeaturesToDisplay, setCopiesFeaturesToDisplay] = useState([]);
  const [copiesSelected, setCopiesSelected] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentDocToWfs || stepsPopulated) return;

    if (copiesFeaturesSet) return;

    const currentCopies = copiesFeaturesToDisplay.slice();
    // // console.log('the currentDocToWfs is ',currentDocToWfs)
    const singleCopyOfCurrentDocument = {
      id: currentDocToWfs?._id,
      feature: currentDocToWfs?.document_name ? currentDocToWfs?.document_name  : currentDocToWfs?.template_name,
      document_number: 1,
    };
    currentCopies.push(singleCopyOfCurrentDocument);

    setCopiesFeaturesToDisplay(currentCopies);
    setCopiesFeaturesSet(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDocToWfs, stepsPopulated]);

  useEffect(() => {
    if (!currentDocToWfs || stepsPopulated) return;

    const newCopiesForCurrentStep = [];

    const previousStepDetails = processSteps.find(
      (process) => process.workflow === docCurrentWorkflow._id
    )?.steps[currentStepIndex - 1];

    if (
      previousStepDetails &&
      previousStepDetails.stepTaskType &&
      previousStepDetails.stepTaskType === 'request_for_task'
    ) {
      const totalNumberOfAssignedUsersInPreviousStep =
        publicMembersSelectedForProcess.filter(
          (selectedUser) => selectedUser.stepIndex === currentStepIndex - 1
        ).length +
        teamMembersSelectedForProcess.filter(
          (selectedUser) => selectedUser.stepIndex === currentStepIndex - 1
        ).length +
        userMembersSelectedForProcess.filter(
          (selectedUser) => selectedUser.stepIndex === currentStepIndex - 1
        ).length;
      for (let i = 0; i < totalNumberOfAssignedUsersInPreviousStep; i++)
        newCopiesForCurrentStep.push({
          id: currentDocToWfs?._id,
          feature: currentDocToWfs?.document_name ? currentDocToWfs?.document_name  : currentDocToWfs?.template_name,
          document_number: i + 1,
        });
      setCopiesFeaturesToDisplay(newCopiesForCurrentStep);
    } else {
      newCopiesForCurrentStep.push({
        id: currentDocToWfs?._id,
        feature: currentDocToWfs?.document_name ? currentDocToWfs?.document_name  : currentDocToWfs?.template_name,
        document_number: 1,
      });
      setCopiesFeaturesToDisplay(newCopiesForCurrentStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDocToWfs, processSteps, stepsPopulated]);

  useEffect(() => {
    if ((copiesFeaturesSet || processSteps.length < 1) && !stepsPopulated)
      return;

    const documentCountForStep = processSteps.find(
      (process) => process.workflow === docCurrentWorkflow?._id
    )?.steps[currentStepIndex].stepCloneCount;

    if (!documentCountForStep) {
      const copiesForCurrentStep = [];
      const singleCopyOfCurrentDocument = {
        id: currentDocToWfs?._id,
        feature: currentDocToWfs?.document_name ? currentDocToWfs?.document_name  : currentDocToWfs?.template_name,
        document_number: 1,
      };
      copiesForCurrentStep.push(singleCopyOfCurrentDocument);

      setCopiesFeaturesToDisplay(copiesForCurrentStep);
      return setCopiesFeaturesSet(true);
    }

    const copiesForCurrentStep = [];

    for (let i = 0; i < documentCountForStep; i++) {
      copiesForCurrentStep.push({
        id: currentDocToWfs?._id,
        feature: currentDocToWfs?.document_name ? currentDocToWfs?.document_name  : currentDocToWfs?.template_name,
        document_number: i + 1,
      });
      setCopiesFeaturesToDisplay(copiesForCurrentStep);
    }

    setCopiesFeaturesSet(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepsPopulated, processSteps]);

  const onSubmit = (data) => {
    setLoading(true);
    
    dispatch(
      updateSingleProcessStep({
        stepCloneCount: copiesSelected.length,
        workflow: docCurrentWorkflow._id,
        indexToUpdate: currentStepIndex,
      })
    );
    setTimeout(() => setLoading(false), 1000);
  };

  const handleSingleCopySelection = (item) => {
    const currentCopiesSelected = copiesSelected.slice();

    const copyAlreadyAdded = currentCopiesSelected.find(
      (copy) =>
        copy.id === item.id && copy.document_number === item.document_number
    );

    if (copyAlreadyAdded)
      return setCopiesSelected((prevCopies) => {
        return prevCopies.filter(
          (copy) => copy.document_number !== item.document_number
        );
      });

    currentCopiesSelected.push(item);
    setCopiesSelected(currentCopiesSelected);
  };

  return (
    <>
      {processSteps.find(
        (process) => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.skipStep ? (
        <>
          <h2 className={styles.header}>
          {t('Copies of document from previous step (select for processing)')}
          </h2>
          <p>{t('Step skipped')}</p>
        </>
      ) : (
        <>
          {copiesFeaturesSet ? (
            <FormLayout
              isSubmitted={stepsPopulated ? stepsPopulated : isSubmitSuccessful}
              loading={loading}
              style={{padding:'10px'}}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styles.header}>
                {t('Copies of document from previous step (select for processing)')}
                </h2>
                <select
                  required
                  {...register('taskFeature')}
                  size={taskFeatures.length}
                  className={globalStyles.task__features}
                  onChange={({ target }) =>
                    handleSingleCopySelection(JSON.parse(target.value))
                  }
                >
                  {React.Children.toArray(
                    copiesFeaturesToDisplay.map((item) => (
                      <option
                        className={globalStyles.task__features__text}
                        style={
                          copiesSelected.find(
                            (copy) =>
                              copy.id === item.id &&
                              copy.document_number === item.document_number
                          )
                            ? { backgroundColor: '#0048ff', color: '#fff' }
                            : {}
                        }
                        value={JSON.stringify(item)}
                      >
                        {item.feature}
                      </option>
                    ))
                  )}
                </select>
                <AssignButton
                  loading={loading}
                  buttonText='Copies of document from previous step (select for processing)'
                />
              </form>
            </FormLayout>
          ) : (
            <LoadingSpinner />
          )}
        </>
      )}
    </>
  );
};

export default CopiesOfDoc;

export const taskFeatures = [
  { id: uuidv4(), feature: 'document clone 1' },
  { id: uuidv4(), feature: 'document clone 1' },
  { id: uuidv4(), feature: 'document clone 1' },
  { id: uuidv4(), feature: 'document clone 1' },
];
