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
import { TiTick } from "react-icons/ti";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import StepTable from "./stepTable/StepTable";

const CreateWorkflows = ({ handleToggleOverlay }) => {
  const notify = (message) => toast.success(message);

  const stepNameRef = useRef(null);
  const { userDetail } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { status, workflowDetailStatus, updateWorkflowStatus } = useSelector(
    (state) => state.workflow
  );
  const { currentWorkflow } = useSelector((state) => state.app);

  console.log("currentWorkflow", currentWorkflow);

  const [internalWorkflows, setInternalWorkflows] = useState([]);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [currentTableCell, setCurrentTableCall] = useState(null);

  const { currentUser } = useUserContext();

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const { step_name, role } = watch();
  const [ submitBtnDisabled, setSubmitBtnDisabled ] = useState(false);

  useEffect(() => {
    
    if ((step_name) && (role)) return setSubmitBtnDisabled(true);

    setSubmitBtnDisabled(false);

  }, [step_name, role])

  const onSubmit = (data) => {
    console.log(data);
    const { role, step_name } = data;
    if (currentTableCell) {
      setInternalWorkflows((prev) =>
        prev.map((item) =>
          item._id === currentTableCell._id
            ? { ...item, step_name, role }
            : item
        )
      );
      setCurrentTableCall(null);
    } else {
      const internalTemplate = { _id: uuidv4(), step_name, role };

      setInternalWorkflows((prev) => [...prev, internalTemplate]);
    }

    reset();
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

    const steps = internalWorkflows.map((item) => ({
      step_name: item.step_name,
      role: item.role,
    }));

    if (currentWorkflow) {
      const updateData = {
        created_by: userDetail?.portfolio_info[0].username,
        company_id: userDetail?.portfolio_info[0].org_id,
        wf_title: workflowTitle,
        workflow_id: currentWorkflow._id,
        data_type: userDetail?.portfolio_info[0].data_type,
        steps,
      };

      dispatch(updateWorkflow({ updateData, notify, handleAfterCreated }));
    } else {
      const data = {
        created_by: userDetail?.userinfo.username,
        wf_title: workflowTitle,
        company_id: userDetail?.portfolio_info[0].org_id,
        data_type: userDetail?.portfolio_info[0].data_type,
        steps,
      };

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
                  <label htmlFor="role">Role</label>
                  <input
                    required
                    placeholder="Role"
                    id="role"
                    {...register("role")}
                  />
                </div>
              </>

              <button className={styles.add__table__button} type="submit">
                {currentTableCell ? <TiTick /> : "+"}
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
              status={currentWorkflow ? updateWorkflowStatus : status}
              type="button"
              className={styles.add__button}
              disabled={submitBtnDisabled}
            >
              {currentWorkflow ? "update" : "save"}
            </SubmitButton>
          </div>
        </div>
      )}
    </Overlay>
  );
};

export default CreateWorkflows;
