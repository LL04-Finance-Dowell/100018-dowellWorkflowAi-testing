import styles from "./selectDoc.module.css";
import { v4 as uuidv4 } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./swiper.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mineDocuments } from "../../../../features/document/asyncThunks";
import { setCurrentDocToWfs } from "../../../../features/app/appSlice";

const SelectDoc = () => {
  const dispatch = useDispatch();
  const { minedDocuments, mineStatus } = useSelector((state) => state.document);
  const { userDetail } = useSelector((state) => state.auth);
  const { wfToDocument } = useSelector((state) => state.app);

  useEffect(() => {
    const data = {
      created_by: userDetail?.userinfo.username,
      company_id: userDetail?.portfolio_info.org_id,
    };

    dispatch(mineDocuments(data));
  }, []);

  const handleAddDocument = (document) => {
    dispatch(setCurrentDocToWfs(document));
    console.log("swwwww", wfToDocument);
  };

  return (
    <div className={styles.container}>
      <Swiper
        loop={true}
        navigation={true}
        pagination={true}
        modules={[Navigation, Pagination]}
        className="select-doc"
      >
        {minedDocuments.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className={styles.swiper__slide__box}>
              <div className={`${styles.swiper__slide__features} animate`}>
                <p className={styles.features__title}>{item.document_name}</p>
                <button
                  onClick={() => handleAddDocument(item)}
                  className={styles.features__button}
                >
                  click here
                </button>
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
