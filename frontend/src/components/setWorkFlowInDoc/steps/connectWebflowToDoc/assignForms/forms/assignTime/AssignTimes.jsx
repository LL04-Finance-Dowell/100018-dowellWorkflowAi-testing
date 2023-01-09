import Select from "../../../../../select/Select";
import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import FormLayout from "../../../../../formLayout/FormLayout";
import { useState } from "react";
import AssignButton from "../../../../../assignButton/AssignButton";
import { useDispatch, useSelector } from "react-redux";
import { updateSingleProcessStep } from "../../../../../../../features/app/appSlice";

const AssignTime = ({ currentStepIndex }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
    watch
  } = useForm();
  const { limit } = watch();
  const [loading, setLoading] = useState(false);
  const { docCurrentWorkflow } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoading(true);
    console.log("location", data);
    dispatch(updateSingleProcessStep({ ...data, "indexToUpdate": currentStepIndex, "workflow": docCurrentWorkflow._id }))
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <FormLayout isSubmitted={isSubmitted} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select register={register} name="limit" options={limitTimes} takeNormalValue={true} />
        {
          !limit ? <></> :
          limit === "no_time_limit" ? <></> :
          <>
            <input
              {...register("start_time")}
              className={globalStyles.time__input}
              type="time"
            />
            <input
              {...register("end_time")}
              className={globalStyles.time__input}
              type="time"
            />
          </>
        }
        <Select
          register={register}
          name="reminder"
          options={reminderFrequency}
          takeNormalValue={true}
        />
        <AssignButton loading={loading} buttonText="Assign Period" />
      </form>
    </FormLayout>
  );
};

export default AssignTime;

export const limitTimes = [
  { id: uuidv4(), option: "No time limit", normalValue: "no_time_limit" },
  { id: uuidv4(), option: "Within 1 hour", normalValue: "within_1_hour" },
  { id: uuidv4(), option: "Within 8 hour", normalValue: "within_8_hours" },
  { id: uuidv4(), option: "Within 24 hour", normalValue: "within_24_hours" },
  { id: uuidv4(), option: "Within 3 days", normalValue: "within_3_days" },
  { id: uuidv4(), option: "Within 7 days", normalValue: "within_7_days" },
  { id: uuidv4(), option: "Custom time", normalValue: "custom_time" },
];

export const reminderFrequency = [
  { id: uuidv4(), option: "Send reminder every hour", normalValue: "send_reminder_every_hour" },
  { id: uuidv4(), option: "Send reminder every day", normalValue: "send_reminder_every_day" },
  { id: uuidv4(), option: "I will decide later", normalValue: "decide_later" },
  { id: uuidv4(), option: "Skip this step to continue", normalValue: "skip_for_now" },
];
