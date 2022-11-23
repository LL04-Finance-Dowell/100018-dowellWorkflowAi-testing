import Select from "../../../../../select/Select";
import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import FormLayout from "../../../../../formLayout/FormLayout";
import { useState } from "react";
import AssignButton from "../../../../../assignButton/AssignButton";

const AssignTime = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("location", data);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <FormLayout isSubmitted={isSubmitted} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select register={register} name="limitTime" options={limitTimes} />
        <input
          {...register("startTime")}
          className={globalStyles.time__input}
          type="time"
        />
        <input
          {...register("endTime")}
          className={globalStyles.time__input}
          type="time"
        />
        <Select
          register={register}
          name="reminder"
          options={reminderFrequency}
        />
        <AssignButton loading={loading} buttonText="Assign Period" />
      </form>
    </FormLayout>
  );
};

export default AssignTime;

export const limitTimes = [
  { id: uuidv4(), option: "No time limit" },
  { id: uuidv4(), option: "Within 1 hour" },
  { id: uuidv4(), option: "Within 8 hour" },
  { id: uuidv4(), option: "Within 24 hour" },
  { id: uuidv4(), option: "Within 3 days" },
  { id: uuidv4(), option: "Within 7 days" },
  { id: uuidv4(), option: "Custom time" },
];

export const reminderFrequency = [
  { id: uuidv4(), option: "Send reminder every hour" },
  { id: uuidv4(), option: "Send reminder every day" },
  { id: uuidv4(), option: "I will decide later" },
  { id: uuidv4(), option: "Skip this step to continue" },
];
