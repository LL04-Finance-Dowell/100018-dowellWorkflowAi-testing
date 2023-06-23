import React, { useEffect, useState } from 'react';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import DocumentCard from '../../components/hoverCard/documentCard/DocumentCard';
import TemplateCard from '../../components/hoverCard/templateCard/TemplateCard';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import { useSelector } from 'react-redux';

// TODO HANDLE WHEN THE ID CAN'T BE FOUND IN FOLDERS
// TODO HANDLE WHAT HAPPENS IF USER DELETES ALL CONTENTS IN A FOLDER

const FolderPage = () => {
  const { folder_id } = useParams();
  const { folders } = useAppContext();
  const [folder] = useState(folders.find((folder) => folder._id === folder_id));
  const { allDocuments } = useSelector((state) => state.document);
  const { allTemplates } = useSelector((state) => state.template);

  const [docItems, setDocItems] = useState([]);
  const [tempItems, setTempItems] = useState([]);

  useEffect(() => {
    setDocItems(
      folder.data
        .map((item) => (item.item_type === 'document' ? item : null))
        .filter((item) => item)
        .map((item) => ({
          ...item,
          document_name: allDocuments.find(
            (doc) => doc._id === item.item_id || doc._id === item['item_id:']
          ).document_name,
        }))
    );

    setTempItems(
      folder.data
        .map((item) => (item.item_type === 'template' ? item : null))
        .filter((item) => item)
        .map((item) => ({
          ...item,
          template_name: allTemplates.find(
            (temp) => temp._id === item.item_id || temp._id === item['item_id:']
          ).template_name,
        }))
    );
  }, [folder]);

  // console.log('folderId: ', folder_id);
  // console.log('folder: ', folder);
  // useEffect(() => {
  //   console.log('docIt: ', docItems);
  //   console.log('tempIt: ', tempItems);
  // }, [docItems, tempItems]);
  // console.log(allDocuments);

  return (
    <WorkflowLayout>
      <section id='folder_sect'>
        <ManageFiles title={folder.folder_name} removePageSuffix={true}>
          <div className='folder_wrapper'>
            <SectionBox
              cardBgColor='#1ABC9C'
              itemType={'folder'}
              title={`${folder.folder_name} - Documents`}
              Card={DocumentCard}
              cardItems={docItems}
            />
          </div>

          <div className='folder_wrapper'>
            <SectionBox
              cardBgColor='#1ABC9C'
              itemType={'folder'}
              title={`${folder.folder_name} - Templates`}
              Card={TemplateCard}
              cardItems={tempItems}
              status={'finished'} //! Status is to be dynamic
            />
          </div>
        </ManageFiles>
      </section>
    </WorkflowLayout>
  );
};

export default FolderPage;
