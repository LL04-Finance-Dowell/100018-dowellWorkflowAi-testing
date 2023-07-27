import { useEffect, useState } from 'react';
import CreateDocument from '../../../components/manageFiles/files/documents/createDocument/CreateDocument';

import SectionBox from '../../../components/manageFiles/sectionBox/SectionBox';
import { v4 as uuidv4 } from 'uuid';
import WorkflowLayout from '../../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../../components/manageFiles/ManageFiles';
import { useDispatch, useSelector } from 'react-redux';
import {
  allDocuments,
  savedDocuments,
} from '../../../features/document/asyncThunks';
import DocumentCard from '../../../components/hoverCard/documentCard/DocumentCard';
import { useNavigate } from 'react-router-dom';
import { productName } from '../../../utils/helpers';
import { useAppContext } from '../../../contexts/AppContext';
import { DocumentServices } from '../../../services/documentServices';
import { useLocation } from 'react-router-dom';

const DocumentsPage = ({ home, showOnlySaved, showOnlyCompleted, isDemo }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const { allDocuments: allDocumentsArray, allDocumentsStatus } = useSelector(
    (state) => state.document
  );

  // const finilized = allDocumentsArray.filter((document) => document.document_state === "finalized")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUserPortfolioDataType, setCurrentUserPortfolioDataType] =
    useState('');
  const {
    customDocName,
    demoDocuments,
    demoDocStatus,
    fetchDemoDocuments,
    fetchDocumentReports,
    docReports,
    docReportsStatus,
    savedDocuments,
    savedDocumentsStatus,
    fetchSavedDocuments,
  } = useAppContext();

  useEffect(() => {
    if (isDemo) {
      if (!demoDocuments) {
        fetchDemoDocuments();
      }
    }
  }, []);

  useEffect(() => {
    if (location.hash === '#completed-documents' && !docReports)
      fetchDocumentReports();
  }, [location]);

  useEffect(() => {
    const userPortfolioDataType =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.data_type
        : userDetail?.portfolio_info[0]?.data_type;

    const data = {
      company_id:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
          : userDetail?.portfolio_info[0].org_id,
      data_type: userPortfolioDataType,
    };
    /*     if (savedDocumentsStatus !== "succeeded")
      dispatch(savedDocuments(draftData));
    if (mineStatus !== "succeeded") dispatch(mineDocuments(data)); */

    if (allDocumentsStatus === 'idle') dispatch(allDocuments(data));
    setCurrentUserPortfolioDataType(userPortfolioDataType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail]);

  useEffect(() => {
    if (showOnlySaved) {
      navigate('#saved-documents');
      if (!savedDocuments) fetchSavedDocuments();
    }
    if (showOnlyCompleted) navigate('#completed-documents');
    if (home) navigate('#drafts');
    // if(isDemo) navigate("#demo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnlySaved, showOnlyCompleted, home]);

  // useEffect(() => {
  //   console.log('all Docs: ', allDocumentsArray);
  // });

  // useEffect(() => {
  //   console.log('all Docs: ', allDocumentsArray);
  //   console.log(
  //     'all Docs filter: ',
  //     allDocumentsArray.filter(
  //       (item) =>
  //         item.created_by === userDetail?.userinfo?.username &&
  //         item.document_type === 'original'
  //     )
  //   );
  // }, [allDocumentsArray]);

  // useEffect(() => {
  //   console.log('Saved Docs: ', savedDocuments);
  // }, [savedDocuments]);

  return (
    <WorkflowLayout>
      <div id='new-document'>
        <ManageFiles
          title={customDocName ? customDocName : 'Documents'}
          OverlayComp={CreateDocument}
          removePageSuffix={true}
        >
          {home ? (
            <div id='drafts'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title={customDocName ? `My ${customDocName}` : 'My Documents'}
                Card={DocumentCard}
                cardItems={
                  allDocumentsArray &&
                  allDocumentsArray.length &&
                  allDocumentsArray.filter(
                    (item) =>
                      item.created_by === userDetail?.userinfo?.username &&
                      item.document_type === 'original'
                  )
                }
                status={allDocumentsStatus}
                itemType={'documents'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlySaved ? (
            <div id='saved-documents'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='saved documents'
                Card={DocumentCard}
                cardItems={savedDocuments}
                status={savedDocumentsStatus}
                itemType={'documents'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyCompleted ? (
            <div id='completed-documents'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='completed documents'
                Card={DocumentCard}
                cardItems={docReports}
                status={docReportsStatus}
                itemType={'documents'}
                isReports={true}
              />
            </div>
          ) : (
            <></>
          )}

          {isDemo && (
            <div id='demo-documents'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='demo documents'
                Card={DocumentCard}
                cardItems={demoDocuments}
                status={demoDocStatus}
                itemType={'documents'}
                isDemo={true}
              />
            </div>
          )}
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
