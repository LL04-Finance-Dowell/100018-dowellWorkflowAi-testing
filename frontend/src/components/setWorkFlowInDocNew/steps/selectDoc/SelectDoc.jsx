import styles from "./selectDoc.module.css";
import { v4 as uuidv4 } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./swiper.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  allDocuments,
  mineDocuments,
  savedDocuments,
} from "../../../../features/document/asyncThunks";
import { setCurrentDocToWfs } from "../../../../features/app/appSlice";
import { LoadingSpinner } from "../../../LoadingSpinner/LoadingSpinner";
import { setContentOfDocument } from "../../../../features/document/documentSlice";
import SelectedDocuments from "./selectedDocuments/SelectedDocuments";

const SelectDoc = ({ savedDoc }) => {
  const dispatch = useDispatch();
  const { allDocuments: allDocumentsArray, allDocumentsStatus } = useSelector(
    (state) => state.document
  );
  const { userDetail } = useSelector((state) => state.auth);
  const { currentDocToWfs } = useSelector((state) => state.app);

  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [ selectedDocumentCopies, setSelectedDocumentCopies ] = useState([]);
  const [ currentSelectedDocument, setCurrentSelectedDocument ] = useState(null);

  useEffect(() => {
    if (savedDoc) return
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
    };

    dispatch(allDocuments(data.company_id));
  }, []);

  const handleAddSelectedDocuments = (document) => {
    setCurrentSelectedDocument(document);
    setSelectedDocumentCopies(allDocumentsArray.filter(item => item.parent_id === document._id))

    const isInclude = selectedDocuments.find(
      (item) => item._id === document._id
    );
    if (isInclude) {
      setSelectedDocuments((prev) =>
        prev.filter((item) => item._id !== document._id)
      );
    } else {
      setSelectedDocuments((prev) => [document]);
    }
  };

  useEffect(() => {
    if (!savedDoc) return
    setSelectedDocuments([savedDoc])
  }, [savedDoc])

  return (
    <div className={styles.container} style={{ cursor: savedDoc ? "not-allowed" : "default" }}>
      <h2 className="h2-small step-title align-left">
        1. Select a Document to add Workflows
      </h2>
      <div className={styles.content__continer}>
        <div className={styles.left__container}>
          {allDocumentsStatus === "pending" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="select-doc"
            >
              <LoadingSpinner />
            </div>
          ) : (
            <Swiper
              loop={true}
              navigation={true}
              pagination={true}
              modules={[Navigation, Pagination]}
              className="select-doc"
              enabled={savedDoc ? false : true}
            >
              {allDocumentsArray &&
                allDocumentsArray.length &&
                allDocumentsArray.length > 0 &&
                [...allDocumentsArray]?.filter(document => document.document_type === 'original').map((item, index) => (
                  <SwiperSlide key={item._id}>
                    <div className={styles.swiper__slide__box}>
                      <div
                        className={`${styles.swiper__slide__features} animate`}
                      >
                        <p className={styles.features__title}>
                          {item.document_name}
                        </p>
                        <button
                          onClick={() => handleAddSelectedDocuments(item)}
                          className={`${styles.features__button} ${
                            selectedDocuments.find(
                              (selectedDocument) =>
                                selectedDocument._id === item._id
                            ) && styles.selected
                          }`}
                          style={{
                            pointerEvents: savedDoc ? 'none' : 'all'
                          }}
                        >
                          {selectedDocuments.find(
                            (selectedDocument) =>
                              selectedDocument._id === item._id
                          )
                            ? "selected"
                            : "click here"}
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>
        <div className={styles.right__container}>
          <SelectedDocuments selectedDocument={savedDoc ? savedDoc : currentSelectedDocument} selectedDocuments={selectedDocumentCopies} disableSelections={savedDoc ? true : false} />
        </div>
      </div>
    </div>
  );
};

export default SelectDoc;

const sliderItems = [
  { id: uuidv4(), img: "" },
  { id: uuidv4(), img: "" },
  { id: uuidv4(), img: "" },
];
