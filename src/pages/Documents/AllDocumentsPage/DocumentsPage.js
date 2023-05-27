import { useEffect } from 'react';
import CreateDocument from '../../../components/manageFiles/files/documents/createDocument/CreateDocument';

import SectionBox from '../../../components/manageFiles/sectionBox/SectionBox';
import { v4 as uuidv4 } from 'uuid';
import WorkflowLayout from '../../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../../components/manageFiles/ManageFiles';
import { useDispatch, useSelector } from 'react-redux';
import { allDocuments } from '../../../features/document/asyncThunks';
import DocumentCard from '../../../components/hoverCard/documentCard/DocumentCard';
import { useNavigate } from 'react-router-dom';

const DocumentsPage = ({ home, showOnlySaved, showOnlyTrashed }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const { allDocuments: allDocumentsArray, allDocumentsStatus } = useSelector(
    (state) => state.document
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
      data_type: userDetail?.portfolio_info[0].data_type,
    };
    /*     if (savedDocumentsStatus !== "succeeded")
      dispatch(savedDocuments(draftData));
    if (mineStatus !== "succeeded") dispatch(mineDocuments(data)); */

    if (allDocumentsStatus === 'idle') dispatch(allDocuments(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail]);

  useEffect(() => {
    if (showOnlySaved) navigate('#saved-documents');
    if (showOnlyTrashed) navigate('#trashed-documents');
    if (home) navigate('#drafts');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnlySaved, showOnlyTrashed, home]);

  return (
    <WorkflowLayout>
      <div id='new-document'>
        <ManageFiles
          title='Documents'
          OverlayComp={CreateDocument}
          removePageSuffix={true}
        >
          {home ? (
            <div id='drafts'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='My Documents'
                Card={DocumentCard}
                cardItems={
                  allDocumentsArray &&
                  allDocumentsArray.length &&
                  allDocumentsArray
                    .filter(
                      (item) =>
                        item.created_by ===
                          userDetail?.portfolio_info[0].username &&
                        item.document_type === 'original'
                    )
                    .filter(
                      (item) =>
                        item.data_type ===
                        userDetail?.portfolio_info[0]?.data_type
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
                cardItems={allDocumentsArray
                  .filter((document) => document.document_type === 'original')
                  .filter(
                    (item) =>
                      item.data_type ===
                      userDetail?.portfolio_info[0]?.data_type
                  )}
                status={allDocumentsStatus}
                itemType={'documents'}
              />
            </div>
          ) : (
            <></>
          )}
          {showOnlyTrashed ? (
            <div id='trashed-documents'>
              <SectionBox
                cardBgColor='#1ABC9C'
                title='trashed documents'
                Card={DocumentCard}
                cardItems={[]}
                status={allDocumentsStatus}
                itemType={'documents'}
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
