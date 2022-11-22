import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import { useForm } from "react-hook-form";
import Select from "../../../select/Select";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FormLayout from "../../formLayout/FormLayout";
import AssignButton from "../../assignButton/AssignButton";

const AssignTask = () => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitSuccessful },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("location", data);
    setTimeout(() => setLoading(false), 2000);
  };

  console.log("iss", isSubmitSuccessful);

  return (
    <FormLayout isSubmitted={isSubmitSuccessful} loading={loading}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={globalStyles.confirm__box}
      >
        <Select register={register} name="role" options={roleArray} />
        <Select register={register} name="members" options={members} />
        <Select
          register={register}
          name="memberPortfolio"
          options={membersPortfolio}
        />
        <select
          required
          {...register("taskFeature")}
          size={taskFeatures.length}
          className={globalStyles.task__features}
        >
          {taskFeatures.map((item) => (
            <option className={globalStyles.task__features__text} key={item.id}>
              {item.feature}
            </option>
          ))}
        </select>
        <Select
          register={register}
          name="displayDoc"
          options={displayDocument}
        />
        <AssignButton loading={loading} buttonText="Assign Task" />
      </form>
    </FormLayout>
  );
};

export default AssignTask;

export const roleArray = [
  {
    id: uuidv4(),
    option: "Team Member",
  },
  { id: uuidv4(), option: "Guest (enter phone/email)" },
  { id: uuidv4(), option: "Public (link)" },
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
