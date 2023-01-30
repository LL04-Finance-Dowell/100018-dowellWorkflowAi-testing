import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import { v4 as uuidv4 } from "uuid";
import "./style.css";
import CreateWorkflows from "../../../components/manageFiles/files/workflows/createWorkflows/CreateWorkflow";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mineWorkflows,
  savedWorkflows,
} from "../../../features/workflow/asyncTHunks";
import WorkflowCard from "../../../components/hoverCard/workflowCard/WorkflowCard";

const WorkflowsPage = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const {
    minedWorkflows,
    mineStatus,
    savedWorkflowItems,
    savedWorkflowStatus,
  } = useSelector((state) => state.workflow);

  const dispatch = useDispatch();

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
      created_by: userDetail?.userinfo.username,
    };

    const saveddata = {
      company_id: userDetail?.portfolio_info[0].org_id,
    };

    if (savedWorkflowStatus === "idle") dispatch(savedWorkflows(saveddata));
    if (mineStatus === "idle") dispatch(mineWorkflows(data));
  }, []);

  console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwww", minedWorkflows);
  console.log("savedddddddddddddddddddddd", savedWorkflows);

  return (
    <WorkflowLayout>
      <div id="new-workflow">
        <ManageFiles title="Workflow" OverlayComp={CreateWorkflows}>
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              cardItems={minedWorkflows}
              status={mineStatus}
              Card={WorkflowCard}
            />
          </div>
          <div id="saved-workflows">
            <SectionBox
              Card={WorkflowCard}
              cardBgColor="#1ABC9C"
              title="saved workflows"
              status={savedWorkflowStatus}
              cardItems={savedWorkflowItems}
            />
          </div>
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default WorkflowsPage;

export const createWorkflowsByMe = [
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
];

export const drafts = [{ id: uuidv4() }];
