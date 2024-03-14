import React from "react";
import parentStyles from "../assignCollapse.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Select from "../../../../../select/Select";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from 'react-i18next';
import { updateSingleProcessStep } from "../../../../../../../features/processes/processesSlice";

const Display = ({ currentStepIndex, stepsPopulated }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitted }
  } = useForm();
  const { t } = useTranslation();
  const { docCurrentWorkflow, processSteps } = useSelector((state) => state.processes)
  const dispatch = useDispatch()

  const handleSetDisplay = (data) => {
    dispatch(
      updateSingleProcessStep({
        stepDisplay: data.displayDocument,
        workflow: docCurrentWorkflow._id,
        indexToUpdate: currentStepIndex,
      })
    )
  }

  return (
    <>
    <form className={parentStyles.content__box} onSubmit={handleSubmit(handleSetDisplay)}>
      <Select
        options={displayDocument}
        register={register}
        name="displayDocument"
        takeNormalValue={true}
        currentValue={processSteps.find(
            process => process.workflow === docCurrentWorkflow?._id
          )?.steps[currentStepIndex]?.stepDisplay
        }
      />
      <button type="submit" className={parentStyles.primary__button}>
        {t('set display')}
      </button>
    </form>
    { 
      isSubmitted || 
      processSteps.find(
        process => process.workflow === docCurrentWorkflow?._id
      )?.steps[currentStepIndex]?.stepDisplay ? 
      <p style={{ margin: "0", padding: "0px 20px 10px"}}>{t('Saved')}</p> 
      : 
      <></> 
    }
    </>
  );
};

export default Display;

export const displayDocument = [
  { id: uuidv4(), option: "Display document before processing this step", normalValue: "before_this_step" },
  { id: uuidv4(), option: "Display document after processing this step", normalValue: "_after_this_step" },
  { id: uuidv4(), option: "Display document only in this step", normalValue: "_only_this_step" },
  { id: uuidv4(), option: "Display document in all steps", normalValue: "in_all_steps" },
];
