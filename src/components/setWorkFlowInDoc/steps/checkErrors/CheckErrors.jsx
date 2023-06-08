import FormLayout from "../../formLayout/FormLayout";
import styles from "./checkErrors.module.css";
import Select from "../../select/Select";
import { v4 as uuidv4 } from "uuid";
import AssignButton from "../../assignButton/AssignButton";
import { useForm } from "react-hook-form";
import { useState } from "react";
import InfoTable from "./infoTable/InfoTable";

const CheckErrors = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className={styles.container}>
      <h2 className={`${styles.header} h2-small step-title`}>
        4. Check errors before processing
      </h2>
      <div className={styles.sort__process__box}>
        <div className={styles.sort__process__form}>
          <FormLayout isSubmitted={isSubmitted} loading={loading}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Select
                name="process"
                register={register}
                options={processOptions}
              />
              <AssignButton buttonText="Sort Process" loading={loading} />
            </form>
          </FormLayout>
        </div>
      </div>
      <InfoTable />
      <div className="bottom-line">
        <span
          style={{ backgroundColor: "var(--e-global-color-1342d1f)" }}
        ></span>
      </div>
    </div>
  );
};

export default CheckErrors;

export const processOptions = [
  { id: uuidv4(), option: "Sort process Content wise" },
  { id: uuidv4(), option: "Sort process Member wise" },
  { id: uuidv4(), option: "Sort process Workflow step wise" },
  { id: uuidv4(), option: "Sort process Location wise" },
  { id: uuidv4(), option: "Sort process Time wise" },
];
