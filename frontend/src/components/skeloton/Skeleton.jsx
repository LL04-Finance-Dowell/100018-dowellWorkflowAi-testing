import React from "react";
import styles from "./skeleton.module.css";

const Skeleton = () => {
  return (
    <div className={styles.skeleton__container}>
      <div className={styles.video__box}></div>
      <div className={styles.first__box}></div>
      <div className={styles.second__box}></div>
    </div>
  );
};

export default Skeleton;
