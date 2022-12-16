import styles from "./workFlowSwiper.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import swiper from "./swiper.css";
import { useDispatch, useSelector } from "react-redux";
import { setWfToDocument } from "../../../../../features/app/appSlice";
import { contentDocument } from "../../../../../features/document/asyncThunks";

const WorkflowSwiper = ({ loop, perSlide }) => {
  const dispatch = useDispatch();

  const { selectedWorkflowsToDoc, currentDocToWfs } = useSelector(
    (state) => state.app
  );

  const handleConnectWfToDoc = () => {
    dispatch(setWfToDocument());
    if (currentDocToWfs) {
      const data = { document_id: currentDocToWfs._id };
      console.log(data, "dataaaaaaaaaaaaaaaaaa");
      dispatch(contentDocument(data));
    }
  };

  return (
    <div className={styles.add__container}>
      <Swiper
        loop={loop}
        slidesPerView={perSlide}
        spaceBetween={10}
        pagination={{
          clickable: { loop },
        }}
        navigation={loop}
        modules={[Pagination, Navigation]}
        className="select-workflow"
      >
        {selectedWorkflowsToDoc.map((selectedWorkflow) => (
          <SwiperSlide key={selectedWorkflow.id}>
            {selectedWorkflow.workflows?.workflow_title}
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedWorkflowsToDoc.length > 0 && (
        <a onClick={handleConnectWfToDoc} className={styles.add__button}>
          Add Selected Workflow to document
        </a>
      )}
    </div>
  );
};

export default WorkflowSwiper;
