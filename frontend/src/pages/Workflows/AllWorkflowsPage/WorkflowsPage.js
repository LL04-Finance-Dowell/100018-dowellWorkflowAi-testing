import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import { v4 as uuidv4 } from "uuid";
import "./style.css";
import CreateWorkflows from "../../../components/manageFiles/files/workflows/createWorkflows/CreateWorkflow";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mineWorkflow } from "../../../features/workflow/asyncTHunks";
import WorkflowCard from "../../../components/hoverCard/workflowCard/WorkflowCard";

const WorkflowsPage = () => {
  const { minedWorkflows } = useSelector((state) => state.workflow);

  const dispatch = useDispatch();

  useEffect(() => {
    const data = {
      company_id: "6360b64d0a882cf6308f5758",
      created_by: "Manish",
    };
    dispatch(mineWorkflow(data));
  }, []);

  console.log("workflowwmining", minedWorkflows);

  return (
    <WorkflowLayout>
      <div id="newWorkflow">
        <ManageFiles title="Workflow" OverlayComp={CreateWorkflows}>
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              cardItems={drafts}
              Card={WorkflowCard}
            />
          </div>
          <div id="createdByMe">
            <SectionBox
              Card={WorkflowCard}
              feature="workflow"
              cardBgColor="#1ABC9C"
              title="created by me"
              cardItems={minedWorkflows}
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

export const drafts = [
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
];
