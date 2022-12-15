import styles from "./contentMapOfDoc.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Contents from "../contents/Contents";
import { useEffect } from "react";
import useScrollPosition from "../../../hooks/useScrollPosition";
import { useCallback } from "react";

const ContentMapOfDoc = () => {
  const [toggleContent, setToggleContent] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const ref = useRef(null);
  const scroll = useScrollPosition();

  const handleToggleContent = () => {
    setToggleContent((prev) => !prev);
  };

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

  return (
    <div ref={ref} className={styles.container}>
      <div className={`${styles.box} ${isFixed && styles.is__fixed}`}>
        <div className={styles.header__box}>
          <h4 className={styles.header}>Content Map of selected Doucument</h4>
          <i onClick={handleToggleContent}>
            {toggleContent ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </i>
        </div>
        <Contents toggleContent={toggleContent} contents={mapDocuments} />
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
