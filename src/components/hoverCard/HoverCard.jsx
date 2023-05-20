import React from 'react';
import { Box } from './styledComponents';
import styles from './hoverCard.module.css';
import { useAppContext } from '../../contexts/AppContext';

const HoverCard = ({ Front, Back, loading }) => {
  const { isNoPointerEvents } = useAppContext();
  return (
    <div
      className={styles.container}
      style={isNoPointerEvents ? { pointerEvents: 'none' } : {}}
    >
      <Box className={`${styles.box}`}>
        <Front />
      </Box>
      <Box
        className={`${styles.box} ${styles.hover__box} ${
          loading === true && styles.hover
        }`}
      >
        <Back />
      </Box>
    </div>
  );
};

export default HoverCard;
