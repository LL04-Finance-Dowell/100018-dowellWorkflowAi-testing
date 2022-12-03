import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useUserContext } from "./contexts/UserContext";
import useDowellLogin from "./hooks/useDowellLogin";
import WorkflowApp from "./pages/App/WorkflowApp";
import LandingPage from "./pages/Landing/Home";
import "./App.css";
import DocumentsPage from "./pages/Documents/AllDocumentsPage/DocumentsPage";
import CreateNewDocumentPage from "./pages/Documents/NewDocumentPage/CreateNewDocumentPage";
import ProcessDocumentsPage from "./pages/Documents/ProcessDocumentsPage/ProcessDocumentsPage";
import SignDocumentsPage from "./pages/Documents/SignDocumentPage/SignDocumentsPage";
import RejectedDocumentsPage from "./pages/Documents/RejectedDocuments/RejectedDocumentsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import RejectedTemplatesPage from "./pages/Templates/RejectedTemplatesPage/RejectedTemplatesPage";
import CreateNewTemplatePage from "./pages/Templates/CreateTemplatePage/CreateNewTemplatePage";
import ApproveTemplatesPage from "./pages/Templates/ApproveTemplatesPage/ApproveTemplatesPage";
import TemplatesPage from "./pages/Templates/AllTemplatesPage/TemplatesPage";
import WorkflowsPage from "./pages/Workflows/AllWorkflowsPage/WorkflowsPage";
import CreateNewWorkflowPage from "./pages/Workflows/CreateNewWorkflowPage/CreateNewWorkflowPage";
import ApproveWorkflowPage from "./pages/Workflows/ApproveWorkflowPage/ApproveWorkflowPage";
import RejectedWorkflowsPage from "./pages/Workflows/RejectedWorkflowsPage/RejectedWorkflowsPage";
import SetWorkflowInDoc from "./components/setWorkFlowInDoc/SetWorkflowInDoc";
import Documents from "./pages/Documents/Documents/Documents";
import TempDraft from "./pages/Templates/TempDraft/TempDraft";
import DraftsDoc from "./pages/Documents/DraftsDoc/DraftsDoc";
import NewTemplate from "./pages/Templates/NewTemplate/NewTemplate";
import NewWorkFlow from "./pages/Workflows/NewWorkflow/NewWorkFlow";
import DraftF from "./pages/Workflows/DraftF/DraftF";
function App() {
  const { currentUser, setCurrentUser } = useUserContext();
  const [loading, setLoading] = useState(true);

  useDowellLogin(setCurrentUser, setLoading);

  if (loading) return <></>;

  if (!currentUser)
    return (
      <Routes>
        <Route path={"/"} element={<LandingPage />} />
        <Route path={"*"} element={<>Page not found</>} />
      </Routes>
    );

  return (
    <Routes>
      <Route path={"/"} element={<WorkflowApp />} />
      <Route path={"documents"}>
        <Route index element={<DocumentsPage />} />
        <Route path={"new"} element={<CreateNewDocumentPage />} />
        <Route path={"to-sign"} element={<SignDocumentsPage />} />
        <Route path={"rejected"} element={<RejectedDocumentsPage />} />
        <Route path={"to-process"} element={<ProcessDocumentsPage />} />
      </Route>
      <Route path={"templates"}>
        <Route index element={<TemplatesPage />} />
        <Route path={"new"} element={<CreateNewTemplatePage />} />
        <Route path={"to-approve"} element={<ApproveTemplatesPage />} />
        <Route path={"rejected"} element={<RejectedTemplatesPage />} />
      </Route>
      <Route path={"workflows"}>
        <Route index element={<WorkflowsPage />} />
        <Route path={"set-workflow"} element={<SetWorkflowInDoc />} />
        <Route path={"new"} element={<CreateNewWorkflowPage />} />
        <Route path={"to-approve"} element={<ApproveWorkflowPage />} />
        <Route path={"rejected"} element={<RejectedWorkflowsPage />} />
      </Route>
      <Route path={"/notifications"} element={<NotificationsPage />} />
      <Route path="/Documents/Documents/Documents" element={<Documents />} />
      <Route path="/Documents/DraftsDoc/DraftsDoc" element={<DraftsDoc />} />
      <Route path="/Templates/TempDraft/TempDraft" element={<TempDraft />} />
      <Route
        path="/Templates/NewTemplate/NewTemplate"
        element={<NewTemplate />}
      />
      <Route
        path="/WorkFlows/NewWorkFlow/NewWorkFlow"
        element={<NewWorkFlow />}
      />
      <Route path="/WorkFlows/DraftF/DraftF" element={<DraftF />} />
      <Route path={"*"} element={<>Page not found</>} />
    </Routes>
  );
}

export default App;
