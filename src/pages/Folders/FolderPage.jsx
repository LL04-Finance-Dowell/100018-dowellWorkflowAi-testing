import React, { useEffect, useState } from 'react';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import DocumentCard from '../../components/hoverCard/documentCard/DocumentCard';
import TemplateCard from '../../components/hoverCard/templateCard/TemplateCard';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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
  const navigate = useNavigate();

  useEffect(() => {
    if (folder) {
      let modDocItems = [];
      let modTempitems = [];
      folder.data.forEach((item) => {
        modDocItems.push(
          allDocuments.find((doc) => doc._id === item.document_id) ?? null
        );
        modTempitems.push(
          allTemplates.find((temp) => temp._id === item.template_id) ?? null
        );
      });

      setDocItems(modDocItems.filter((item) => item));
      setTempItems(modTempitems.filter((item) => item));
    } else {
      toast.error('Invalid route!');
      navigate('/folders');
    }
  }, [folder]);

  return (
    folder && (
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
    )
  );
};

export default FolderPage;
