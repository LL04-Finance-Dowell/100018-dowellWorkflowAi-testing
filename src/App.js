import { useEffect, Suspense, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { setIconColor } from './features/app/appSlice';
import { auth_url } from './httpCommon/httpCommon';
import { useDispatch, useSelector } from 'react-redux';
import useDowellLogin from './hooks/useDowellLogin';
import WorkflowApp from './pages/App/WorkflowApp';

import './App.css';
import DocumentsPage from './pages/Documents/AllDocumentsPage/DocumentsPage';

import NotificationsPage from './pages/Notifications/NotificationsPage';

import TemplatesPage from './pages/Templates/AllTemplatesPage/TemplatesPage';
import WorkflowsPage from './pages/Workflows/AllWorkflowsPage/WorkflowsPage';

import FoldersPage from './pages/Folders/FoldersPage';
import FolderPage from './pages/Folders/FolderPage';
import ProcessDetail from './components/manageFiles/ProcessDetail/ProcessDetail';
import SetWorkflowInDoc from './components/setWorkFlowInDoc/SetWorkflowInDoc';
import SetWorkflowInDocNew from './components/setWorkFlowInDocNew/SetWorkflowInDoc';
import { setcreditResponse } from './features/app/appSlice'
import WorkflowAiSettings from './components/workflowAiSettings/WorkflowAiSettings';
import VerificationPage from './pages/Verification/VerificationPage';
import ProccessPage from './pages/Processes/AllProccessPage/ProcessesPage';
import SearchPage from './pages/Search/SearchPage';
import { productName } from './utils/helpers';
import { useAppContext } from './contexts/AppContext';

import axios from 'axios';
// import ConstructionPage from './pages/ConstructionPage/ConstructionPage';

function App() {
  const dispatch = useDispatch();
  const { session_id, userDetail, id } = useSelector((state) => state.auth);
  const { IconColor, ShowProfileSpinner, themeColor, creditResponse } = useSelector(
    (state) => state.app
  );
  const company_id = userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id
  console.log(company_id)
  const { isPublicUser, dataType } = useAppContext();
  const clientVerUrlRef = useRef('https://ll04-finance-dowell.github.io/workflowai.online/')
  const betaVerUrlRef = useRef('https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/')
  
  
  useDowellLogin();
  
  useEffect(() => {
    const interval = setInterval(() => {
      checkstatus();
    }, 300000); // 5 mints

    return () => clearInterval(interval);
  }, []);
  
  // // ! Comment the below useEffect to prevent redirection
  useEffect(() => {
    //   if (!session_id) return
    
    //   if (window.location.pathname.includes('-testing')) {
      //     if (dataType === 'Real_Data') window.location.replace(
        //       id ?
        //       `${clientVerUrlRef.current}#?session_id=${session_id}&id=${id}` :
        //       `${clientVerUrlRef.current}#?session_id=${session_id}`
        //       );
        //   } else {
          //     if (dataType !== 'Real_Data') window.location.replace(
            //       id ?
            //       `${betaVerUrlRef.current}#?session_id=${session_id}&id=${id}` :
            //       `${betaVerUrlRef.current}#?session_id=${session_id}`
            //     )
            //   }
    axios
    .get(`https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${company_id}`)
    .then((response) => {
      dispatch(setcreditResponse(response?.data?.data?.is_active))
      console.log(response?.data?.data?.is_active)
      dispatch(setcreditResponse(response?.data?.data?.total_credits))
      console.log(response?.data?.data?.total_credits)
      dispatch(setcreditResponse(response?.data?.data?.api_key))
      console.log(response?.data?.data?.api_key)

      // dispatch(setcreditResponse(response))
    })
    .catch((error) => {

      console.log(error)
    });



  }, [dataType])
  // console.log('chk')

  function checkstatus() {
    // AJAX GET request

    axios
      .get(`${auth_url}live_users`)
      .then((response) => {
        dispatch(setIconColor('green'));
      })
      .catch((error) => {
        // console.log(error);
        dispatch(setIconColor('red'));
      });

    // AJAX POST request

    session_id &&
      axios
        .post(
          'https://100014.pythonanywhere.com/en/live_status',
          {
            session_id: session_id && session_id,
            product: 'Workflow AI',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => { })
        .catch((error) => {
          // console.log(error);
          // Empty catch block
        });
  }
  // console.log(creditResponse.data.is_active)
  // console.log(creditResponse.data.service_id)

  // USE ONLY WHEN APP IS BROKEN OR UNDERGOING MAJOR CHANGES
  // return (
  //   <Routes>
  //     <Route path='*' element={<ConstructionPage />} />
  //   </Routes>
  // );

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
          <Route
            path={'completed'}
            element={<DocumentsPage showOnlyCompleted={true} />}
          />
          <Route
            path={'rejected'}
            element={<DocumentsPage isRejected={true} />}
          />
          <Route path={'demo'} element={<DocumentsPage isDemo={true} />} />
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
          <Route path={'demo'} element={<TemplatesPage isDemo={true} />} />
          <Route
            path={'reports'}
            element={<TemplatesPage isReports={true} />}
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

          <Route
            path={'active'}
            element={<ProccessPage showOnlyActive={true} />}
          />
          <Route
            path={'processdetail'}
            element={<ProccessPage showSingleProcess={true} />}
          />

          {/* <Route path={"trash"} element={<ProccessPage showOnlyTrashed={true} />}/> */}
        </Route>
        <Route path={'/notifications'} element={<NotificationsPage />} />

        <Route path={'/folders'}>
          <Route index element={<FoldersPage />} />
          <Route path={':folder_id'} element={<FolderPage />} />
        </Route>
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
