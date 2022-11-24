import React from "react";
import styles from "./formLayout.module.css";
import DoneIcon from "@mui/icons-material/Done";

const FormLayout = ({ isSubmitted, children, loading, ...rest }) => {
  console.log("aaa", loading);

  return (
    <div {...rest} className={styles.container}>
      {children}
      {isSubmitted && (
        <div className={styles.pasted__text}>
          <DoneIcon />
          <span> Pasted</span>
        </div>
      )}
      {loading && <div className={styles.form__loading}></div>}
    </div>
  );
};

export default FormLayout;
