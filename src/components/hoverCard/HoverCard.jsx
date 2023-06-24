import React from 'react';
import { Box } from './styledComponents';
import styles from './hoverCard.module.css';
import { useAppContext } from '../../contexts/AppContext';

const HoverCard = ({ Front, Back, loading, isFolder }) => {
  const { isNoPointerEvents } = useAppContext();
  return (
    <div
    // className={isFolder ? styles.folder_shape : ''}
    >
      <div
        className={`${styles.container} ${isFolder ? styles.folder_shape : ''}`}
        style={isNoPointerEvents ? { pointerEvents: 'none' } : {}}
      >
        <Box className={`${styles.box}`}>
          <Front />
        </Box>
        <Box
          className={`${styles.box} ${styles.hover__box} 
        ${loading === true && styles.hover}`}
        >
          <Back />
        </Box>
      </div>
    </div>
  );
};

export default HoverCard;
