import React from "react";
import { Box } from "./styledComponents";
import styles from "./hoverCard.module.css";

const HoverCard = ({ Front, Back }) => {
  return (
    <div className={styles.container}>
      <Box className={`${styles.box}`}>
        <Front />
      </Box>
      <Box className={`${styles.box} ${styles.hover__box}`}>
        <Back />
      </Box>
    </div>
  );
};

export default HoverCard;
