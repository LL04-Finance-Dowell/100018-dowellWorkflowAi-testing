import React from 'react';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import FoldersCard from '../../components/hoverCard/foldersCard/FoldersCard';
import { useAppContext } from '../../contexts/AppContext';

const FoldersPage = () => {
  const { folders } = useAppContext();
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
              status={'finished'} //! Status is to be dynamic
              itemType={'folders'}
            />
          </div>
        </ManageFiles>
      </section>
    </WorkflowLayout>
  );
};

export default FoldersPage;
