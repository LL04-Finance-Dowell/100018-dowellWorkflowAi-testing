import styles from "./selectDoc.module.css";
import { v4 as uuidv4 } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./swiper.css";

const SelectDoc = () => {
  return (
    <div className={styles.container}>
      <Swiper
        loop={true}
        navigation={true}
        pagination={true}
        modules={[Navigation, Pagination]}
        className="select-doc"
      >
        {sliderItems.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className={styles.swiper__slide__box}>
              <div className={`${styles.swiper__slide__features} animate`}>
                <p className={styles.features__title}>Document {index + 1}</p>
                <button className={styles.features__button}>click here</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <h2 className="h2-small step-title">
        1. Select a Document to add Workflows
      </h2>
    </div>
  );
};

export default SelectDoc;

const sliderItems = [
  { id: uuidv4(), img: "" },
  { id: uuidv4(), img: "" },
  { id: uuidv4(), img: "" },
];
