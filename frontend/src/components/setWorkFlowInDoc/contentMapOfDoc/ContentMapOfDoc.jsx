import styles from "./contentMapOfDoc.module.css";
import { IoIosArrowDown } from "react-icons/io";
<<<<<<< HEAD
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

  const isFixedCallback = useCallback(() => {
    if (ref.current?.getBoundingClientRect().top > 0) {
      setIsFixed(false);
    } else {
      setIsFixed(true);
    }
  }, [scroll]);

  useEffect(() => {
    isFixedCallback();
  }, [isFixedCallback]);

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
=======
import { useEffect, useState, useRef } from "react";
import useScrollPosition from "../../../hooks/useScrollPosition";

const ContentMapOfDoc = () => {
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);
  const scrollPosition = useScrollPosition();

  console.log(isSticky, scrollPosition);

  useEffect(() => {
    if (
      ref.current?.getBoundingClientRect().bottom <= 0 ||
      ref.current?.getBoundingClientRect().top === 105
    ) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }, [scrollPosition]);

  console.log("top", ref.current?.getBoundingClientRect().top, isSticky);
  console.log("aaa", scrollPosition);

  return (
    <div
      ref={ref}
      className={`${styles.container} ${isSticky && styles.sticky}`}
    >
      <div className={styles.header__box}>
        <h4 className={styles.header}>Content Map of selected Doucument</h4>
        <IoIosArrowDown />
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
      </div>
    </div>
  );
};

export default ContentMapOfDoc;
<<<<<<< HEAD

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
=======
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
