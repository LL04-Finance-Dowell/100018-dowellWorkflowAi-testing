import React from "react";
import styles from "./formLayout.module.css";

const FormLayout = ({ isSubmitted, children, loading, ...rest }) => {
  

  return (
    <div {...rest} className={styles.container}>
      {children}
      {isSubmitted && (
        <div className={styles.pasted__text}>
          {/*  <DoneIcon /> */}
          <span> Saved</span>
        </div>
      )}
      {loading && <div className={styles.form__loading}></div>}
    </div>
  );
};

export default FormLayout;
