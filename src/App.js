import { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { setIconColor } from './features/app/appSlice'

import { useUserContext } from './contexts/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import useDowellLogin from './hooks/useDowellLogin';
import WorkflowApp from './pages/App/WorkflowApp';
import LandingPage from './pages/Landing/Home';
import './App.css';
import DocumentsPage from './pages/Documents/AllDocumentsPage/DocumentsPage';
import CreateNewDocumentPage from './pages/Documents/NewDocumentPage/CreateNewDocumentPage';
import ProcessDocumentsPage from './pages/Documents/ProcessDocumentsPage/ProcessDocumentsPage';
import SignDocumentsPage from './pages/Documents/SignDocumentPage/SignDocumentsPage';
import RejectedDocumentsPage from './pages/Documents/RejectedDocuments/RejectedDocumentsPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import RejectedTemplatesPage from './pages/Templates/RejectedTemplatesPage/RejectedTemplatesPage';
import CreateNewTemplatePage from './pages/Templates/CreateTemplatePage/CreateNewTemplatePage';
import ApproveTemplatesPage from './pages/Templates/ApproveTemplatesPage/ApproveTemplatesPage';
import TemplatesPage from './pages/Templates/AllTemplatesPage/TemplatesPage';
import WorkflowsPage from './pages/Workflows/AllWorkflowsPage/WorkflowsPage';
import CreateNewWorkflowPage from './pages/Workflows/CreateNewWorkflowPage/CreateNewWorkflowPage';
import ApproveWorkflowPage from './pages/Workflows/ApproveWorkflowPage/ApproveWorkflowPage';
import RejectedWorkflowsPage from './pages/Workflows/RejectedWorkflowsPage/RejectedWorkflowsPage';
import SetWorkflowInDoc from './components/setWorkFlowInDoc/SetWorkflowInDoc';
import SetWorkflowInDocNew from './components/setWorkFlowInDocNew/SetWorkflowInDoc';
import Documents from './pages/Documents/Documents/Documents';
import TempDraft from './pages/Templates/TempDraft/TempDraft';
import DraftsDoc from './pages/Documents/DraftsDoc/DraftsDoc';
import NewTemplate from './pages/Templates/NewTemplate/NewTemplate';
import NewWorkFlow from './pages/Workflows/NewWorkflow/NewWorkFlow';
import DraftF from './pages/Workflows/DraftF/DraftF';
import { dowellLoginUrl } from './httpCommon/httpCommon';
import WorkflowAiSettings from './components/workflowAiSettings/WorkflowAiSettings';
import VerificationPage from './pages/Verification/VerificationPage';
import ProccessPage from './pages/Processes/AllProccessPage/ProcessesPage';
import SearchPage from './pages/Search/SearchPage';
import ConstructionPage from './pages/ConstructionPage/ConstructionPage';
import { useAppContext } from './contexts/AppContext';
import Spinner from './components/spinner/Spinner';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const { session_id } = useSelector((state) => state.auth);
  const { isPublicUser } = useAppContext();
  useDowellLogin();


  useEffect(() => {
    const interval = setInterval(() => {
      checkstatus();
    }, 6000); // 60 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);


  function checkstatus() {

    // AJAX GET request

    axios.get("https://100014.pythonanywhere.com/api/live_users/g")
      .then((response) => {
        // console.log("getdata", response);
        dispatch(setIconColor("green"));
      })
      .catch((error) => {
        // console.log(error);
        dispatch(setIconColor("red"));
      });


    // AJAX POST request

    axios.post("https://100014.pythonanywhere.com/en/live_status", {
      data: {
        session_id: session_id,
        product: "Workflow AI",

      },
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        console.log("postdata", response);
      })
      .catch((error) => {
        console.log(error)
        // Empty catch block 
      });


  }
  // // USE ONLY WHEN APP IS BROKEN OR UNDERGOING MAJOR CHANGES
  // return (
  //   <Routes>
  //     <Route path="*" element={<ConstructionPage />} />
  //   </Routes>
  // )

  if (isPublicUser)
    return (
      <Routes>
        <Route path={'/verify/:token'} element={<VerificationPage />} />
        <Route path={'*'} element={<>Page not found</>} />
      </Routes>
    );

  return (
    <Suspense fallback={'Language Loading ...'}>
      <Routes>
        <Route path={'/'} element={<WorkflowApp />} />
        <Route path='/settings' element={<WorkflowAiSettings />} />
        <Route path={'documents'}>
          <Route index element={<DocumentsPage home={true} />} />
          <Route
            path={'saved'}
            element={<DocumentsPage showOnlySaved={true} />}
          />
          {/* <Route path={"trash"} element={<DocumentsPage showOnlyTrashed={true} />} /> */}
          {/*  <Route path={"new"} element={<CreateNewDocumentPage />} />
        <Route path={"to-sign"} element={<SignDocumentsPage />} />
        <Route path={"rejected"} element={<RejectedDocumentsPage />} />
        <Route path={"to-process"} element={<ProcessDocumentsPage />} /> */}
        </Route>
        <Route path={'templates'}>
          <Route index element={<TemplatesPage home={true} />} />
          <Route
            path={'saved'}
            element={<TemplatesPage showOnlySaved={true} />}
          />
          {/* <Route path={"trash"} element={<TemplatesPage showOnlyTrashed={true} />}/> */}
          {/* <Route path={"new"} element={<CreateNewTemplatePage />} />
        <Route path={"to-approve"} element={<ApproveTemplatesPage />} />
        <Route path={"rejected"} element={<RejectedTemplatesPage />} /> */}
        </Route>
        <Route path={'workflows'}>
          <Route index element={<WorkflowsPage home={true} />} />
          <Route path={'set-workflow'} element={<SetWorkflowInDoc />} />
          <Route path={'new-set-workflow'} element={<SetWorkflowInDocNew />} />
          <Route
            path={'saved'}
            element={<WorkflowsPage showOnlySaved={true} />}
          />
          {/* <Route path={"trash"} element={<WorkflowsPage showOnlyTrashed={true} />}/> */}
          {/*  <Route path={"new"} element={<CreateNewWorkflowPage />} />
        <Route path={"to-approve"} element={<ApproveWorkflowPage />} />
        <Route path={"rejected"} element={<RejectedWorkflowsPage />} /> */}
        </Route>
        <Route path={'processes'}>
          <Route index element={<ProccessPage home={true} />} />
          <Route
            path={'saved'}
            element={<ProccessPage showOnlySaved={true} />}
          />
          <Route
            path={'paused'}
            element={<ProccessPage showOnlyPaused={true} />}
          />
          <Route
            path={'cancelled'}
            element={<ProccessPage showOnlyCancelled={true} />}
          />
          <Route
            path={'tests'}
            element={<ProccessPage showOnlyTests={true} />}
          />
          <Route
            path={'completed'}
            element={<ProccessPage showOnlyCompleted={true} />}
          />
          {/* <Route path={"trash"} element={<ProccessPage showOnlyTrashed={true} />}/> */}
        </Route>

        <Route path={'/notifications'} element={<NotificationsPage />} />
        {/* <Route path="/Documents/Documents/Documents" element={<Documents />} />
      <Route path="/Documents/DraftsDoc/DraftsDoc" element={<DraftsDoc />} />
      <Route path="/Templates/TempDraft/TempDraft" element={<TempDraft />} /> */}
        {/* <Route
        path="/Templates/NewTemplate/NewTemplate"
        element={<NewTemplate />}
      />
      <Route
        path="/WorkFlows/NewWorkFlow/NewWorkFlow"
        element={<NewWorkFlow />}
      />
      <Route path="/WorkFlows/DraftF/DraftF" element={<DraftF />} /> */}
        <Route path={'/verify/:token'} element={<VerificationPage />} />
        <Route path={'/search'} element={<SearchPage />} />
        <Route path={'*'} element={<>Page not found</>} />
      </Routes>
    </Suspense>
  );
}

export default App;
