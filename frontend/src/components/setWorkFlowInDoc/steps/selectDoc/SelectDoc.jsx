import styles from './selectDoc.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  allDocuments,
  contentDocument,
} from '../../../../features/document/asyncThunks';

import { LoadingSpinner } from '../../../LoadingSpinner/LoadingSpinner';
import { setContentOfDocument } from '../../../../features/document/documentSlice';
import { productName } from '../../../../utils/helpers';
import { setCurrentDocToWfs } from '../../../../features/processes/processesSlice';

const SelectDoc = () => {
  const dispatch = useDispatch();
  const { allDocuments: allDocumentsArray, allDocumentsStatus } = useSelector(
    (state) => state.document
  );
  const { userDetail } = useSelector((state) => state.auth);
  const { currentDocToWfs } = useSelector((state) => state.processes);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
      data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
    };

    dispatch(allDocuments(data.company_id, data.data_type));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddDocument = (document) => {
    const data = { document_id: document._id };
    /*   const data = { document_id: currentDocToWfs._id }; */


    dispatch(contentDocument(data.document_id));
    dispatch(setCurrentDocToWfs(document));
    dispatch(setContentOfDocument(null));
  };

  return (
    <div className={styles.container}>
      {allDocumentsStatus === 'pending' ? (
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
          modules={[Navigation, Pagination]}
          className='select-doc'
        >
          {allDocumentsArray &&
            allDocumentsArray.length > 0 &&
            [...allDocumentsArray]?.reverse().map((item, index) => (
              <SwiperSlide key={item.id}>
                <div className={styles.swiper__slide__box}>
                  <div className={`${styles.swiper__slide__features} animate`}>
                    <p className={styles.features__title}>
                      {item.document_name}
                    </p>
                    <button
                      onClick={() => handleAddDocument(item)}
                      className={`${styles.features__button} ${
                        item._id === currentDocToWfs?._id && styles.selected
                      }`}
                    >
                      {item._id === currentDocToWfs?._id
                        ? 'selected'
                        : 'click here'}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      )}

      <h2 className='h2-small step-title'>
        1. Select a Document to add Workflows
      </h2>
    </div>
  );
};

export default SelectDoc;

// const sliderItems = [
//   { id: uuidv4(), img: "" },
//   { id: uuidv4(), img: "" },
//   { id: uuidv4(), img: "" },
// ];
