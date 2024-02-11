import React from "react";
import styles from "./overlay.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const Overlay = ({ children, title, handleToggleOverlay }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.header__box}>
          <h5 className={styles.header}>{t(title)}</h5>
          <i onClick={handleToggleOverlay}>
            <AiOutlineClose size={20} />
          </i>
        </div>
        <div className={styles.children__container}>{children}</div>
      </div>
    </div>
  );
};

export default Overlay;
