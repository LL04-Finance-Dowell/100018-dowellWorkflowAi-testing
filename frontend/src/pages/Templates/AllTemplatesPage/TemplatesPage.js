import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";
import { v4 as uuidv4 } from "uuid";

const TemplatesPage = () => {
  return (
    <WorkflowLayout>
      <div id="newTemplate">
        <ManageFiles title="New template">
          <div id="drafts">
            <SectionBox title="drafts" cardItems={drafts} />
          </div>
          <div id="createdByMe">
            <SectionBox title="created by me" cardItems={createTemplatesByMe} />
          </div>
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default TemplatesPage;

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
