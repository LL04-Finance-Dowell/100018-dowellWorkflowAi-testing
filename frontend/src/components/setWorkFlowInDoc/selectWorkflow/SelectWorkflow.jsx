import { useState } from "react";
import styles from "./selectWorkflow.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import "./swipper.css";
import InfoBoxes from "../ınfoBoxes/InfoBoxes";
import { useEffect } from "react";
import { useMemo } from "react";

const SelectWorkflow = () => {
  const [selectedWorkFlows, setSelectedWorkFlows] = useState([]);

  const [loop, setLoop] = useState(false);

  useEffect(() => {
    if (selectedWorkFlows.length > 2) setLoop(true);
  }, [selectedWorkFlows]);

  return (
    <div className={styles.container}>
      <InfoBoxes setSelectedWorkFlows={setSelectedWorkFlows} />
      <h2 className={`${styles.title} h2-small step-title`}>
        2. Select a Workflow to add to the selected document
      </h2>
      {selectedWorkFlows.length > 0 && (
        <div className={styles.add__container}>
          <Swiper
            loop={false}
            loopFillGroupWithBlank={false}
            slidesPerView={2}
            spaceBetween={10}
            breakpoints={{
              1025: {
                slidesPerView: 3,
              },
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
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
      )}
    </div>
  );
};

export default SelectWorkflow;
