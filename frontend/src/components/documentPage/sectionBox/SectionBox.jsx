import React from "react";
import HoverCard from "../../hover-card/HoverCard";
import styles from "./sectionBox.module.css";
import documentsPageStyle from "../../../pages/Documents/AllDocumentsPage/documentsPage.module.css";

const SectionBox = ({ cardItems, title }) => {
  return (
    <div className={styles.content__container}>
      <h2 className={documentsPageStyle.header}>{title}</h2>
      <div className={styles.content__box}>
        {cardItems.map((item) => (
          <div key={item.id}>
            <HoverCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionBox;
