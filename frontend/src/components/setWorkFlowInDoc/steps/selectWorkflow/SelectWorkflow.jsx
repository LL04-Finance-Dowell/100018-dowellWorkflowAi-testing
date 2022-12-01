import { useState } from "react";
import styles from "./selectWorkflow.module.css";
<<<<<<< HEAD
import InfoBoxes from "./ınfoBoxes/InfoBoxes";
import { useEffect } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
import WorkflowSwiper from "./workFlowSwiper/WorkflowSwiper";
=======
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "./swipper.css";
import InfoBoxes from "./ınfoBoxes/InfoBoxes";
import { useEffect } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e

const SelectWorkflow = () => {
  const size = useWindowSize();
  const [selectedWorkFlows, setSelectedWorkFlows] = useState([]);

  const [largeLoop, setLargeLoop] = useState(false);
  const [smallLoop, setSmallLoop] = useState(false);

  useEffect(() => {
    if (selectedWorkFlows.length > 3) setLargeLoop(true);
    if (selectedWorkFlows.length > 2) setSmallLoop(true);
  }, [selectedWorkFlows, size.width]);

  return (
    <div className={styles.container}>
      <InfoBoxes setSelectedWorkFlows={setSelectedWorkFlows} />
      <h2 className={`${styles.title} h2-small step-title`}>
        2. Select a Workflow to add to the selected document
      </h2>
      {selectedWorkFlows.length > 0 && size.width > 1025 ? (
<<<<<<< HEAD
        <WorkflowSwiper
          loop={largeLoop}
          perSlide={3}
          selectedWorkFlows={selectedWorkFlows}
        />
      ) : (
        <WorkflowSwiper
          loop={smallLoop}
          perSlide={2}
          selectedWorkFlows={selectedWorkFlows}
        />
=======
        <div className={styles.add__container}>
          <Swiper
            loop={largeLoop}
            slidesPerView={3}
            spaceBetween={10}
            pagination={{
              clickable: { largeLoop },
            }}
            navigation={largeLoop}
            modules={[Pagination, Navigation]}
            className="select-workflow"
          >
            {selectedWorkFlows.map((selectedWorkflow) => (
              <SwiperSlide key={selectedWorkflow.id}>
                {selectedWorkflow.content}
              </SwiperSlide>
            ))}
          </Swiper>
          <a className={styles.add__button}>
            Add Selected Workflow to document
          </a>
        </div>
      ) : (
        <div className={styles.add__container}>
          <Swiper
            loop={smallLoop}
            slidesPerView={2}
            spaceBetween={10}
            pagination={{
              clickable: { smallLoop },
            }}
            navigation={smallLoop}
            modules={[Pagination, Navigation]}
            className="select-workflow"
          >
            {selectedWorkFlows.map((selectedWorkflow) => (
              <SwiperSlide key={selectedWorkflow.id}>
                {selectedWorkflow.content}
              </SwiperSlide>
            ))}
          </Swiper>
          {selectedWorkFlows.length > 0 && (
            <a className={styles.add__button}>
              Add Selected Workflow to document
            </a>
          )}
        </div>
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
      )}
    </div>
  );
};

export default SelectWorkflow;
