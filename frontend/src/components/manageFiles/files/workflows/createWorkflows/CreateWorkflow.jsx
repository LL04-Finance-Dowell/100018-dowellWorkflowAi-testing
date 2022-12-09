import styles from "./createWorkflow.module.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Overlay from "../../../overlay/Overlay";
import { useUserContext } from "../../../../../contexts/UserContext";
import overlayStyles from "../../../overlay/overlay.module.css";
import { useDispatch, useSelector } from "react-redux";
import { createWorkflow } from "../../../../../features/workflow/asyncTHunks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingSpinner } from "../../../../LoadingSpinner/LoadingSpinner";
import SubmitButton from "../../../../submitButton/SubmitButton";
import { setToggleManageFileForm } from "../../../../../features/app/appSlice";
import Spinner from "../../../../spinner/Spinner";
import { localStorageGetItem } from "../../../../../utils/localStorageUtils";

const CreateWorkflows = ({ handleToggleOverlay }) => {
  const userDetail = localStorageGetItem("userDetail");

  const dispatch = useDispatch();
  const { workflow, status, workflowDetailStatus } = useSelector(
    (state) => state.workflow
  );
  const { currentWorkflow } = useSelector((state) => state.app);

  console.log("currentWorkflow", currentWorkflow);

  const notify = (title) => toast("created" + " " + title);

  const [internalWorkflows, setInternalWorkflows] = useState([]);
  const [workflowTitle, setWorkflowTitle] = useState("");

  const { currentUser } = useUserContext();

  console.log("currentUSer0", currentUser);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const { role, stepName } = data;
    const internalTemplate = { id: uuidv4(), stepName, role };

    setInternalWorkflows((prev) => [...prev, internalTemplate]);

    reset();
  };

  const handleRemoveInternalTemplate = (id) => {
    setInternalWorkflows((prev) => prev.filter((item) => item.id !== id));
  };

  const handleWorkflowChange = (e) => {
    setWorkflowTitle(e.target.value);
  };

  const handleCreateWorkflow = () => {
    if (workflowTitle.length < 1) {
      console.log("add workflow title");
      return;
    }

    if (internalWorkflows.length < 1) {
      console.log("add steps");
      return;
    }

    const data = {
      created_by: userDetail?.userinfo.username,
      wf_title: workflowTitle,
      company_id: userDetail?.userinfo.client_admin_id,
      steps: internalWorkflows.map((item) => ({
        step_name: item.stepName,
        member_type: item.role,
        rights: "",
        display_before: "",
        skip: "",
        limit: "",
        start_time: "",
        end_time: "",
        member_portfolio: "",
        reminder: "",
      })),
    };

    if (currentWorkflow) {
      console.log("update");
    } else {
      const handleAfterCreated = () => {
        reset();
        setWorkflowTitle("");
        setInternalWorkflows([]);
        dispatch(setToggleManageFileForm(false));
      };

      dispatch(createWorkflow({ data, notify, handleAfterCreated }));
    }
  };

  useEffect(() => {
    if (workflowDetailStatus === "error") {
      dispatch(setToggleManageFileForm(false));
    } else {
      if (currentWorkflow) setWorkflowTitle(currentWorkflow.workflow_title);
    }
  }, [workflowDetailStatus]);

  return (
    <Overlay
      title={`${
        workflowDetailStatus === "pending" || currentWorkflow
          ? "Update"
          : "Create"
      } Workflow`}
      handleToggleOverlay={handleToggleOverlay}
    >
      {workflowDetailStatus === "pending" ? (
        <Spinner />
      ) : (
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
            </tbody>
          </table>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.form__box} style={{ display: "flex" }}>
              <div className={overlayStyles.input__box}>
                <label htmlFor="stepName">Step Name</label>
                <input
                  required
                  placeholder="Step Name"
                  id="stepName"
                  {...register("stepName")}
                />
              </div>
              <div className={overlayStyles.input__box}>
                <label htmlFor="role">Role</label>
                <input
                  required
                  placeholder="Role"
                  id="role"
                  {...register("role")}
                />
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
            <SubmitButton
              onClick={handleCreateWorkflow}
              status={status}
              type="button"
              className={styles.add__button}
            >
              {currentWorkflow ? "update" : "add"}
            </SubmitButton>
          </div>
        </div>
      )}
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
