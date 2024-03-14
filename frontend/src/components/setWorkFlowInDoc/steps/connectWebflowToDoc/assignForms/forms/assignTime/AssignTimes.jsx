import Select from '../../../../../select/Select';
import globalStyles from '../../../connectWorkFlowToDoc.module.css';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import FormLayout from '../../../../../formLayout/FormLayout';
import { useState } from 'react';
import AssignButton from '../../../../../assignButton/AssignButton';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';
import { updateSingleProcessStep } from '../../../../../../../features/processes/processesSlice';

const AssignTime = ({ currentStepIndex }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
    watch,
  } = useForm();
  const { limit, start_time } = watch();
  const [loading, setLoading] = useState(false);
  const { docCurrentWorkflow } = useSelector((state) => state.processes);
  const [endTimeisReadOnly, setEndTimeReadOnly] = useState(false);
  const [endTimeVal, setEndTimeVal] = useState('');
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(
      updateSingleProcessStep({
        ...data,
        indexToUpdate: currentStepIndex,
        workflow: docCurrentWorkflow._id,
      })
    );
    setTimeout(() => setLoading(false), 2000);
  };

  useEffect(() => {
    if (!limit) return setEndTimeReadOnly(false);

    if (
      limit === 'within_1_hour' ||
      limit === 'within_8_hours' ||
      limit === 'within_24_hours' ||
      limit === 'within_3_days' ||
      limit === 'within_7_days'
    )
      return setEndTimeReadOnly(true);

    setEndTimeReadOnly(false);
  }, [limit]);

  useEffect(() => {
    if (!start_time || start_time.length < 1 || !endTimeisReadOnly) return;

    const currentLimitObj = limitTimes.find(
      (time) => time.normalValue === limit
    );

    if (!currentLimitObj) return;

    const time_vals = start_time.split(':');
    const [hours, minutes] = [time_vals[0], time_vals[1]];

    const resultingHourVal = Number(hours) + currentLimitObj.hourValue;
    let outputHourStr = '';

    if (resultingHourVal > 24) {
      const hourValIn24Format = resultingHourVal % 24;
      outputHourStr = `${hourValIn24Format}:${minutes}`;
      if (hourValIn24Format < 10) {
        outputHourStr = `0${hourValIn24Format}:${minutes}`;
      }
      setEndTimeVal(outputHourStr);
      return;
    }

    outputHourStr = `${resultingHourVal}:${minutes}`;

    if (resultingHourVal < 10) {
      outputHourStr = `0${resultingHourVal}:${minutes}`;
    }

    setEndTimeVal(outputHourStr);
  }, [start_time, endTimeisReadOnly, limit]);

  return (
    <FormLayout isSubmitted={isSubmitted} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          register={register}
          name='limit'
          options={limitTimes}
          takeNormalValue={true}
        />
        {!limit ? (
          <></>
        ) : limit === 'no_time_limit' ? (
          <></>
        ) : (
          <>
            <input
              {...register('start_time')}
              className={globalStyles.time__input}
              type='time'
            />
            <input
              {...register('end_time')}
              className={globalStyles.time__input}
              type='time'
              readOnly={endTimeisReadOnly}
              value={endTimeisReadOnly ? endTimeVal : null}
            />
          </>
        )}
        <Select
          register={register}
          name='reminder'
          options={reminderFrequency}
          takeNormalValue={true}
        />
        <AssignButton loading={loading} buttonText='Assign Period' />
      </form>
    </FormLayout>
  );
};

export default AssignTime;

export const limitTimes = [
  { id: uuidv4(), option: 'No time limit', normalValue: 'no_time_limit' },
  {
    id: uuidv4(),
    option: 'Within 1 hour',
    normalValue: 'within_1_hour',
    hourValue: 1,
  },
  {
    id: uuidv4(),
    option: 'Within 8 hour',
    normalValue: 'within_8_hours',
    hourValue: 8,
  },
  {
    id: uuidv4(),
    option: 'Within 24 hour',
    normalValue: 'within_24_hours',
    hourValue: 24,
  },
  {
    id: uuidv4(),
    option: 'Within 3 days',
    normalValue: 'within_3_days',
    hourValue: 72,
  },
  {
    id: uuidv4(),
    option: 'Within 7 days',
    normalValue: 'within_7_days',
    hourValue: 168,
  },
  { id: uuidv4(), option: 'Custom time', normalValue: 'custom_time' },
];

export const reminderFrequency = [
  {
    id: uuidv4(),
    option: 'Send reminder every hour',
    normalValue: 'send_reminder_every_hour',
  },
  {
    id: uuidv4(),
    option: 'Send reminder every day',
    normalValue: 'send_reminder_every_day',
  },
  { id: uuidv4(), option: 'I will decide later', normalValue: 'decide_later' },
  {
    id: uuidv4(),
    option: 'Skip this step to continue',
    normalValue: 'skip_for_now',
  },
];
