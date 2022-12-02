import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import { v4 as uuidv4 } from "uuid";
import "./style.css";
import CreateWorkflows from "../../../components/manageFiles/files/workflows/createWorkflows/CreateWorkflow";

const WorkflowsPage = () => {
  return (
    <WorkflowLayout>
      <div id="newWorkflow">
        <ManageFiles title="new workflow" OverlayComp={CreateWorkflows}>
          <div id="drafts">
            <SectionBox title="drafts" cardItems={drafts} />
          </div>
          <div id="createdByMe">
            <SectionBox title="created by me" cardItems={createWorkflowsByMe} />
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
