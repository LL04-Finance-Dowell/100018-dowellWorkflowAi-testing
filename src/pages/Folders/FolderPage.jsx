import React, { useEffect, useState } from 'react';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import DocumentCard from '../../components/hoverCard/documentCard/DocumentCard';
import TemplateCard from '../../components/hoverCard/templateCard/TemplateCard';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import { useSelector } from 'react-redux';

// TODO HANDLE WHEN THE ID CAN'T BE FOUND IN FOLDERS
// TODO HANDLE WHAT HAPPENS IF USER DELETES ALL CONTENTS IN A FOLDER

const FolderPage = ({ knowledgeCenter }) => {
  const { folder_id } = useParams();
  const { folders } = useAppContext();
  const [folder, setFolder] = useState(
    folders.find((folder) => folder._id === folder_id)
  )
  const { KnowledgeFolders } = useSelector((state) => state.app);

  const [knowFolder, setKnowFolder] = useState(
    KnowledgeFolders?.templates?.find((folder) => folder._id === folder_id)
  );
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

    } else if (knowledgeCenter) {

      let modDocItems = [];
      let modTempitems = [];

      modTempitems.push(knowFolder.data)
      knowFolder.data.forEach((item) => {
        // modDocItems.push(
        //   allDocuments.find((doc) => doc._id === item.document_id) ?? null
        // );

        modTempitems.push(
          knowFolder.data.find((temp) => temp._id === item.template_id) ?? null
        );
      });

      // setDocItems(modDocItems.filter((item) => item));
      setTempItems(modTempitems.filter((item) => item));
    }
    else {
      // console.error('Invalid route!');
      navigate('/folders');
    }
  }, [folder]);

  useEffect(() => {
    setFolder(folders.find((folder) => folder._id === folder_id));
  }, [folders]);

  console.log("knowledgeFolder",tempItems , knowFolder, folder_id)

  return (
    <>
      {knowFolder ?
         (
          <WorkflowLayout>
            <section id='folder_sect'>
              <ManageFiles title={knowFolder.folder_name} removePageSuffix={true}>
                {/* <div className='folder_wrapper'>
                  <SectionBox
                    cardBgColor='#1ABC9C'
                    itemType={'folder'}
                    title={`${knowFolder.templates[0].folder_name} - Documents`}
                    Card={DocumentCard}
                    cardItems={docItems}
                    folderId={knowFolder.templates[0]._id}
                  />
                </div> */}

                <div className='folder_wrapper'>
                  <SectionBox
                    cardBgColor='#1ABC9C'
                    itemType={'folder'}
                    title={`${knowFolder?.folder_name} - Templates`}
                    Card={TemplateCard}
                    cardItems={knowFolder?.data}
                    status={'finished'}
                    folderId={knowFolder._id}
                  />
                </div>
              </ManageFiles>
            </section>
          </WorkflowLayout>
        ) :
        folder && <WorkflowLayout>
          <section id='folder_sect'>
            <ManageFiles title={folder.folder_name} removePageSuffix={true}>
              <div className='folder_wrapper'>
                <SectionBox
                  cardBgColor='#1ABC9C'
                  itemType={'folder'}
                  title={`${folder.folder_name} - Documents`}
                  Card={DocumentCard}
                  cardItems={docItems}
                  folderId={folder._id}
                />
              </div>

              <div className='folder_wrapper'>
                <SectionBox
                  cardBgColor='#1ABC9C'
                  itemType={'folder'}
                  title={`${folder.folder_name} - Templates`}
                  Card={TemplateCard}
                  cardItems={tempItems}
                  status={'finished'}
                  folderId={folder._id}
                />
              </div>
            </ManageFiles>
          </section>
        </WorkflowLayout>

      }
    </>
  );
};

export default FolderPage;
