import { useState } from "react";
import CreateDocument from "../../../components/manageFiles/files/documents/createDocument/CreateDocument";
import styles from "./documentsPage.module.css";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";

const DocumentsPage = () => {
  return (
    <WorkflowLayout>
      <div id="newDocument">
        <ManageFiles title="New document" OverlayComp={CreateDocument}>
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              cardItems={drafts}
            />
          </div>
          <div id="createdByMe">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="created by me"
              cardItems={createDocumentsByMe}
            />
          </div>
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default DocumentsPage;

export const createDocumentsByMe = [
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
