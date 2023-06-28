import React from 'react';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import FoldersCard from '../../components/hoverCard/foldersCard/FoldersCard';
import { useAppContext } from '../../contexts/AppContext';
import { useSelector } from 'react-redux';

const FoldersPage = () => {
  const { allDocumentsStatus } = useSelector((state) => state.document);
  const { allTemplatesStatus } = useSelector((state) => state.template);

  const { folders, isFetchingFolders } = useAppContext();
  return (
    <WorkflowLayout>
      <section id='folders_sect'>
        <ManageFiles title={'Folders'} removePageSuffix={true}>
          <div className='folders_wrapper'>
            <SectionBox
              cardBgColor='#1ABC9C'
              title={'My Folders'}
              Card={FoldersCard}
              cardItems={folders}
              status={
                allDocumentsStatus === 'pending' ||
                allTemplatesStatus === 'pending' ||
                isFetchingFolders
                  ? 'pending'
                  : 'finished'
              }
              itemType={'folders'}
            />
          </div>
        </ManageFiles>
      </section>
    </WorkflowLayout>
  );
};

export default FoldersPage;
