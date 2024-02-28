import ManageFiles from '../../../components/manageFiles/ManageFiles';
import SectionBox from '../../../components/manageFiles/sectionBox/SectionBox';
import WorkflowLayout from '../../../layouts/WorkflowLayout/WorkflowLayout';
import './style.css';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { allTemplates } from '../../../features/template/asyncThunks';
import TemplateCard from '../../../components/hoverCard/templateCard/TemplateCard';
import { useNavigate } from 'react-router-dom';
import { productName } from '../../../utils/helpers';
import { useAppContext } from '../../../contexts/AppContext';
import { TemplateServices } from '../../../services/templateServices';

const TemplatesPage = ({
  home,
  showOnlySaved,
  showOnlyTrashed,
  isDemo,
  isReports,
}) => {
  const { userDetail } = useSelector((state) => state.auth);
  const {
    customTempName,
    demoTemplates,
    demoTempStatus,
    fetchDemoTemplates,
    tempReports,
    tempReportsStatus,
    fetchTemplateReports,
  } = useAppContext();

  const { allTemplates: allTemplatesArray, allTemplatesStatus } = useSelector(
    (state) => state.template
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUserPortfolioDataType, setCurrentUserPortfolioDataType] =
    useState('');

  useEffect(() => {
    if (isDemo) {
      if (!demoTemplates) {
        fetchDemoTemplates();
      }
    }
  }, []);

  useEffect(() => {
    if (isReports && !tempReports) fetchTemplateReports();
  }, []);

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

    /*  if (mineStatus === "idle") dispatch(mineTemplates(mineData));
    if (savedTemplatesItemsStatus === "idle")
      dispatch(savedTemplates(savedTemplatesData)); */

    if (allTemplatesStatus === 'idle') dispatch(allTemplates(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail]);

  useEffect(() => {

  }, [allTemplatesArray])

  var reverseArray = [...allTemplatesArray].reverse()
  useEffect(() => {
    if (showOnlySaved) navigate('#saved-templates');
    if (showOnlyTrashed) navigate('#trashed-templates');
    if (home) navigate('#drafts');
    // if (isDemo) navigate('#demo');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnlySaved, showOnlyTrashed, home]);

  useEffect(() => {
    const userPortfolioDataType =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
          (portfolio) => portfolio.product === productName
        )?.data_type
        : userDetail?.portfolio_info[0]?.data_type;

    setCurrentUserPortfolioDataType(userPortfolioDataType);
  }, [userDetail]);

  return (
    <WorkflowLayout>
      <div id='new-template'>
        <ManageFiles
          title={customTempName ? customTempName : 'Templates'}
          removePageSuffix={true}
        >
          {home ? (
            <div id='drafts'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title={customTempName ? `My ${customTempName}` : 'My Templates'}
                Card={TemplateCard}
                cardItems={
                  reverseArray &&
                  reverseArray.length &&
                  reverseArray
                    .filter(
                      (item) =>
                        item.created_by === userDetail?.userinfo?.username
                    )
                    .filter(
                      (item) => item.data_type === currentUserPortfolioDataType
                    )
                }
                status={allTemplatesStatus}
                itemType={'templates'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlySaved ? (
            <div id='saved-templates'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='saved templates'
                Card={TemplateCard}
                cardItems={reverseArray.filter(
                  (item) => item.data_type === currentUserPortfolioDataType
                )}
                status={allTemplatesStatus}
                itemType={'templates'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyTrashed ? (
            <div id='trashed-templates'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='trashed templates'
                Card={TemplateCard}
                cardItems={[]}
                status={allTemplatesStatus}
                itemType={'templates'}
              />
            </div>
          ) : (
            <></>
          )}
          {isDemo && demoTemplates && (
            <div id='demo-templates'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='demo templates'
                Card={TemplateCard}
                cardItems={[...demoTemplates]?.reverse()}
                status={demoTempStatus}
                itemType={'templates'}
                isDemo={true}
              />
            </div>
          )}
          {isReports && (
            <div id='demo-templates'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='template reports'
                Card={TemplateCard}
                cardItems={tempReports}
                status={tempReportsStatus}
                itemType={'templates'}
                isReports={true}
              />
            </div>
          )}
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default TemplatesPage;

export const createTemplatesByMe = [{ id: uuidv4() }];

export const drafts = [{ id: uuidv4() }];
