import styles from "./workFlowSwiper.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import swiper from "./swiper.css";

const WorkflowSwiper = ({ loop, perSlide, selectedWorkFlows }) => {
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
        {selectedWorkFlows.map((selectedWorkflow) => (
          <SwiperSlide key={selectedWorkflow.id}>
            {selectedWorkflow.content}
          </SwiperSlide>
        ))}
      </Swiper>
      <a className={styles.add__button}>Add Selected Workflow to document</a>
    </div>
  );
};

export default WorkflowSwiper;
