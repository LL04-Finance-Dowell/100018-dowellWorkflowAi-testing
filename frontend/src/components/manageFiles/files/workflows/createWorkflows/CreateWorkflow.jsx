import styles from "./createWorkflow.module.css";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Overlay from "../../../overlay/Overlay";
import { useUserContext } from "../../../../../contexts/UserContext";
import overlayStyles from "../../../overlay/overlay.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createWorkflow,
  updateWorkflow,
} from "../../../../../features/workflow/asyncTHunks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingSpinner } from "../../../../LoadingSpinner/LoadingSpinner";
import SubmitButton from "../../../../submitButton/SubmitButton";
import { setToggleManageFileForm } from "../../../../../features/app/appSlice";
import Spinner from "../../../../spinner/Spinner";
import { localStorageGetItem } from "../../../../../utils/localStorageUtils";
import { TiTick } from "react-icons/ti";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import StepTable from "./stepTable/StepTable";

const CreateWorkflows = ({ handleToggleOverlay }) => {
  const notify = (title) => toast("created" + " " + title);

  const stepNameRef = useRef(null);
  const userDetail = localStorageGetItem("userDetail");

  const dispatch = useDispatch();
  const { workflow, status, workflowDetailStatus, updateWorkflowStatus } =
    useSelector((state) => state.workflow);
  const { currentWorkflow } = useSelector((state) => state.app);

  console.log("currentWorkflow", currentWorkflow);

  const [internalWorkflows, setInternalWorkflows] = useState([]);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [currentTableCell, setCurrentTableCall] = useState(null);

  const { currentUser } = useUserContext();

  console.log("currentUSer0", currentUser);

  const { register, handleSubmit, reset, setValue } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const { member_type, step_name } = data;
    if (currentTableCell) {
      setInternalWorkflows((prev) =>
        prev.map((item) =>
          item._id === currentTableCell._id
            ? { ...item, step_name, member_type }
            : item
        )
      );
      setCurrentTableCall(null);
    } else {
      const internalTemplate = { _id: uuidv4(), step_name, member_type };

      setInternalWorkflows((prev) => [...prev, internalTemplate]);
    }

    reset();
  };

  /* const handleRemoveInternalTemplate = (id) => {
    setInternalWorkflows((prev) => prev.filter((item) => item.id !== id));
  }; */

  /*   const handleEditInternalTemplate = (currentİtem) => {
    setCurrentTableCall(currentİtem);

    stepNameRef.current?.click();
    setValue("step_name", currentİtem.step_name);
    setValue("member_type", currentİtem.member_type);
  };
 */
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

    if (currentTableCell) {
      console.log("finish update step");
      return;
    }

    const handleAfterCreated = () => {
      reset();
      setWorkflowTitle("");
      setInternalWorkflows([]);
      dispatch(setToggleManageFileForm(false));
    };

    if (currentWorkflow) {
      const updateData = {
        workflow_id: currentWorkflow._id,
        workflow_title: workflowTitle,
        steps: internalWorkflows.map((item) => ({
          step_name: item.step_name,
        })),
      };

      dispatch(updateWorkflow({ updateData, handleAfterCreated }));
    } else {
      const data = {
        created_by: userDetail?.userinfo.username,
        wf_title: workflowTitle,
        company_id: userDetail?.portfolio_info.org_id,
        steps: internalWorkflows.map((item) => ({
          step_name: item.step_name,
          member_type: item.member_type,
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

      console.log("dataaaaaaaaaaaaaaaaaaa", data);

      dispatch(createWorkflow({ data, notify, handleAfterCreated }));
    }
  };

  useEffect(() => {
    if (workflowDetailStatus === "error") {
      dispatch(setToggleManageFileForm(false));
    } else {
      if (currentWorkflow && currentWorkflow.workflows) {
        setWorkflowTitle(currentWorkflow.workflows?.workflow_title);
        setInternalWorkflows(
          currentWorkflow.workflows?.steps.map((item) => ({
            ...item,
            _id: uuidv4(),
          }))
        );
      }
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
      ) : status === "pending" || updateWorkflowStatus === "pending" ? (
        <Spinner />
      ) : (
        <div className={styles.form__container}>
          <div className={overlayStyles.input__box}>
            <label>
              Workflow Title <span>*</span>
            </label>
            <input value={workflowTitle} onChange={handleWorkflowChange} />
          </div>
          {/*   <table>
            <thead>
              <tr>
                <th>step name</th>
                <th>role</th>
              </tr>
            </thead>
            <tbody>
              {internalWorkflows.map((item) => (
                <tr
                  className={
                    item._id === currentTableCell?._id && styles.editing__ceil
                  }
                  key={item._id}
                >
                  <th>{item.step_name}</th>
                  <th>
                    <span>{item.member_type}</span>
                    <div className={styles.table__features__box}>
                      {currentWorkflow && (
                        <span
                          onClick={() => handleEditInternalTemplate(item)}
                          className={styles.edit__item__button}
                        >
                          <i>
                            <MdModeEditOutline color="green" size={16} />
                          </i>
                        </span>
                      )}
                      {!currentWorkflow && (
                        <span
                          onClick={() => handleRemoveInternalTemplate(item.id)}
                          className={styles.remove__item__button}
                        >
                          <i>
                            <RiDeleteBinLine color="red" size={16} />
                          </i>
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table> */}
          <StepTable
            currentTableCell={currentTableCell}
            internalWorkflows={internalWorkflows}
            setCurrentTableCall={setCurrentTableCall}
            setInternalWorkflows={setInternalWorkflows}
            setValue={setValue}
            currentWorkflow={currentWorkflow}
            stepNameRef={stepNameRef}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.form__box} style={{ display: "flex" }}>
              {!currentWorkflow ? (
                <>
                  <div className={overlayStyles.input__box}>
                    <label ref={stepNameRef} htmlFor="step_name">
                      Step Name
                    </label>
                    <input
                      required
                      placeholder="Step Name"
                      id="step_name"
                      {...register("step_name")}
                    />
                  </div>
                  <div className={overlayStyles.input__box}>
                    <label htmlFor="member_type">Role</label>
                    <input
                      readOnly={currentWorkflow ? true : false}
                      required
                      placeholder="Role"
                      id="member_type"
                      {...register("member_type")}
                    />
                  </div>
                </>
              ) : (
                currentTableCell && (
                  <div className={overlayStyles.input__box}>
                    <label ref={stepNameRef} htmlFor="step_name">
                      Step Name
                    </label>
                    <input
                      required
                      placeholder="Step Name"
                      id="step_name"
                      {...register("step_name")}
                    />
                  </div>
                )
              )}
              {currentWorkflow ? (
                currentTableCell && (
                  <button
                    style={{ marginRight: "auto", marginLeft: "25px" }}
                    className={styles.add__table__button}
                    type="submit"
                  >
                    <TiTick />
                  </button>
                )
              ) : (
                <button className={styles.add__table__button} type="submit">
                  +
                </button>
              )}
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
              status={currentWorkflow ? updateWorkflowStatus : status}
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
