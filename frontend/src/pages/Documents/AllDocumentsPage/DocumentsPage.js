import { useState } from "react";
import CreateDocument from "../../../components/documentPage/createDocument/CreateDocument";
import styles from "./documentsPage.module.css";
import { BsPlusSquareDotted } from "react-icons/bs";
import SectionBox from "../../../components/documentPage/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";

const DocumentsPage = () => {
  const [toggleOverlay, setToggleOverlay] = useState(false);

  const handleToggleOverlay = () => {
    setToggleOverlay((prev) => !prev);
  };

  return (
    <WorkflowLayout>
      <div className={styles.container}>
        {toggleOverlay && (
          <div className={styles.overlay}>
            <CreateDocument handleToggleOverlay={handleToggleOverlay} />
          </div>
        )}
        <div>
          <h2 className={styles.header}>Create a document</h2>
          <div
            onClick={handleToggleOverlay}
            className={styles.add__Form__toggle}
          >
            <BsPlusSquareDotted color="black" cursor="pointer" size={70} />
          </div>
        </div>

        <SectionBox title="created by me" cardItems={createDocumentsByMe} />
        <SectionBox title="drafts" cardItems={drafts} />
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
