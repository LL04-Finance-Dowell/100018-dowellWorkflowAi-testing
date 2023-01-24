import React, { useState } from "react";
import FormLayout from "../../../../../formLayout/FormLayout";
import Select from "../../../../../select/Select";
import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import styles from "./copiesOdDoc.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import AssignButton from "../../../../../assignButton/AssignButton";

const CopiesOfDoc = () => {
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
        <h2 className={styles.header}>
          Copies of document from previous step (select for processing)
        </h2>
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
        <AssignButton
          loading={loading}
          buttonText="Copies of document from previous step (select for processing)"
        />
      </form>
    </FormLayout>
  );
};

export default CopiesOfDoc;

export const taskFeatures = [
  { id: uuidv4(), feature: "document clone 1" },
  { id: uuidv4(), feature: "document clone 1" },
  { id: uuidv4(), feature: "document clone 1" },
  { id: uuidv4(), feature: "document clone 1" },
];
