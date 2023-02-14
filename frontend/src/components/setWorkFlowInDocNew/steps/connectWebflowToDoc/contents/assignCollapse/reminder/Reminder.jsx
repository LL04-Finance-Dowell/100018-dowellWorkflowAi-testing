import React from "react";
import parentStyles from "../assignCollapse.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Select from "../../../../../select/Select";
import { updateSingleProcessStep } from "../../../../../../../features/app/appSlice";
import { useDispatch, useSelector } from "react-redux";

const Reminder = ({ currentStepIndex }) => {
  const { 
    register,
    formState: { isSubmitted },
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const { docCurrentWorkflow } = useSelector((state) => state.app)

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
      <Select options={reminder} register={register} name="stepReminder" takeNormalValue={true} />
      <button className={parentStyles.primary__button}>set reminder</button>
    </form>
    { isSubmitted ? <p style={{ margin: "0", padding: "0px 20px 10px"}}>Saved</p> : <></> }
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
