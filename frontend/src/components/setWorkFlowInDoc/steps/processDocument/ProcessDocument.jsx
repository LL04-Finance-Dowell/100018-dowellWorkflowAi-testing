import styles from "./processDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import FormLayout from "../../formLayout/FormLayout";
import { useForm } from "react-hook-form";
import Select from "../../select/Select";
import AssignButton from "../../assignButton/AssignButton";

const ProcessDocument = () => {
  const [currentProcess, setCurrentProcess] = useState();

  useEffect(() => {
    setCurrentProcess(processDocument[0]);
  }, []);

  const handleCurrentProcess = (item) => {
    setCurrentProcess(item);
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("workflow", data);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className={styles.container}>
      <h2 className={`h2-small step-title ${styles.header}`}>
        5. Process Document
      </h2>
      <div className={styles.box}>
        <div className={styles.left__container}>
          <div className={styles.form__box}>
            <FormLayout isSubmitted={isSubmitted} loading={loading}>
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="workflows">Select workflows to remove</label>
                <Select
                  register={register}
                  name="workflows"
                  options={workflows}
                />
                <AssignButton buttonText="Remove Workflows" loading={loading} />
              </form>
            </FormLayout>
          </div>

          <div className={styles.button__container}>
            <a className={styles.save__workflows__button}>
              Save Workflows to document
            </a>
            <a className={styles.close__button}>Close</a>
          </div>
        </div>
        <div className={styles.right__container}>
          <div className={styles.right__box}>
            <div
              style={{
                position: "relative",
              }}
              className={styles.process__container}
            >
              {processDocument.map((item) => (
                <>
                  <div
                    onClick={() => handleCurrentProcess(item)}
                    className={`${styles.process__box} ${
                      item.id === currentProcess?.id && styles.active__process
                    }`}
                  >
                    {item.process}
                  </div>
                  <div
                    style={{
                      display: `${
                        item.id === currentProcess?.id ? "block" : "none"
                      }`,
                    }}
                    className={styles.process__detail__container}
                  >
                    <div className={styles.process__detail__box}>
                      <p>{currentProcess && currentProcess.processDetail}</p>
                      <p className={styles.start__processing__button}>
                        Save & Start Processing
                      </p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-line">
        <span
          style={{ backgroundColor: "var(--e-global-color-1342d1f)" }}
        ></span>
      </div>
    </div>
  );
};

export default ProcessDocument;

export const workflows = [
  { id: uuidv4(), option: "Workflow 1" },
  { id: uuidv4(), option: "Workflow 2" },
  { id: uuidv4(), option: "Workflow 3" },
  { id: uuidv4(), option: "All Workflows" },
];

export const processDocument = [
  {
    id: uuidv4(),
    process: "Member (Team > Guest > Public)",
    processDetail: "Member (Team > Guest > Public)",
  },
  {
    id: uuidv4(),
    process: "Workflows (1 > 2 > 3...)",
    processDetail: "Workflows (1 > 2 > 3...)",
  },
  {
    id: uuidv4(),
    process: "Workflow steps (Step1 > Step2 > Step3..)",
    processDetail: "Workflow steps (Step1 > Step2 > Step3..)",
  },
  {
    id: uuidv4(),
    process: "Document content",
    processDetail: "Document content",
  },
  {
    id: uuidv4(),
    process: "Signing location",
    processDetail: "Signing location",
  },
  { id: uuidv4(), process: "Time limit", processDetail: "Time limit" },
];
