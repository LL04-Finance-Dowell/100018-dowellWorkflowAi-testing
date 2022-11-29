import CreateDocument from "../../../components/createDocument/CreateDocument";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";

const CreateNewDocumentPage = () => {
  return (
    <>
      <WorkflowLayout>
        <CreateDocument />
      </WorkflowLayout>
    </>
  );
};

export default CreateNewDocumentPage;
