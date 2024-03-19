import styles from './selectDoc.module.css';
import { useMediaQuery } from 'react-responsive';
import { useAppContext } from '../../../../contexts/AppContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './swiper.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { LoadingSpinner } from '../../../LoadingSpinner/LoadingSpinner';

import SelectedDocuments from './selectedDocuments/SelectedDocuments';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../../utils/helpers';
import { DocumentServices } from '../../../../services/documentServices';
import { setOriginalDocuments, setOriginalDocumentsLoaded } from '../../../../features/document/documentSlice';
import axios from 'axios';

import { contentDocument } from '../../../../features/document/asyncThunks';

import { setContentOfDocument } from '../../../../features/document/documentSlice';

import { startCopyingDocument } from '../../../../features/processCopyReducer';
import { TemplateServices } from '../../../../services/templateServices';

const SelectDoc = ({ savedDoc, addWorkflowStep }) => {
  // console.log("saved Document", savedDoc)
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useAppContext();
  const {
    allDocuments: allDocumentsArray,
    originalDocuments,
    originalDocumentsLoaded
  } = useSelector(
    (state) => state.document
  );
  const { userDetail } = useSelector((state) => state.auth);
  const { DocumentId } = useSelector((state) => state.app);


  ///import which doc or template approval
  // const whichApproval = useSelector((state)=> state.copyProcess.whichApproval)
  const currentURL = window.location.href;
  const parts = currentURL.split('/');
  const whichApproval = parts[parts.length - 1];
  const whichApprovalStep = parts[parts.length - 1];


  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedDocumentCopies, setSelectedDocumentCopies] = useState([]);
  const [currentSelectedDocument, setCurrentSelectedDocument] = useState(null);
  const [stepDocument, setStepDocument] = useState({});


  ////copied docs
  const copiedDocument = useSelector((state) => state.copyProcess.document);
  const copiedWorkflow = useSelector((state) => state.copyProcess.workflow);

  useEffect(() => {
    // console.log('the copied doc and workflow are , ', copiedDocument, copiedWorkflow)
    if (copiedDocument !== null) {
      setCurrentSelectedDocument(copiedDocument)
      setSelectedDocuments((prev) => [copiedDocument]);
      dispatch(startCopyingDocument())
      // dispatch(contentDocument(copiedDocument.collection_id));
      // dispatch(setCurrentDocToWfs(copiedDocument));
      // dispatch(setContentOfDocument(null));
    }
  }, [copiedDocument, copiedWorkflow])

  // console.log('the picked approval is ', whichApproval)

  const data = {
    company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
    data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
  };

  useEffect(() => {
    if (savedDoc) return;

    dispatch(setOriginalDocumentsLoaded(false));

    if (whichApproval == 'new-set-workflow-document' || whichApprovalStep == 'new-set-workflow-document-step') {
      const documentServices = new DocumentServices();
      documentServices.getAllOriginalDocuments(data.company_id, data.data_type)
        .then(res => {
          // console.log('the doc data are ', res.data)
          dispatch(setOriginalDocuments(res.data.documents?.reverse()));
          dispatch(setOriginalDocumentsLoaded(true));
        })
        .catch(err => {
          // console.log('Failed to load original documents: ', err.response ? err.response.data : err.message);
          dispatch(setOriginalDocumentsLoaded(true));
        })
    } else {
      const templateServices = new TemplateServices()
      templateServices.allTemplates(data.company_id, data.data_type)
        .then(res => {
          // console.log('the template data are ', res.data)
          dispatch(setOriginalDocuments(res.data.templates?.reverse()))
          dispatch(setOriginalDocumentsLoaded(true));
        })
        .catch(err => {
          // console.log('Failed to load original documents: ', err.response ? err.response.data : err.message);
          dispatch(setOriginalDocumentsLoaded(true));
        })
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whichApproval, whichApprovalStep]);



  const handleAddSelectedDocuments = (document) => {
    // console.log("documentmubeen", document)
    if (whichApproval == 'new-set-workflow-document') {
      axios
        .get(`https://workflowai.uxlivinglab.online/v1/companies/${data.company_id}/documents/${document._id}/clones/?data_type=${data.data_type}`)
        .then((response) => {
          // // console.log('the response for document detail is ',response.data)
          setSelectedDocumentCopies(
            response.data
          );

        })
        .catch((error) => {
          // console.log(error)
        });
    }
    else {

    }
    setCurrentSelectedDocument(document);
    Array.isArray(allDocumentsArray)
    // // console.log(selectedDocumentCopies)

    const isInclude = selectedDocuments.find(
      (item) => item._id === document._id
    );
    if (isInclude) {
      setSelectedDocuments((prev) =>
        prev.filter((item) => item._id !== document._id)
      );
    } else {
      setSelectedDocuments((prev) => [document]);
    }
  };

  useEffect(() => {
    if (!savedDoc) return;
    setSelectedDocuments([savedDoc]);
  }, [savedDoc]);

  const fetchDocument = async (documentId) => {
    try {
      const url = `https://100094.pythonanywhere.com/v2/documents/${documentId}/?document_type=clone`;
      const response = await axios.get(url);
      // console.log("response", response)
      setStepDocument(response.data);
    } catch (error) {
      // Handle any errors here
      console.error('Error fetching document:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (DocumentId && DocumentId?.stepDocumentCloneMap?.length > 0) {
      const document_key = Object.values(DocumentId.stepDocumentCloneMap[0])[0]
      if (document_key) {
        fetchDocument(document_key)
      }
    }
  }, [DocumentId]);

  const dummyStep = [
    {
      "permitInternalWorkflow": true,
      "stepCloneCount": 1,
      "stepTaskType": "assign_task",
      "stepRights": "add_edit",
      "stepProcessingOrder": "team_user_public",
      "stepTaskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time",
      "stepActivityType": "individual_task",
      "stepDisplay": "before_this_step",
      "stepName": "Manish",
      "stepRole": "Project lead",
      "stepPublicMembers": [],
      "stepTeamMembers": [
        {
          "member": "couzy",
          "portfolio": "Workflow Tester"
        },
        {
          "member": "GhassanOmran",
          "portfolio": "created"
        }
      ],
      "stepUserMembers": [],
      "stepDocumentCloneMap": [
        {
          "couzy": "65b8c61de29116fd5c08f769"
        }
      ],
      "stepNumber": 1,
      "stepDocumentMap": [
        {
          "content": "t1",
          "required": false,
          "page": 1
        }
      ],
      "skipStep": false,
      "stepLocation": "any"
    }
  ]
  // const document_key = Object.values(DocumentId.stepDocumentCloneMap[0])[0]
  // let stepDocument = allDocumentsArray?.filter((item) => item._id === document_key);

  // if(stepDocument){
  //   stepDocument = originalDocuments[1];
  // }

  // console.log("addWorkflowStep",stepDocument,addWorkflowStep, dummyStep, DocumentId, selectedDocuments, ProcessDetail, allDocumentsArray, originalDocuments)

  return (
    <div
      className={styles.container}
      style={{ cursor: savedDoc ? 'not-allowed' : 'default' }}
    >
      <h2 className={styles.h2__Doc__Title}>
        1. {t('Select a Document to add Workflows')}
      </h2>
      {isMobile && (
        <div className={styles.content__continer}>
          <div className={styles.left__container}>
            {!originalDocumentsLoaded ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className='select-doc'
              >
                <LoadingSpinner />
              </div>
            ) : (
              <Swiper
                loop={true}
                navigation={true}
                pagination={true}
                modules={[Navigation]}
                id='select-doc'
                enabled={savedDoc ? false : true}
                initialSlide={
                  savedDoc &&
                    originalDocuments &&
                    originalDocuments.length &&
                    originalDocuments.length > 0 &&
                    selectedDocuments.length > 0
                    ? originalDocuments.findIndex(
                      (doc) => doc._id === selectedDocuments[0]._id
                    ) !== -1
                      ? originalDocuments.findIndex(
                        (doc) => doc._id === selectedDocuments[0]._id
                      )
                      : 0
                    : 0
                }
              >
                {originalDocuments &&
                  originalDocuments.length &&
                  originalDocuments.length > 0 &&
                  [...originalDocuments]
                    // ?.filter((document) => document.document_type === 'original')
                    .map((item, index) => (
                      <SwiperSlide key={item._id}>
                        <div className={styles.swiper__slide__box}>
                          <div
                            className={`${styles.swiper__slide__features} animate`}
                          >
                            <p className={styles.features__title}>
                              {whichApproval == 'new-set-workflow-document' ? item.document_name : item.template_name}
                            </p>
                            <button
                              onClick={() => handleAddSelectedDocuments(item)}
                              className={`${styles.features__button} ${selectedDocuments.find(
                                (selectedDocument) =>
                                  selectedDocument._id === item._id
                              ) && styles.selected
                                }`}
                              style={{
                                pointerEvents: savedDoc ? 'none' : 'all',
                              }}
                            >
                              {selectedDocuments.find(
                                (selectedDocument) =>
                                  selectedDocument._id === item._id
                              )
                                ? t('selected')
                                : t('click here')}
                            </button>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            )}
          </div>
          <div className={styles.right__container}>
            <SelectedDocuments
              selectedDocument={savedDoc ? savedDoc : currentSelectedDocument}
              selectedDocuments={selectedDocumentCopies}
              disableSelections={savedDoc ? true : false}
            />
          </div>
        </div>
      )}
      {!isMobile && (
        <div className={styles.content__continer}>
          <div className={styles.left__container}>
            {!originalDocumentsLoaded ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className='select-doc'
              >
                <LoadingSpinner />
              </div>
            ) : (
              addWorkflowStep ?
                <Swiper
                  loop={true}
                  navigation={true}
                  pagination={true}
                  modules={[Navigation]}
                  className='select-doc'
                  enabled={savedDoc ? false : true}
                  initialSlide={
                    savedDoc &&
                      originalDocuments &&
                      originalDocuments.length &&
                      originalDocuments.length > 0 &&
                      selectedDocuments.length > 0
                      ? originalDocuments.findIndex(
                        (doc) => doc._id === selectedDocuments[0]._id
                      ) !== -1
                        ? originalDocuments.findIndex(
                          (doc) => doc._id === selectedDocuments[0]._id
                        )
                        : 0
                      : 0
                  }
                >
                  {originalDocuments &&
                    originalDocuments.length &&
                    originalDocuments.length > 0 &&
                    stepDocument &&
                    // [...originalDocuments]
                    // ?.filter((document) => document.document_type === 'original')
                    // .map((item, index) => (

                    <SwiperSlide key={stepDocument?._id}>
                      <div className={styles.swiper__slide__box}>
                        <div
                          className={`${styles.swiper__slide__features} animate`}
                        >
                          <p className={styles.features__title}>
                            {whichApprovalStep == 'new-set-workflow-document-step' ? stepDocument?.document_name : stepDocument?.template_name}
                          </p>
                          <button
                            onClick={() => handleAddSelectedDocuments(stepDocument)}
                            className={`${styles.features__button} ${selectedDocuments.find(
                              (selectedDocument) =>
                                selectedDocument._id === stepDocument._id
                            ) && styles.selected
                              }`}
                            style={{
                              pointerEvents: savedDoc ? 'none' : 'all',
                            }}
                          >
                            {selectedDocuments.find(
                              (selectedDocument) =>
                                selectedDocument._id === stepDocument._id
                            )
                              ? t('selected')
                              : t('click here')}
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  }
                </Swiper> :
                <Swiper
                  loop={true}
                  navigation={true}
                  pagination={true}
                  modules={[Navigation]}
                  className='select-doc'
                  enabled={savedDoc ? false : true}
                  initialSlide={
                    savedDoc &&
                      originalDocuments &&
                      originalDocuments.length &&
                      originalDocuments.length > 0 &&
                      selectedDocuments.length > 0
                      ? originalDocuments.findIndex(
                        (doc) => doc._id === selectedDocuments[0]._id
                      ) !== -1
                        ? originalDocuments.findIndex(
                          (doc) => doc._id === selectedDocuments[0]._id
                        )
                        : 0
                      : 0
                  }
                >
                  {originalDocuments &&
                    originalDocuments.length &&
                    originalDocuments.length > 0 &&
                    [...originalDocuments]
                      // ?.filter((document) => document.document_type === 'original')
                      .map((item, index) => (
                        <SwiperSlide key={item._id}>
                          <div className={styles.swiper__slide__box}>
                            <div
                              className={`${styles.swiper__slide__features} animate`}
                            >
                              <p className={styles.features__title}>
                                {whichApproval == 'new-set-workflow-document' ? item.document_name : item.template_name}
                              </p>
                              <button
                                onClick={() => handleAddSelectedDocuments(item)}
                                className={`${styles.features__button} ${selectedDocuments.find(
                                  (selectedDocument) =>
                                    selectedDocument._id === item._id
                                ) && styles.selected
                                  }`}
                                style={{
                                  pointerEvents: savedDoc ? 'none' : 'all',
                                }}
                              >
                                {selectedDocuments.find(
                                  (selectedDocument) =>
                                    selectedDocument._id === item._id
                                )
                                  ? t('selected')
                                  : t('click here')}
                              </button>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                </Swiper>

            )}
          </div>
          <div className={styles.right__container}>
            <SelectedDocuments
              selectedDocument={savedDoc ? savedDoc : currentSelectedDocument}
              selectedDocuments={selectedDocumentCopies}
              disableSelections={savedDoc ? true : false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectDoc;

// const sliderItems = [
//   { id: uuidv4(), img: "" },
//   { id: uuidv4(), img: "" },
//   { id: uuidv4(), img: "" },
// ];
