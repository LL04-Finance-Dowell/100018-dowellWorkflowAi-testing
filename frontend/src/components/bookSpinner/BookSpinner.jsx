import React from "react";
import styles from "./bookSpinner.module.css";

const BookSpinner = () => {

  return (
    <div
      style={{
        backgroundImage: `url(https://i0.wp.com/100018-dowellWorkflowAi-testing/wp-content/uploads/2022/10/artistic-logo.png?fit=916%2C640&ssl=1)`,
        backgroundSize: "cover",
      }}
      className={styles.book}
    >
      <div className={styles.book__pg}>
        {/*    <img
          src="https://i0.wp.com/100018-dowellWorkflowAi-testing/wp-content/uploads/2022/10/artistic-logo.png?fit=916%2C640&ssl=1"
          style={{ objectFit: "cover", width: "20px", height: "20px" }}
        /> */}
      </div>
      <div className={styles.book__pg}></div>
      <div className={`${styles.book__pg} ${styles.book__pg__2}`}></div>
      <div className={`${styles.book__pg} ${styles.book__pg__3}`}></div>
      <div className={`${styles.book__pg} ${styles.book__pg__4}`}></div>
      <div className={`${styles.book__pg} ${styles.book__pg__5}`}></div>
    </div>
  );
};

export default BookSpinner;
