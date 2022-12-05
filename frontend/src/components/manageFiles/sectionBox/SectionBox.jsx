import React from "react";
/* import HoverCard from "../../hover-card/HoverCard"; */
import styles from "./sectionBox.module.css";
import maneFilesStyles from "../manageFiles.module.css";
import HoverCard from "../../newHoverCard/HoverCard";

const SectionBox = ({ cardItems, title, cardBgColor }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2 className={maneFilesStyles.header}>{title}</h2>
          <div className={styles.grid__box}>
            {cardItems.map((item) => (
              <HoverCard bgColor={cardBgColor} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
