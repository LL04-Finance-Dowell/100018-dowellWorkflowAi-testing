import styles from "./createWorkflow.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Overlay from "../../../overlay/Overlay";

import overlayStyles from "../../../overlay/overlay.module.css";

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
    <Overlay title="Create Document" handleToggleOverlay={handleToggleOverlay}>
      <div className={styles.form__container}>
        <div className={overlayStyles.input__box}>
          <label>
            Workflow Title <span>*</span>
          </label>
          <input value={workflowTitle} onChange={handleWorkflowChange} />
        </div>
        <table>
          <thead>
            <tr>
              <th>step name</th>
              <th>role</th>
            </tr>
          </thead>
          <tbody>
            {internalWorkflows.map((item) => (
              <tr key={item.id}>
                <th>{item.stepName}</th>
                <th>
                  <span>{item.role}</span>
                  <span
                    onClick={() => handleRemoveInternalTemplate(item.id)}
                    className={styles.remove__item__button}
                  >
                    x
                  </span>
                </th>
              </tr>
            ))}
            {/*  {isStep ? (
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
            )} */}
          </tbody>
        </table>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.form__box} style={{ display: "flex" }}>
            <div className={overlayStyles.input__box}>
              <label htmlFor="stepName">Step Name</label>
              <input
                placeholder="Step Name"
                id="stepName"
                {...register("stepName")}
              />
            </div>
            <div className={overlayStyles.input__box}>
              <label htmlFor="role">Role</label>
              <input placeholder="Role" id="role" {...register("role")} />
            </div>
            <button className={styles.add__table__button} type="submit">
              +
            </button>
          </div>
        </form>

        <div className={styles.button__group}>
          <button
            onClick={handleToggleOverlay}
            className={styles.cancel__button}
          >
            cancel
          </button>
          <button className={styles.add__button}>add</button>
        </div>
      </div>
    </Overlay>
  );
};

export default CreateWorkflows;

{
  /* <Overlay title="Workflows Form" handleToggleOverlay={handleToggleOverlay}>
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
 */
}
