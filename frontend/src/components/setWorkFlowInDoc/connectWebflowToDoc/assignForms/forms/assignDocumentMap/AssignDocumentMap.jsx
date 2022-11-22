import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import Select from "../../../select/Select";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import AssignButton from "../../assignButton/AssignButton";
import { useState } from "react";
import FormLayout from "../../formLayout/FormLayout";

const AssignDocumentMap = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("docement", data);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <FormLayout isSubmitted={isSubmitted} loading={loading}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${globalStyles.confirm__box} ${
          globalStyles.assign__document__map
        } ${loading && globalStyles.loading}`}
      >
        <Select register={register} name="document" options={documents} />
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
