import React, { useState } from 'react';
import parentStyles from '../assignCollapse.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import Radio from '../../../../../radio/Radio';
import Select from '../../../../../select/Select';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateSingleProcessStep } from '../../../../../../../features/processes/processesSlice';

const Time = ({ currentStepIndex, stepsPopulated }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const { t } = useTranslation();
  const [currentLimitSelection, setCurrentLimitSelection] = useState(null);
  const [customTimeSelection, setCustomTimeSelection] = useState(null);
  const { docCurrentWorkflow, processSteps } = useSelector(
    (state) => state.processes
  );
  const handleTimeLimitSelection = (e) =>
    setCurrentLimitSelection(e.target.value);
  const handleCustomTimeSelection = (e) => setCustomTimeSelection(true);

  const dispatch = useDispatch();

  const handleSetTime = (data) => {
    if (!currentLimitSelection) return;

    if (currentLimitSelection === 'noTimeLimit') {
      dispatch(
        updateSingleProcessStep({
          stepTime: 'no_time_limit',
          stepTimeLimit: '',
          stepStartTime: '',
          stepEndTime: '',
          workflow: docCurrentWorkflow._id,
          indexToUpdate: currentStepIndex,
        })
      );
      return;
    }

    if (customTimeSelection) {
      dispatch(
        updateSingleProcessStep({
          stepTime: 'custom',
          stepTimeLimit: '',
          stepStartTime: data.startTime,
          stepEndTime: data.endTime,
          workflow: docCurrentWorkflow._id,
          indexToUpdate: currentStepIndex,
        })
      );
      return;
    }

    dispatch(
      updateSingleProcessStep({
        stepTime: 'select',
        stepTimeLimit: data.timeLimit,
        stepStartTime: '',
        stepEndTime: '',
        workflow: docCurrentWorkflow._id,
        indexToUpdate: currentStepIndex,
      })
    );
  };

  return (
    <>
      <form
        className={parentStyles.content__box}
        onSubmit={handleSubmit(handleSetTime)}
      >
        <div>
        <div   style={{marginBottom: '5px'}}>
          <Radio
            name='time'
            value='noTimeLimit'
            register={register}
            onChange={handleTimeLimitSelection}
            checked={
              processSteps.find(
                (process) => process.workflow === docCurrentWorkflow?._id
              )?.steps[currentStepIndex]?.stepTime === 'no_time_limit'
            }
          >
            {t('No Time limit')}
          </Radio>
          </div>
          <Radio
            name='time'
            value='selectTimeLimit'
            register={register}
            onChange={handleTimeLimitSelection}
            checked={
              processSteps.find(
                (process) => process.workflow === docCurrentWorkflow?._id
              )?.steps[currentStepIndex]?.stepTime === 'select'
            }
          >
            {t('Select Time limit')}
          </Radio>
        </div>
        {!currentLimitSelection ? (
          <></>
        ) : currentLimitSelection === 'noTimeLimit' ? (
          <></>
        ) : (
          <>
            <Select
              options={times}
              register={register}
              name='timeLimit'
              takeNormalValue={true}
            />
            <Radio
              name='customTime'
              value='customTime'
              register={register}
              onChange={handleCustomTimeSelection}
              checked={
                processSteps.find(
                  (process) => process.workflow === docCurrentWorkflow?._id
                )?.steps[currentStepIndex]?.stepTime === 'custom'
              }
            >
              {t('Custom Time')}
            </Radio>
            <>
              {!customTimeSelection ? (
                <></>
              ) : (
                <div>
                  <div>
                    <label htmlFor='startTime'>{t('Start')}</label>
                    <input
                      required
                      {...register('startTime')}
                      id='startTime'
                      type={'datetime-local'}
                    />
                  </div>
                  <div>
                    <label htmlFor='endTime'>End</label>
                    <input
                      required
                      {...register('endTime')}
                      id='endTime'
                      type={'datetime-local'}
                    />
                  </div>
                </div>
              )}
            </>
          </>
        )}
        <button className={parentStyles.primary__button}>{t('set time limit')}</button>
      </form>
      {isSubmitted ||
      (stepsPopulated &&
        processSteps.find(
          (process) => process.workflow === docCurrentWorkflow?._id
        )?.steps[currentStepIndex]?.stepTime) ? (
        <p style={{ margin: '0', padding: '0px 20px 10px' }}>{t('Saved')}</p>
      ) : (
        <></>
      )}
    </>
  );
};

export default Time;

export const times = [
  { id: uuidv4(), option: 'within 1 hour', normalValue: 'within_1_hour' },
  { id: uuidv4(), option: 'within 8 hours ', normalValue: 'within_8_hours' },
  { id: uuidv4(), option: 'within 24 hours', normalValue: 'within_24_hours' },
  { id: uuidv4(), option: 'within 3 days', normalValue: 'within_3_days' },
  { id: uuidv4(), option: 'within 7 days', normalValue: 'within_7_days' },
];
