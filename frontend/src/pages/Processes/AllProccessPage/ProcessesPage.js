import { useEffect, useState } from "react";
import CreateDocument from "../../../components/manageFiles/files/documents/createDocument/CreateDocument";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import { useDispatch, useSelector } from "react-redux";
import {
  mineDocuments,
  savedDocuments,
} from "../../../features/document/asyncThunks";
import DocumentCard from "../../../components/hoverCard/documentCard/DocumentCard";

const ProcessesPage = () => {
  const dispatch = useDispatch();

  /*   useEffect(() => {
 
  }, []); */

  return (
    <WorkflowLayout>
      <div id="new-proccess">
        <ManageFiles title="Proccess">
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              Card={DocumentCard}
              cardItems={createDocumentsByMe}
              status="success"
            />
          </div>
          <div id="saved-processes">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="saved proccess"
              Card={DocumentCard}
              cardItems={createDocumentsByMe}
              status="success"
            />
          </div>
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default ProcessesPage;

export const createDocumentsByMe = [{ id: uuidv4() }];
