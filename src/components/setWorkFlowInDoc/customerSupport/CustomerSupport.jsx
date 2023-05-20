import styles from "./customerSupport.module.css";
import { v4 as uuidv4 } from "uuid";
import { motion, useTransform, useScroll } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./swiper.css";
import { useRef } from "react";

const CustomerSupport = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["200px", "-200px"]);

  return (
    <motion.div ref={ref} style={{ y }} className={styles.container}>
      <div className={styles.swiper__container}>
        <Swiper
          autoplay={{ delay: 2000 }}
          loop={true}
          navigation={true}
          pagination={true}
          modules={[Navigation, Pagination, Autoplay]}
          className="customer-support-swiper"
        >
          {swiperItems.map((item, index) => (
            <SwiperSlide key={item.id}>
              <p className={styles.features__title}>Slide {index + 1}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.card__container}>
        <div className={styles.flip__container}>
          <div className={styles.flip__box}>
            <div
              className={`${styles.support__container} ${styles.flip__card__front}`}
            >
              <div className={styles.support__box}>
                <p className={styles.support__box__header}>Customer Support</p>
                <p className={styles.support__box__content}>
                  Learning Support, New Trends, Case Studies, References,
                  Templates
                </p>
              </div>
            </div>
            <div
              className={`${styles.knowledge__container} ${styles.flip__card__back}`}
            >
              <div className={styles.knowledge__box}>
                <div>
                  <p className={styles.knowledge__box__header}>
                    Knowledge Center
                  </p>
                  <p className={styles.knowledge__box__content}>
                    Learning Support, New Trends, Case Studies, References,
                    Templates
                  </p>
                  <button className={styles.knowledge__button}>
                    Click Here
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerSupport;

export const swiperItems = [
  { id: uuidv4(), image: "" },
  { id: uuidv4(), image: "" },
  { id: uuidv4(), image: "" },
];
