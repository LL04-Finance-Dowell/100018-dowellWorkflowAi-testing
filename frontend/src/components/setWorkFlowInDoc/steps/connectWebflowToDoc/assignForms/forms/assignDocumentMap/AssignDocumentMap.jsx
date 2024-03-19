import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import Select from "../../../../../select/Select";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import AssignButton from "../../../../../assignButton/AssignButton";
import { useState } from "react";
import FormLayout from "../../../../../formLayout/FormLayout";
import { useDispatch, useSelector } from "react-redux";
import { updateSingleProcessStep } from "../../../../../../../features/processes/processesSlice";


const AssignDocumentMap = ({ currentStepIndex }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { docCurrentWorkflow } = useSelector((state) => state.processes);
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

  return (
    <FormLayout isSubmitted={isSubmitted} loading={loading}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={globalStyles.assign__document__map}
      >
        <Select
          register={register}
          name="document_map"
          options={documents}
          takeNormalValue={true}
        />
        <AssignButton buttonText="paste document map" loading={loading} />
      </form>
    </FormLayout>
  );
};

export default AssignDocumentMap;

export const documents = [
  { id: uuidv4(), option: "All Document" },
  { id: uuidv4(), option: "Balance Document" },
  { id: uuidv4(), option: "Same as Previouse" },
];
