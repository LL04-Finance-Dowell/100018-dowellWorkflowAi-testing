import { useEffect, useState } from "react";
import CreateDocument from "../../../components/manageFiles/files/documents/createDocument/CreateDocument";
import styles from "./documentsPage.module.css";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import { useDispatch, useSelector } from "react-redux";
import { mineDocuments, drafts } from "../../../features/document/asyncThunks";
import DocumentCard from "../../../components/hoverCard/documentCard/DocumentCard";
import { localStorageGetItem } from "../../../utils/localStorageUtils";

const DocumentsPage = () => {
  const userDetail = localStorageGetItem("userDetail");
  const { minedDocuments, drafts: draftItems } = useSelector(
    (state) => state.document
  );
  const dispatch = useDispatch();

  console.log("draftitems", minedDocuments);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info.org_id,
      created_by: userDetail?.userinfo.username,
    };

    dispatch(drafts(data));
    dispatch(mineDocuments(data));
  }, []);

  return (
    <WorkflowLayout>
      <div id="newDocument">
        <ManageFiles title="Document" OverlayComp={CreateDocument}>
          <div id="drafts">
            <SectionBox
              feature="document-draft"
              cardBgColor="#1ABC9C"
              title="drafts"
              Card={DocumentCard}
              cardItems={draftItems}
            />
          </div>
          <div id="createdByMe">
            <SectionBox
              feature="document"
              cardBgColor="#1ABC9C"
              title="created by me"
              Card={DocumentCard}
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

/* export const drafts = [
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
];
 */
