import styles from "./contentMapOfDoc.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Contents from "../contents/Contents";
import { useEffect } from "react";
import useScrollPosition from "../../../hooks/useScrollPosition";

const ContentMapOfDoc = () => {
  const [toggleContent, setToggleContent] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const ref = useRef(null);
  const scroll = useScrollPosition();

  const handleToggleContent = () => {
    setToggleContent((prev) => !prev);
  };

  useEffect(() => {
    if (ref.current?.getBoundingClientRect().top > 0) {
      setIsFixed(false);
    } else {
      setIsFixed(true);
    }
  }, [scroll]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "85px",
      }}
    >
      <div
        style={{
          position: isFixed ? "fixed" : "relative",
          top: isFixed && "105px",
        }}
        className={`${styles.container}`}
      >
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
