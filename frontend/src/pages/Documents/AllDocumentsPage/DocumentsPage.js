import { useEffect, useState } from "react";
import CreateDocument from "../../../components/manageFiles/files/documents/createDocument/CreateDocument";
import styles from "./documentsPage.module.css";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import { useDispatch, useSelector } from "react-redux";
import {
  allDocuments,
  mineDocuments,
  savedDocuments,
} from "../../../features/document/asyncThunks";
import DocumentCard from "../../../components/hoverCard/documentCard/DocumentCard";

const DocumentsPage = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const {
    minedDocuments,
    savedDocumentsItems,
    mineStatus,
    allDocuments: allDocumentsArray,
    savedDocumentsStatus,
    allDocumentsStatus,
  } = useSelector((state) => state.document);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
    };
    /*     if (savedDocumentsStatus !== "succeeded")
      dispatch(savedDocuments(draftData));
    if (mineStatus !== "succeeded") dispatch(mineDocuments(data)); */

    if (allDocumentsStatus === "idle") dispatch(allDocuments(data));
  }, []);

  console.log("aaaaaaaaaaa", allDocumentsArray);

  return (
    <WorkflowLayout>
      <div id="new-document">
        <ManageFiles title="Document" OverlayComp={CreateDocument}>
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              Card={DocumentCard}
              cardItems={
                allDocumentsArray &&
                allDocumentsArray.length &&
                allDocumentsArray.filter(
                  (item) =>
                    item.created_by === userDetail?.portfolio_info[0].username
                )
              }
              status={allDocumentsStatus}
            />
          </div>
          <div id="saved-documents">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="saved documents"
              Card={DocumentCard}
              cardItems={allDocumentsArray}
              status={allDocumentsStatus}
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

/* export const drafts = [
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
];
 */
