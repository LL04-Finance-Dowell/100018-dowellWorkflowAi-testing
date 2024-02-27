import styles from './customerSupport.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useTransform, useScroll } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import sliderOne from '../../../assets/sliderOne.webp';
import sliderTwo from '../../../assets/sliderTwo.webp';
import sliderTheree from '../../../assets/sliderTheree.webp';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

import './swiper.css';
import { useRef } from 'react';

const CustomerSupport = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'start start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['200px', '-200px']);

  const navigate = useNavigate();

  return (
    <div ref={ref} style={{ y }} className={styles.container}>
      <div className={styles.swiper__container}>
        <Swiper
          autoplay={{ delay: 2000 }}
          loop={true}
          navigation={true}
          pagination={true}
          modules={[Navigation, Pagination, Autoplay]}
          className='customer-support-swiper'
        >
          {swiperItems.map((item, index) => (
            <SwiperSlide key={item.id}>
              <img src={item.image} alt='slider' />
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
                <p className={styles.support__box__header}>
                  {t('Customer Support')}
                </p>
                <p className={styles.support__box__content}>
                  {t(
                    'Learning Support New Trends Case Studies References Templates'
                  )}
                </p>
              </div>
            </div>
            <div
              className={`${styles.knowledge__container} ${styles.flip__card__back}`}
            >
              <div className={styles.knowledge__box}>
                <div>
                  <p className={styles.knowledge__box__header}>
                    {t('Knowledge Center')}
                  </p>
                  <p className={styles.knowledge__box__content}>
                    {t(
                      'Learning Support New Trends Case Studies References Templates'
                    )}
                  </p>
                  <button className={styles.knowledge__button} onClick={()=>{navigate('/templates/demo#demo')}}>
                    {t('Click Here')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;

export const swiperItems = [
  { id: uuidv4(), image: sliderOne },
  { id: uuidv4(), image: sliderTwo },
  { id: uuidv4(), image: sliderTheree },
];
