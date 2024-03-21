// ? Ln 62 <span> used instead of <button>
import styles from './workFlowSwiper.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

import { useDispatch, useSelector } from 'react-redux';


import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { setWfToDocument } from '../../../../../features/processes/processesSlice';
import { removeFromSelectedWorkflowsToDoc } from '../../../../../features/app/appSlice';

const WorkflowSwiper = ({ loop, perSlide }) => {
  const dispatch = useDispatch();

  const { selectedWorkflowsToDoc } = useSelector((state) => state.processes);


  const handleConnectWfToDoc = (e) => {
    e.preventDefault();
    dispatch(setWfToDocument());
    /*   if (currentDocToWfs) {
      const data = { document_id: currentDocToWfs._id };
      dispatch(contentDocument(data));
    } */
  };

  const handleRemoveWorflow = (id) => {
    dispatch(removeFromSelectedWorkflowsToDoc(id));
  };

  return (
    <div className={styles.add__container}>
      <Swiper
        loop={loop}
        slidesPerView={perSlide}
        spaceBetween={5}
        pagination={{
          clickable: { loop },
        }}
        navigation={loop}
        modules={[Pagination, Navigation]}
        className='select-workflow'
      >
        {selectedWorkflowsToDoc.map((selectedWorkflow) => (
          <SwiperSlide key={selectedWorkflow._id}>
            {selectedWorkflow.workflows?.workflow_title}
            <i onClick={() => handleRemoveWorflow(selectedWorkflow._id)}>
              <IoIosRemoveCircleOutline />
            </i>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedWorkflowsToDoc.length > 0 && (
        <span
          style={{ cursor: 'pointer' }}
          onClick={handleConnectWfToDoc}
          className={styles.add__button}
        >
          Add Selected Workflow to document
        </span>
      )}
    </div>
  );
};

export default WorkflowSwiper;
