import styles from "./createWorkflow.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Overlay from "../../../overlay/Overlay";
import { ClassNames } from "@emotion/react";

const CreateWorkflows = ({ handleToggleOverlay }) => {
  const [internalWorkflows, setInternalWorkflows] = useState([]);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [isStep, setIsStep] = useState(true);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const { role, stepName } = data;
    const internalTemplate = { id: uuidv4(), stepName, role };

    setInternalWorkflows((prev) => [...prev, internalTemplate]);
  };

  const handleRemoveInternalTemplate = (id) => {
    setInternalWorkflows((prev) => prev.filter((item) => item.id !== id));
    if (internalWorkflows.length === 0) {
      setIsStep(true);
    } else {
      setIsStep(false);
    }
  };

  const handleWorkflowChange = (e) => {
    setWorkflowTitle(e.target.value);
  };

  return (
    <Overlay title="Workflows Form" handleToggleOverlay={handleToggleOverlay}>
      <div className={styles.form__container}>
        <div className={styles.workflow__title__box}>
          <h5 className={styles.workflow__title}>Workflow Title *</h5>
          <input
            value={workflowTitle}
            required
            onChange={(e) => handleWorkflowChange(e)}
          />
        </div>
        <div className={styles.form__box}>
          {/*  <h5 className={styles.form__box__title}>Internal Workflows</h5> */}
          <table>
            <thead>
              <tr>
                <th>step name</th>
                <th>role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isStep ? (
                internalWorkflows.map((item) => (
                  <tr key={item.id}>
                    <th>{item.stepName}</th>
                    <th>{item.role}</th>
                    <th onClick={() => handleRemoveInternalTemplate(item.id)}>
                      <button className={styles.remove__step__button}>X</button>
                    </th>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className={styles.no__step} colSpan={4}>
                    No Step
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.input__box}>
              <label htmlFor="stepName">Step name</label>
              <input
                required
                id="stepName"
                {...register("stepName")}
                placeholder="Step Name"
              />
            </div>
            <div className={styles.input__box}>
              <label htmlFor="role">Role</label>
              <input
                required
                id="role"
                {...register("role")}
                placeholder="Role"
              />
            </div>
            <button
              type="submit"
              className={`${styles.step__add__button} ${styles.button}`}
            >
              Add
            </button>
          </form>
          <div className={styles.footer__button__box}>
            <button
              onClick={handleToggleOverlay}
              className={`${styles.cancel__button} ${styles.button}`}
            >
              cancel
            </button>
            <button className={`${styles.add__button} ${styles.button}`}>
              add
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
};

export default CreateWorkflows;
