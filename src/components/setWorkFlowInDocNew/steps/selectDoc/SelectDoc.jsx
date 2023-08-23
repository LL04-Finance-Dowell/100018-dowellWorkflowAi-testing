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

const SelectDoc = ({ savedDoc }) => {
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


  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedDocumentCopies, setSelectedDocumentCopies] = useState([]);
  const [currentSelectedDocument, setCurrentSelectedDocument] = useState(null);

  const data = {
    company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
    data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
  };

  useEffect(() => {
    if (savedDoc) return;

    dispatch(setOriginalDocumentsLoaded(false));

    const documentServices = new DocumentServices();


    documentServices.getAllOriginalDocuments(data.company_id, data.data_type)
      .then(res => {
        console.log(res.data.documents);
        dispatch(setOriginalDocuments(res.data.documents?.reverse()));
        dispatch(setOriginalDocumentsLoaded(true));
      })
      .catch(err => {
        console.log('Failed to load original documents: ', err.response ? err.response.data : err.message);
        dispatch(setOriginalDocumentsLoaded(true));
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleAddSelectedDocuments = (document) => {
    console.log(document)
    axios
      .get(`https://workflowai.uxlivinglab.online/v1/companies/${data.company_id}/documents/${document._id}/clones/?data_type=${data.data_type}`)
      .then((response) => {
        console.log(response.data)
        setSelectedDocumentCopies(
          response.data
        );

      })
      .catch((error) => {
        console.log(error)
      });
    setCurrentSelectedDocument(document);
    Array.isArray(allDocumentsArray)
    console.log(selectedDocumentCopies)

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
                              {item.document_name}
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
                              {item.document_name}
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
