import { useEffect, useState } from "react";
import CreateDocument from "../../../components/manageFiles/files/documents/createDocument/CreateDocument";
import styles from "./documentsPage.module.css";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import { useDispatch, useSelector } from "react-redux";
import { mineDocuments } from "../../../features/document/asyncThunks";

const DocumentsPage = () => {
  const { mineDocuments: minedDocuments, status } = useSelector(
    (state) => state.document
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const data = {
      created_by: "Manish",
      company_id: "6360b64d0a882cf6308f5758",
    };
    dispatch(mineDocuments(data));
  }, []);

  return (
    <WorkflowLayout>
      <div id="newDocument">
        <ManageFiles title="Document" OverlayComp={CreateDocument}>
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              cardItems={drafts}
            />
          </div>
          <div id="createdByMe">
            <SectionBox
              feature="document"
              cardBgColor="#1ABC9C"
              title="created by me"
              cardItems={minedDocuments}
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
