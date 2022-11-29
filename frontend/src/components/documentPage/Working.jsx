import React from "react";
import styles from "./working.module.css";
import { AiOutlineClose } from "react-icons/ai";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState } from "react";

const Working = () => {
  const [toggleForm, setFormToggle] = useState(false);

  const handleFormToggle = () => {
    setFormToggle((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {toggleForm && (
        <div className={styles.overlay}>
          <form>
            <input />
            <select>
              <option>a</option>
              <option>a</option>
              <option>a</option>
            </select>
            <i onClick={handleFormToggle}>
              <AiOutlineClose color="black" size={30} />
            </i>
          </form>
        </div>
      )}
      <div className={styles.content__container}>
        <h2 className={styles.header}>Create a new document</h2>
        <div onClick={handleFormToggle} className={styles.add__Form__toggle}>
          <i>
            <AiOutlinePlusCircle size={50} />
          </i>
        </div>
      </div>
      <div className={styles.content__container}>
        <h2 className={styles.header}>Created by me</h2>
        <div className={styles.content__box}>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
        </div>
      </div>
      <div className={styles.content__container}>
        <h2 className={styles.header}>Drafts</h2>
        <div className={styles.content__box}>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
        </div>
      </div>
    </div>
  );
};

export default Working;
