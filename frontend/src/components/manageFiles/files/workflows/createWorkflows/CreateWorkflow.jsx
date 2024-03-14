import styles from "./createWorkflow.module.css";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Overlay from "../../../overlay/Overlay";
import overlayStyles from "../../../overlay/overlay.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createWorkflow,
  updateWorkflow,
} from "../../../../../features/workflow/asyncTHunks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SubmitButton from "../../../../submitButton/SubmitButton";
import { setToggleManageFileForm } from "../../../../../features/app/appSlice";
import Spinner from "../../../../spinner/Spinner";
import { TiTick } from "react-icons/ti";
import axios from "axios";
import StepTable from "./stepTable/StepTable";
import { useTranslation } from "react-i18next";
import { productName } from "../../../../../utils/helpers";

const CreateWorkflows = ({ handleToggleOverlay }) => {
  const { t } = useTranslation();

  const notify = (message) => toast.success(message);

  const stepNameRef = useRef(null);
  const { userDetail } = useSelector((state) => state.auth);
  const { creditResponse } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  const { status, workflowDetailStatus, updateWorkflowStatus } = useSelector(
    (state) => state.workflow
  );
  const { currentWorkflow } = useSelector((state) => state.processes);

  const [internalWorkflows, setInternalWorkflows] = useState([]);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [currentTableCell, setCurrentTableCall] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const { step_name, role } = watch();
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);

  useEffect(() => {
    if ((step_name && role) || (step_name && !role) || (!step_name && role))
      return setSubmitBtnDisabled(true);

    setSubmitBtnDisabled(false);
  }, [step_name, role]);

  useEffect(() => {
    if (
      workflowTitle.length < 1 ||
      internalWorkflows.length < 1 ||
      currentTableCell
    )
      return setSubmitBtnDisabled(true);

    setSubmitBtnDisabled(false);
  }, [workflowTitle, internalWorkflows, currentTableCell]);

  const onSubmit = (data) => {
    const { role, step_name } = data;
    if (
      internalWorkflows.find(
        (item) => item.role.toLowerCase().trim() === role.toLowerCase().trim()
      ) &&
      !currentTableCell
    )
      toast.warn("Role name already in use");
    else {
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
    }
  };

  const handleWorkflowChange = (e) => {
    setWorkflowTitle(e.target.value);
  };

  const handleCreateWorkflow = async () => {
    try {
      setSubmitBtnDisabled(true);
  
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
        const newData = JSON.parse(JSON.stringify(currentWorkflow));
        if (Array.isArray(steps)) {
          newData.workflows.steps = steps;
        } else {
          console.error("newSteps must be an array.");
        }
        delete newData?.workflows.data_type;
        newData.portfolio = newData.creator_portfolio;
        delete newData.creator_portfolio;
  
        dispatch(updateWorkflow({ newData, notify, handleAfterCreated }));
      }else if (internalWorkflows < 1){
        toast.warn("Please add atleast one step")
      } 
      else {
        const data = {
          created_by: userDetail?.userinfo.username,
          wf_title: workflowTitle,
          company_id:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                  (portfolio) => portfolio.product === productName
                )?.org_id
              : userDetail?.portfolio_info[0].org_id,
          data_type:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                  (portfolio) => portfolio.product === productName
                )?.data_type
              : userDetail?.portfolio_info[0].data_type,
          steps,
          portfolio:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                  (portfolio) => portfolio.product === productName
                )?.portfolio_name
              : userDetail?.portfolio_info[0]?.portfolio_name,
        };
  
        const Api_key = creditResponse?.api_key;
        await axios.post(
          `https://100105.pythonanywhere.com/api/v3/process-services/?type=product_service&api_key=${Api_key}`,
          {
            service_id: "DOWELL10026",
            sub_service_ids: ["DOWELL100263"],
          }
        );
  
        dispatch(createWorkflow({ data, notify, handleAfterCreated }));
      }
    } catch (error) {
      // console.log(error);
      toast.info(error.response?.data?.message);
    } finally {
      setSubmitBtnDisabled(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowDetailStatus]);

  useEffect(() => {}, [internalWorkflows]);

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
              {t("Workflow Title")} <span>*</span>
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
                <div className={overlayStyles.input__box} style={{marginRight:'10px'}}>
                  <label ref={stepNameRef} htmlFor="step_name">
                    {t("Step Name")}
                  </label>
                  <input
                    required
                    placeholder={t("Step Name")}
                    id="step_name"
                    {...register("step_name")}
                  />
                </div>
                <div className={overlayStyles.input__box} style={{marginRight:'10px'}}>
                  <label htmlFor="role">{t("Role")}</label>
                  <input
                    required
                    placeholder={t("Role")}
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
              {t("cancel")}
            </button>
            {/* <SubmitButton
              onClick={handleCreateWorkflow}
              status={currentWorkflow ? updateWorkflowStatus : status}
              type="button"
              className={styles.add__button}
              disabled={submitBtnDisabled}
            >
              {currentWorkflow ? t("update") : t("save")}
            </SubmitButton> */}
            <button
              onClick={handleCreateWorkflow}
              className={styles.add__button}
              type="button"
              disabled={submitBtnDisabled}
              style={
                submitBtnDisabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}
              }
            >
              {currentWorkflow ? t("update") : t("save")}
            </button>
          </div>
        </div>
      )}
    </Overlay>
  );
};

export default CreateWorkflows;
