import styles from "./contentMapOfDoc.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Contents from "../contents/Contents";
import { useEffect } from "react";
import useScrollPosition from "../../../hooks/useScrollPosition";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import { ImPencil2 } from "react-icons/im";
import { animate, motion } from "framer-motion";

const ContentMapOfDoc = () => {
  const { contentOfDocumentStatus, contentOfDocument } = useSelector(
    (state) => state.document
  );
  const { wfToDocument } = useSelector((state) => state.app);

  const [toggleContent, setToggleContent] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const ref = useRef(null);
  const scroll = useScrollPosition();

  const handleToggleContent = () => {
    if (contentOfDocument && wfToDocument.document)
      setToggleContent((prev) => !prev);
  };

  useEffect(() => {
    setToggleContent(false);
  }, [wfToDocument.document]);

  /* const isFixedCallback = useCallback(() => {
    if (ref.current?.getBoundingClientRect().top > 0) {
      setIsFixed(false);
    } else {
      setIsFixed(true);
    }
  }, [scroll]);

  useEffect(() => {
    isFixedCallback();
  }, [isFixedCallback]); */

  const variants = {
    initial: {
      x: "-100%",
    },
    animate: {
      x: "0%",
    },
  };

  return (
    <div ref={ref} className={styles.container}>
      <div className={`${styles.box} ${isFixed && styles.is__fixed}`}>
        <div
          style={{
            pointerEvents: contentOfDocumentStatus === "pending" && "none",
          }}
          className={styles.header__box}
          onClick={handleToggleContent}
        >
          {contentOfDocument &&
          wfToDocument.document &&
          contentOfDocumentStatus !== "pending" ? (
            <>
              <h4 className={styles.header}>
                Content Map of {wfToDocument?.document?.document_name}
              </h4>
              <i>{toggleContent ? <IoIosArrowUp /> : <IoIosArrowDown />}</i>
            </>
          ) : (
            <div className={styles.line__box}>
              <motion.div
                variants={variants}
                initial="initial"
                animate={contentOfDocumentStatus === "pending" && "animate"}
                transition={{ duration: 2, repeat: Infinity }}
                className={styles.line}
              >
                <i>
                  <ImPencil2 color="black" size={25} />
                </i>
              </motion.div>
            </div>
          )}
        </div>
        {contentOfDocument && wfToDocument.document && (
          <Contents
            feature="doc"
            toggleContent={toggleContent}
            contents={contentOfDocument}
          />
        )}
      </div>
    </div>
  );
};

export default ContentMapOfDoc;

const mapDocuments = [
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
  { id: uuidv4(), content: "Workflow A1" },
];
