<<<<<<< HEAD
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import { v4 as uuidv4 } from "uuid";
import "./style.css";
import CreateWorkflows from "../../../components/manageFiles/files/workflows/createWorkflows/CreateWorkflow";

const WorkflowsPage = () => {
  return (
    <WorkflowLayout>
      <ManageFiles title="new workflow" OverlayComp={CreateWorkflows}>
        <div id="createdByMe">
          <SectionBox title="created by me" cardItems={createTemplatesByMe} />
        </div>
        <div id="drafts">
          <SectionBox title="drafts" cardItems={drafts} />
        </div>
      </ManageFiles>
    </WorkflowLayout>
  );
};

export default WorkflowsPage;

export const createTemplatesByMe = [
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
=======
import "./style.css";

const WorkflowsPage = () => {
    return <>
        All workflows
    </>
}

export default WorkflowsPage;
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
