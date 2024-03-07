import React, { useEffect, useState } from 'react';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import DocumentCard from '../../components/hoverCard/documentCard/DocumentCard';
import TemplateCard from '../../components/hoverCard/templateCard/TemplateCard';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import { useSelector } from 'react-redux';
import axios from 'axios';

// TODO HANDLE WHEN THE ID CAN'T BE FOUND IN FOLDERS
// TODO HANDLE WHAT HAPPENS IF USER DELETES ALL CONTENTS IN A FOLDER

const FolderPage = ({ knowledgeCenter }) => {
  const { folder_id } = useParams();
  const { folders } = useAppContext();
  const { KnowledgeFolderTemplates } = useSelector((state) => state.app);
  const [folder, setFolder] = useState(
    folders?.find((folder) => folder._id === folder_id)
  )

  const [metaTemplates, setMetaTemplates] = useState([])
  const { KnowledgeFolders } = useSelector((state) => state.app);

  const [knowFolder, setKnowFolder] = useState(
    KnowledgeFolders?.templates?.find((folder) => folder._id === folder_id)
  );
  const { allDocuments } = useSelector((state) => state.document);
  const { allTemplates } = useSelector((state) => state.template);


  const [docItems, setDocItems] = useState([]);
  const [tempItems, setTempItems] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const apiUrl = 'https://100094.pythonanywhere.com/v1/companies/6385c0f38eca0fb652c9457e/templates/metadata/?data_type=Real_Data'; // Replace with your API endpoint

  //   // Make a GET request using Axios
  //   axios.get(apiUrl)
  //     .then(response => {
  //       // Handle the API response here
  //       setMetaTemplates(response.data)
  //       // console.log('API Response:', response.data);
  //     })
  //     .catch(error => {
  //       // Handle any errors that occur during the request
  //       console.error('API Error:', error);
  //     });
  // }, [knowFolder]);

  useEffect(() => {
    if (folder) {
      let modDocItems = [];
      let modTempitems = [];
      // console.log("mubeenfolder", folder)
      folder.data.forEach((item) => {
        // console.log("itemitemmubeen", item)
        modDocItems.push(
          allDocuments.find((doc) => doc._id === item.document_id) ?? null
        );
        modTempitems.push(
          allTemplates.find((temp) => temp._id === item.template_id) ?? null
        );
      });

      // console.log("modTempitems", modTempitems)

      setDocItems(modDocItems.filter((item) => item));
      setTempItems(modTempitems.filter((item) => item));
      // console.log("temp", tempItems)


    } else if (knowledgeCenter) {

      let modDocItems = [];
      let modTempitems = [];
      
      // console.log("metatemplates", metaTemplates)
      // modTempitems.push(knowFolder.data)
      knowFolder.data.forEach((item) => {
        // modDocItems.push(
        //   allDocuments.find((doc) => doc._id === item.document_id) ?? null
        // );
        // console.log("itemitemmubeen", item)
        modTempitems.push(
          KnowledgeFolderTemplates?.templates?.find((temp) => temp?._id === item?.template_id) ?? null
        );
      });

      // console.log("modTempitems", modTempitems)
      // setDocItems(modDocItems.filter((item) => item));
      setTempItems(modTempitems.filter((item) => item !== null));
      // console.log("temptemptemp", tempItems)
    }
    else {
      // console.error('Invalid route!');
      navigate('/folders');
    }
  }, [folder]);

  useEffect(() => {
    setFolder(folders?.find((folder) => folder._id === folder_id));
  }, [folders]);

  // console.log("knowledgeFoldermubeen", tempItems, knowFolder, folder_id)

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
                    cardItems={tempItems}
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
