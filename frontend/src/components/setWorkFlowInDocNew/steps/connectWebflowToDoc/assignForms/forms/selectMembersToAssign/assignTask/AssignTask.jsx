import { useForm } from "react-hook-form";
import Select from "../../../../../../select/Select";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FormLayout from "../../../../../../formLayout/FormLayout";
import AssignButton from "../../../../../../assignButton/AssignButton";

const AssignTask = () => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitSuccessful },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("task", data);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <FormLayout isSubmitted={isSubmitSuccessful} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="member order"
          register={register}
          name="memberOrder"
          options={memberOrder}
        />
        <Select
          label="Task Type"
          register={register}
          name="taskType"
          options={taskType}
        />
        <Select
          label="Rights"
          register={register}
          name="rights"
          options={rights}
        />
        <Select
          label="activity type"
          register={register}
          name="activityType"
          options={activityType}
        />
        <Select
          label="limit task to"
          register={register}
          name="limitTaskTo"
          options={limitTaskTo}
        />
        <AssignButton loading={loading} buttonText="Assign Task" />
      </form>
    </FormLayout>
  );
};

export default AssignTask;

export const memberOrder = [
  {
    id: uuidv4(),
    option: "No order (Parallel processing)",
  },
  {
    id: uuidv4(),
    option: "Team Member > User > Public",
  },
  {
    id: uuidv4(),
    option: "Team Member > Public > User",
  },
  {
    id: uuidv4(),
    option: "User >Team Member > Public",
  },
  {
    id: uuidv4(),
    option: "User > Public > Team Member",
  },
  {
    id: uuidv4(),
    option: "Public > User > Team Member",
  },
  {
    id: uuidv4(),
    option: "Public >Team Member > User ",
  },
];

export const taskType = [
  {
    id: uuidv4(),
    option: "Request for task",
  },
  {
    id: uuidv4(),
    option: "Assign task",
  },
];

export const rights = [
  {
    id: uuidv4(),
    option: "Add/Edit",
  },
  { id: uuidv4(), option: "View" },
  { id: uuidv4(), option: "Comment" },
  { id: uuidv4(), option: "Approve" },
];

export const activityType = [
  {
    id: uuidv4(),
    option: "Team Task",
  },
  { id: uuidv4(), option: "Individual Task" },
];

export const limitTaskTo = [
  {
    id: uuidv4(),
    option: "Portfolios assigned on or before step start date & time",
  },
  {
    id: uuidv4(),
    option: "Portfolios assigned on or before step end date & time",
  },
];

export const members = [
  {
    id: uuidv4(),
    option: "Member 1",
  },
  {
    id: uuidv4(),
    option: "Member 2",
  },
  {
    id: uuidv4(),
    option: "Member 3",
  },
];

export const taskFeatures = [
  { id: uuidv4(), feature: "Add/Edit" },
  { id: uuidv4(), feature: "View" },
  { id: uuidv4(), feature: "Comment" },
  { id: uuidv4(), feature: "Approve" },
];

export const membersPortfolio = [
  { id: uuidv4(), option: "Member Porfolio 1" },
  { id: uuidv4(), option: "Member Porfolio 2" },
  { id: uuidv4(), option: "Member Porfolio 3" },
];

export const displayDocument = [
  { id: uuidv4(), option: "Display document before processing this step" },
  { id: uuidv4(), option: "Display document after processing this step" },
  { id: uuidv4(), option: "Display document only in this step" },
  { id: uuidv4(), option: "Display document in all steps" },
];
