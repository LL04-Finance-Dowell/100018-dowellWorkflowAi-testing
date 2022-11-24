import styles from "./processDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef } from "react";
import FormLayout from "../../formLayout/FormLayout";
import { useForm } from "react-hook-form";
import Select from "../../select/Select";
import AssignButton from "../../assignButton/AssignButton";

const ProcessDocument = () => {
  const [currentProcess, setCurrentProcess] = useState();
  const refone = useRef(null);
  const reftwo = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setCurrentProcess(processDocument[0]);
  }, []);

  const handleCurrentProcess = (item, cindex) => {
    setCurrentProcess(item);
    setIndex(cindex);
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
            <div className={styles.process__container}>
              {processDocument.map((item, index) => (
                <div
                  ref={refone}
                  style={{
                    marginBottom: `${
                      currentProcess && item.id === currentProcess.id
                        ? "180px"
                        : 0
                    }`,
                  }}
                  onClick={() => handleCurrentProcess(item, index)}
                  className={`${styles.process__box} ${
                    currentProcess &&
                    item.id === currentProcess.id &&
                    styles.active__process
                  }`}
                >
                  {item.process}
                </div>
              ))}
            </div>
            <div
              style={{
                bottom: `${
                  (5 - index) * refone.current?.getBoundingClientRect().height
                }px`,
              }}
              ref={reftwo}
              className={styles.process__detail__container}
            >
              <div className={styles.process__detail__box}>
                <p>{currentProcess && currentProcess.processDetail}</p>
                <p className={styles.start__processing__button}>
                  Save & Start Processing
                </p>
              </div>
            </div>
          </div>
        </div>
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
