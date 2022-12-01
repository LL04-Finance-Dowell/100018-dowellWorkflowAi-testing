<<<<<<< HEAD
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
      <ManageFiles title="Create a document" OverlayComp={CreateDocument}>
        <div id="createdByMe">
          <SectionBox title="created by me" cardItems={createDocumentsByMe} />
        </div>
        <div id="drafts">
          <SectionBox title="drafts" cardItems={drafts} />
        </div>
      </ManageFiles>
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
=======
import "./style.css";

const DocumentsPage = () => {
    return <>
        All documents page
    </>
}

export default DocumentsPage;
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
