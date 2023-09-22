import ManageFiles from '../../../components/manageFiles/ManageFiles';
import SectionBox from '../../../components/manageFiles/sectionBox/SectionBox';
import WorkflowLayout from '../../../layouts/WorkflowLayout/WorkflowLayout';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import CreateWorkflows from '../../../components/manageFiles/files/workflows/createWorkflows/CreateWorkflow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allWorkflows } from '../../../features/workflow/asyncTHunks';
import WorkflowCard from '../../../components/hoverCard/workflowCard/WorkflowCard';
import { useNavigate } from 'react-router-dom';
import { productName } from '../../../utils/helpers';
import { useAppContext } from '../../../contexts/AppContext';

const WorkflowsPage = ({ home, showOnlySaved, showOnlyTrashed }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const { allWorkflows: allWorkflowsArray, allWorkflowsStatus } = useSelector(
    (state) => state.workflow
  );

  const { customWrkfName } = useAppContext();

  const [currentUserPortfolioDataType, setCurrentUserPortfolioDataType] =
    useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const data = {
      company_id:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
          : userDetail?.portfolio_info[0].org_id,
      data_type:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.data_type
          : userDetail?.portfolio_info[0].data_type,
    };

    /*   if (savedWorkflowStatus === "idle") dispatch(savedWorkflows(saveddata));
		if (mineStatus === "idle") dispatch(mineWorkflows(data)); */

    if (allWorkflowsStatus === 'idle') dispatch(allWorkflows(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail]);

  useEffect(() => {
    if (showOnlySaved) navigate('#saved-workflows');
    if (showOnlyTrashed) navigate('#trashed-workflows');
    if (home) navigate('#drafts');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnlySaved, showOnlyTrashed, home]);

  useEffect(() => {
    const portfolioDataType =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.data_type
        : userDetail?.portfolio_info[0]?.data_type;
    setCurrentUserPortfolioDataType(portfolioDataType);
  }, [userDetail]);

  return (
    <WorkflowLayout>
      <div id='new-workflow'>
        <ManageFiles
          title={customWrkfName ? customWrkfName : 'Workflows'}
          OverlayComp={CreateWorkflows}
          removePageSuffix={true}
        >
          {home ? (
            <div id='drafts'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title={customWrkfName ? `My ${customWrkfName}` : 'My Workflows'}
                cardItems={
                  allWorkflowsArray &&
                  allWorkflowsArray.length &&
                  allWorkflowsArray
                    .filter(
                      (item) =>
                        item.created_by === userDetail?.userinfo?.username
                    )
                    .filter(
                      (item) =>
                        item.workflows &&
                        (item?.data_type === currentUserPortfolioDataType ||
                          item.workflows?.data_type ===
                            currentUserPortfolioDataType)
                    )
                    .reverse()
                }
                status={allWorkflowsStatus}
                Card={WorkflowCard}
                itemType={'workflows'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlySaved ? (
            <div id='saved-workflows'>
              <SectionBox
                Card={WorkflowCard}
                cardBgColor='#1ABC9C'
                title='saved workflows'
                status={allWorkflowsStatus}
                cardItems={allWorkflowsArray.filter(
                  (item) =>
                    item.workflows &&
                    (item?.data_type === currentUserPortfolioDataType ||
                      item.workflows?.data_type ===
                        currentUserPortfolioDataType)
                ).reverse()}
                itemType={'workflows'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyTrashed ? (
            <div id='trashed-workflows'>
              <SectionBox
                Card={WorkflowCard}
                cardBgColor='#1ABC9C'
                title='trashed workflows'
                status={allWorkflowsStatus}
                cardItems={[]}
                itemType={'workflows'}
              />
            </div>
          ) : (
            <></>
          )}
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default WorkflowsPage;

export const createWorkflowsByMe = [
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
];

export const drafts = [{ id: uuidv4() }];
