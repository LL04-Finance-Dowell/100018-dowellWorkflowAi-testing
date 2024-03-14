import React from "react";
import parentStyles from "../assignCollapse.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Select from "../../../../../select/Select";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { updateSingleProcessStep } from "../../../../../../../features/processes/processesSlice";

const Reminder = ({ currentStepIndex, stepsPopulated }) => {
  const { 
    register,
    formState: { isSubmitted },
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { docCurrentWorkflow, processSteps } = useSelector((state) => state.processes)

  const handleSetReminder = (data) => {
    dispatch(
      updateSingleProcessStep({ 
        ...data,
        workflow: docCurrentWorkflow._id,
        indexToUpdate: currentStepIndex,
      })
    )
  }

  return (
    <>
    <form className={parentStyles.content__box} onSubmit={handleSubmit(handleSetReminder)}>
      <Select 
        options={reminder} 
        register={register} 
        name="stepReminder" 
        takeNormalValue={true} 
        currentValue={
          processSteps.find(
            process => process.workflow === docCurrentWorkflow?._id
          )?.steps[currentStepIndex]?.stepReminder
        }
      />
      <button className={parentStyles.primary__button}>{t('set reminder')}</button>
    </form>
    { 
      isSubmitted || 
      (stepsPopulated && processSteps.find(process => process.workflow === docCurrentWorkflow?._id)?.steps[currentStepIndex]?.stepTime) ? 
        <p style={{ margin: "0", padding: "0px 20px 10px"}}>{t('Saved')}</p> : 
        <></> 
    }
    </>
  );
};

export default Reminder;

export const reminder = [
  { id: uuidv4(), option: "No reminder", normalValue: "no_reminder" },
  { id: uuidv4(), option: "Send reminder every hour", normalValue: "every_hour" },
  { id: uuidv4(), option: "Send reminder every day", normalValue: "every_day" },
  { id: uuidv4(), option: "I will decide later", normalValue: "decide_later" },
];
