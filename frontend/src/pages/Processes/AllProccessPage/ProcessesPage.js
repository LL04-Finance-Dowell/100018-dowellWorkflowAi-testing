import SectionBox from '../../../components/manageFiles/sectionBox/SectionBox';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import WorkflowLayout from '../../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../../components/manageFiles/ManageFiles';
import ProcessDetail from '../../../components/manageFiles/ProcessDetail/ProcessDetail';
import { useDispatch, useSelector } from 'react-redux';
import ProcessCard from '../../../components/hoverCard/processCard/ProcessCard';
import { ProcessDetailModail } from '../../../components/newSidebar/manageFile/ProcessDetailModal/ProcessDetailModail';
import GeneratedLinksModal from '../../../components/setWorkFlowInDocNew/steps/processDocument/components/GeneratedLinksModal/GeneratedLinksModal';
import { useEffect } from 'react';
import { getAllProcessesV2 } from '../../../services/processServices';

import { useNavigate } from 'react-router-dom';
import { productName } from '../../../utils/helpers';
import { useAppContext } from '../../../contexts/AppContext';
import EvaluationReportComponent from '../../../components/manageFiles/ProcessDetail/StepDetail';

//import create proccess page to choose between template approval and doc approval
import CreateProcess from '../../../components/manageFiles/files/createProcess/createProcess';
import DocumentDetailReport from '../../../components/manageFiles/ProcessDetail/DocumentDetailReport';
import ScaleDetailReport from '../../../components/manageFiles/ProcessDetail/ScaleDetailReport';
import { setAllProcesses, setProcessesLoaded, setProcessesLoading } from '../../../features/processes/processesSlice';

const ProcessesPage = ({
  home,
  showSingleProcess,
  showOnlySaved,
  showOnlyPaused,
  showOnlyCancelled,
  showOnlyTrashed,
  showOnlyTests,
  showOnlyCompleted,
  showOnlyActive,
  chooseProcess,
  showEvaluationReport,
  showDocumentReport,
  showScaleReport
}) => {
  const {
    ArrayofLinks,
    showGeneratedLinksPopup,
    linksFetched,
    DetailFetched
  } = useSelector((state) => state.app);
  const {
    processesLoading,
    allProcesses,
    processesLoaded,
    showsProcessDetailPopup,
  } = useSelector((state) => state.processes);
  const { userDetail } = useSelector((state) => state.auth);


  const [completedProcess, SetcompletedPcocess] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUserPortfolioDataType, setCurrentUserPortfolioDataType] =
    useState('');
  const {
    activeProcesses,
    activeProcessesStatus,
    completedProcesses,
    completedProcessesStatus,
    fetchProcessReports,
  } = useAppContext();

  // console.log("userdetail", userDetail)

  useEffect(() => {
    if (showOnlySaved) navigate('#saved-processes');
    if (showSingleProcess) navigate('#processdetail');
    if (showEvaluationReport) navigate('#evaluation-report');
    if (showDocumentReport) navigate('#document-report');
    if (showScaleReport) navigate('#scale-report');
    if (showOnlyPaused) navigate('#paused-processes');
    if (showOnlyCancelled) navigate('#cancelled-processes');
    if (showOnlyTrashed) navigate('#thrashed-processes');
    if (showOnlyTests) navigate('#test-processes');
    if (home) navigate('#drafts');
    if (showOnlyCompleted) {
      if (!completedProcesses) fetchProcessReports('completed');
      navigate('#completed-processes');
    }
    if (showOnlyActive && !activeProcesses) fetchProcessReports('active');
  }, [
    showOnlySaved,
    showSingleProcess,
    showOnlyPaused,
    showOnlyCancelled,
    showOnlyTrashed,
    home,
    showOnlyTests,
    showOnlyCompleted,
    showOnlyActive,
    showEvaluationReport,
    showDocumentReport,
    showScaleReport,
  ]);

  useEffect(() => {
    if (processesLoaded) return;

    if (
      !userDetail ||
      !userDetail.portfolio_info ||
      userDetail.portfolio_info.length < 1
    ) {
      return;
    }

    const [userCompanyId, userPortfolioDataType] = [
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
          (portfolio) => portfolio.product === productName
        )?.org_id
        : userDetail?.portfolio_info[0]?.org_id,
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
          (portfolio) => portfolio.product === productName
        )?.data_type
        : userDetail?.portfolio_info[0]?.data_type,
    ];

    getAllProcessesV2(userCompanyId, userPortfolioDataType)
      .then((res) => {
        const savedProcessesInLocalStorage = JSON.parse(
          localStorage.getItem('user-saved-processes')
        );
        if (savedProcessesInLocalStorage) {
          const processes = [
            ...savedProcessesInLocalStorage,
            ...res.data.filter((process) => process.processing_state),
          ].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
          dispatch(setAllProcesses(processes));
        } else {
          dispatch(
            setAllProcesses(
              res.data.filter((process) => process.processing_state).reverse()
            )
          );
        }
        dispatch(setProcessesLoading(false));
        dispatch(setProcessesLoaded(true));
      })
      .catch((err) => {
        // console.log('Failed: ', err.response);
        dispatch(setProcessesLoading(false));
      });
  }, [processesLoaded, userDetail]);

  useEffect(() => {
    const userPortfolioDataType =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
          (portfolio) => portfolio.product === productName
        )?.data_type
        : userDetail?.portfolio_info[0].data_type;

    setCurrentUserPortfolioDataType(userPortfolioDataType);
  }, [userDetail]);

  return (
    <WorkflowLayout>
      <div id='new-process'>
        <ManageFiles title='' removePageSuffix={true}>
          {home ? (
            <div id='drafts'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='drafts'
                Card={ProcessCard}
                cardItems={allProcesses
                  .filter((process) => process.processing_state === 'draft' || process.processing_action === "imports")
                  .filter(
                    (process) =>
                      process.data_type === currentUserPortfolioDataType
                  )
                  .filter(
                    (process) =>
                      process.created_by === userDetail?.userinfo?.username
                  )
                  .filter((process) => process.workflow_construct_ids)}
                status={processesLoading ? 'pending' : 'success'}
                itemType={'processes'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlySaved ? (
            <div id='saved-processes'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='saved process'
                Card={ProcessCard}
                cardItems={allProcesses
                  .filter(
                    (process) => process.processing_state === 'processing' || process.processing_state === 'draft'
                  )
                  .filter(
                    (process) =>
                      process.data_type === currentUserPortfolioDataType
                  )}
                status={processesLoading ? 'pending' : 'success'}
                itemType={'processes'}
              />
            </div>
          ) : (
            <></>
          )}

          {showGeneratedLinksPopup &&
            linksFetched &&
            Array.isArray(ArrayofLinks) && <GeneratedLinksModal />}

          {showsProcessDetailPopup && DetailFetched && <ProcessDetailModail />}

          {showSingleProcess ? (
            <div id='processdetail'>
              <ProcessDetail />
            </div>
          ) : (
            <></>
          )}

          {showDocumentReport ? (
            <div id='document'>
              <DocumentDetailReport />
            </div>
          ) : (
            <></>
          )}
          {showScaleReport ? (
            <div id='scale'>
              <ScaleDetailReport />
            </div>
          ) : (
            <></>
          )}
          {showEvaluationReport ? (
            <div id='evaluation'>
              <EvaluationReportComponent />
            </div>
          ) : (
            <></>
          )}

          {showOnlyPaused ? (
            <div id='paused-processes'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='paused process'
                Card={ProcessCard}
                cardItems={allProcesses
                  .filter((process) => process.processing_state === 'paused')
                  .filter(
                    (process) =>
                      process.data_type === currentUserPortfolioDataType
                  )}
                status={processesLoading ? 'pending' : 'success'}
                itemType={'processes'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyCancelled ? (
            <div id='cancelled-processes'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='cancelled process'
                Card={ProcessCard}
                cardItems={allProcesses
                  .filter((process) => process.processing_state === 'cancelled')
                  .filter(
                    (process) =>
                      process.data_type === currentUserPortfolioDataType
                  )}
                status={processesLoading ? 'pending' : 'success'}
                itemType={'processes'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyTrashed ? (
            <div id='trashed-processes'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='trashed process'
                Card={ProcessCard}
                cardItems={allProcesses.filter(
                  (process) => process.processing_state === 'trash'
                )}
                status={processesLoading ? 'pending' : 'success'}
                itemType={'processes'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyTests ? (
            <div id='test-processes'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='test process'
                Card={ProcessCard}
                cardItems={allProcesses
                  .filter((process) => process.processing_state === 'test')
                  .filter(
                    (process) =>
                      process.data_type === currentUserPortfolioDataType
                  )}
                status={processesLoading ? 'pending' : 'success'}
                itemType={'processes'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyCompleted ? (
            <div id='completed-processes'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='completed process'
                Card={ProcessCard}
                cardItems={completedProcesses}
                status={completedProcessesStatus}
                itemType={'processes'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyActive && (
            <div id='active-processes'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='active process'
                Card={ProcessCard}
                cardItems={activeProcesses}
                status={activeProcessesStatus}
                itemType={'processes'}
              />
            </div>
          )}

          {chooseProcess ? <CreateProcess /> : <></>}
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default ProcessesPage;

export const createDocumentsByMe = [{ id: uuidv4() }];
export const drafts = [{ id: uuidv4() }];
