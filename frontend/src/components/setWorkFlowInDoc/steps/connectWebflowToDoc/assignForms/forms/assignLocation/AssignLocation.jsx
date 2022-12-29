import Select from "../../../../../select/Select";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import FormLayout from "../../../../../formLayout/FormLayout";
import { useState } from "react";
import AssignButton from "../../../../../assignButton/AssignButton";
import { updateSingleProcessStep } from "../../../../../../../features/app/appSlice";
import { useDispatch, useSelector } from "react-redux";

const AssignLocation = ({ currentStepIndex }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { docCurrentWorkflow } = useSelector((state) => state.app);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("location", data);
    dispatch(updateSingleProcessStep({ ...data, "indexToUpdate": currentStepIndex, "workflow":  docCurrentWorkflow._id }));
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <FormLayout isSubmitted={isSubmitted} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select register={register} name="location" options={locations} takeNormalValue={true} />
        <AssignButton buttonText="Assign Location" loading={loading} />
      </form>
    </FormLayout>
  );
};

export default AssignLocation;

export const locations = [
  { id: uuidv4(), option: "Mumbai" },
  { id: uuidv4(), option: "London" },
  { id: uuidv4(), option: "Newyork" },
];
