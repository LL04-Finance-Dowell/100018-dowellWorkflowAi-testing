import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Select from '../../../../../select/Select';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormLayout from '../../../../../formLayout/FormLayout';
import AssignButton from '../../../../../assignButton/AssignButton';

import { useDispatch, useSelector } from 'react-redux';
import { useAppContext } from '../../../../../../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { updateSingleProcessStep } from '../../../../../../../features/processes/processesSlice';

const AssignTask = ({ currentStepIndex, stepsPopulated }) => {
  const { setIsAssignTask } = useAppContext();
  const {
    register,
    handleSubmit,

    formState: { isSubmitSuccessful },
  } = useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { docCurrentWorkflow, processSteps } = useSelector(
    (state) => state.processes
  );
    ///import which doc or template approval
    // const whichApproval = useSelector((state)=> state.copyProcess.whichApproval)
    const currentURL = window.location.href;
    const parts = currentURL.split('/'); 
    const whichApproval =  parts[parts.length - 1];
      ////copied process
      const copiedProcess = useSelector((state) => state.copyProcess.processStep);

      useEffect(()=>{
        if(copiedProcess == null){ return }
        // // console.log('entered the useEffect to assign task1')
        const initialProcessStepObj = {
          workflow: docCurrentWorkflow._id,
          indexToUpdate: currentStepIndex,
        };
    
        dispatch(
          updateSingleProcessStep({
            ...initialProcessStepObj,
            stepTaskType: copiedProcess.process_steps[currentStepIndex].stepTaskType,
          })
        );
        dispatch(
          updateSingleProcessStep({
            ...initialProcessStepObj,
            stepRights: copiedProcess.process_steps[currentStepIndex].stepRights,
          })
        );
        dispatch(
          updateSingleProcessStep({
            ...initialProcessStepObj,
            stepProcessingOrder: copiedProcess.process_steps[currentStepIndex].stepProcessingOrder,
          })
        );
        dispatch(
          updateSingleProcessStep({
            ...initialProcessStepObj,
            stepTaskLimitation: copiedProcess.process_steps[currentStepIndex].stepTaskLimitation,
          })
        );
        dispatch(
          updateSingleProcessStep({
            ...initialProcessStepObj,
            stepActivityType: copiedProcess.process_steps[currentStepIndex].stepActivityType,
          })
        );
    
        setIsAssignTask(copiedProcess.process_steps[currentStepIndex].stepTaskType === 'assign_task' ? true : false);
        // // console.log('finished the useEffect to assign task1')
      },[copiedProcess])

  const onSubmit = (data) => {
    setLoading(true);

    const initialProcessStepObj = {
      workflow: docCurrentWorkflow._id,
      indexToUpdate: currentStepIndex,
    };

    dispatch(
      updateSingleProcessStep({
        ...initialProcessStepObj,
        stepTaskType: data.taskType,
      })
    );
    dispatch(
      updateSingleProcessStep({
        ...initialProcessStepObj,
        stepRights: data.rights,
      })
    );
    dispatch(
      updateSingleProcessStep({
        ...initialProcessStepObj,
        stepProcessingOrder: data.memberOrder,
      })
    );
    dispatch(
      updateSingleProcessStep({
        ...initialProcessStepObj,
        stepTaskLimitation: data.limitTaskTo,
      })
    );
    dispatch(
      updateSingleProcessStep({
        ...initialProcessStepObj,
        stepActivityType: data.activityType,
      })
    );

    setIsAssignTask(data.taskType === 'assign_task' ? true : false);

    setLoading(false);
  };

  return (
    <FormLayout
      isSubmitted={
        stepsPopulated &&
        processSteps.find(
          (process) => process.workflow === docCurrentWorkflow?._id
        )?.steps[currentStepIndex]?.stepProcessingOrder
          ? true
          : isSubmitSuccessful
      }
      loading={loading}
      style={{padding: '10px'}}
    >
      <p style={{ padding: '0', marginBottom: '14px' }}>
        <b>{t('Assign Task')}</b>
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          label='member order'
          register={register}
          name='memberOrder'
          options={memberOrder}
          takeNormalValue={true}
          currentValue={
            processSteps.find(
              (process) => process.workflow === docCurrentWorkflow?._id
            )?.steps[currentStepIndex]?.stepProcessingOrder
          }
        />
        <Select
          label='Task Type'
          register={register}
          name='taskType'
          options={whichApproval == 'new-set-workflow-document' ? taskType : taskTypeReverse}
          takeNormalValue={true}
          currentValue={
            processSteps.find(
              (process) => process.workflow === docCurrentWorkflow?._id
            )?.steps[currentStepIndex]?.stepTaskType
          }
        />
        <Select
          label='Rights'
          register={register}
          name='rights'
          options={rights}
          takeNormalValue={true}
          currentValue={
            processSteps.find(
              (process) => process.workflow === docCurrentWorkflow?._id
            )?.steps[currentStepIndex]?.stepRights
          }
        />
        <Select
          label='activity type'
          register={register}
          name='activityType'
          options={activityType}
          takeNormalValue={true}
          currentValue={
            processSteps.find(
              (process) => process.workflow === docCurrentWorkflow?._id
            )?.steps[currentStepIndex]?.stepActivityType
          }
        />
        <Select
          label='limit task to'
          register={register}
          name='limitTaskTo'
          options={limitTaskTo}
          takeNormalValue={true}
          currentValue={
            processSteps.find(
              (process) => process.workflow === docCurrentWorkflow?._id
            )?.steps[currentStepIndex]?.stepTaskLimitation
          }
        />
        <AssignButton loading={loading} buttonText='Assign Task' />
      </form>
    </FormLayout>
  );
};

export default AssignTask;

export const memberOrder = [
  {
    id: uuidv4(),
    option: 'No order (Parallel processing)',
    normalValue: 'no_order',
  },
  {
    id: uuidv4(),
    option: 'Team Member > User > Public',
    normalValue: 'team_user_public',
  },
  {
    id: uuidv4(),
    option: 'Team Member > Public > User',
    normalValue: 'team_public_user',
  },
  {
    id: uuidv4(),
    option: 'User > Team Member > Public',
    normalValue: 'user_team_public',
  },
  {
    id: uuidv4(),
    option: 'User > Public > Team Member',
    normalValue: 'user_public_team',
  },
  {
    id: uuidv4(),
    option: 'Public > User > Team Member',
    normalValue: 'public_user_team',
  },
  {
    id: uuidv4(),
    option: 'Public > Team Member > User',
    normalValue: 'public_team_user',
  },
];

export const taskType = [
  {
    id: uuidv4(),
    option: 'Request for task',
    normalValue: 'request_for_task',
  },
  {
    id: uuidv4(),
    option: 'Assign task',
    normalValue: 'assign_task',
  },
];
export const taskTypeReverse = [
  {
    id: uuidv4(),
    option: 'Assign task',
    normalValue: 'assign_task',
  },
  {
    id: uuidv4(),
    option: 'Request for task',
    normalValue: 'request_for_task',
  },
 
];

export const rights = [
  {
    id: uuidv4(),
    option: 'Add/Edit',
    normalValue: 'add_edit',
  },
  { id: uuidv4(), option: 'View', normalValue: 'view' },
  { id: uuidv4(), option: 'Comment', normalValue: 'comment' },
  { id: uuidv4(), option: 'Approve', normalValue: 'approve' },
];

export const activityType = [
  {
    id: uuidv4(),
    option: 'Team Task',
    normalValue: 'team_task',
  },
  { id: uuidv4(), option: 'Individual Task', normalValue: 'individual_task' },
];

export const limitTaskTo = [
  {
    id: uuidv4(),
    option: 'Portfolios assigned on or before step start date & time',
    normalValue: 'portfolios_assigned_on_or_before_step_start_date_and_time',
  },
  {
    id: uuidv4(),
    option: 'Portfolios assigned on or before step end date & time',
    normalValue: 'portfolios_assigned_on_or_before_step_end_date_and_time',
  },
];

export const members = [
  {
    id: uuidv4(),
    option: 'Member 1',
  },
  {
    id: uuidv4(),
    option: 'Member 2',
  },
  {
    id: uuidv4(),
    option: 'Member 3',
  },
];

export const taskFeatures = [
  { id: uuidv4(), feature: 'Add/Edit' },
  { id: uuidv4(), feature: 'View' },
  { id: uuidv4(), feature: 'Comment' },
  { id: uuidv4(), feature: 'Approve' },
];

export const membersPortfolio = [
  { id: uuidv4(), option: 'Member Porfolio 1' },
  { id: uuidv4(), option: 'Member Porfolio 2' },
  { id: uuidv4(), option: 'Member Porfolio 3' },
];

export const displayDocument = [
  { id: uuidv4(), option: 'Display document before processing this step' },
  { id: uuidv4(), option: 'Display document after processing this step' },
  { id: uuidv4(), option: 'Display document only in this step' },
  { id: uuidv4(), option: 'Display document in all steps' },
];
