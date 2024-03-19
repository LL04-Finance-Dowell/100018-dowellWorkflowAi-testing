import styles from './contentMapOfDoc.module.css';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';
import { useState, useRef } from 'react';

import Contents from '../contents/Contents';
import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { ImPencil2 } from 'react-icons/im';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ContentMapOfDoc = () => {
  const { contentOfDocumentStatus, contentOfDocument } = useSelector(
    (state) => state.document
  );
  const { currentDocToWfs } = useSelector((state) => state.processes);

  const [toggleContent, setToggleContent] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const ref = useRef(null);
  /*  const scroll = useScrollPosition(); */
  const { t } = useTranslation();

  const handleToggleContent = () => {
    if (contentOfDocument && currentDocToWfs) setToggleContent((prev) => !prev);
  };

  useEffect(() => {
    setToggleContent(false);
  }, [currentDocToWfs]);

  /* const isFixedCallback = useCallback(() => {
    if (ref.current?.getBoundingClientRect().top > 0) {
      setIsFixed(false);
    } else {
      setIsFixed(true);
    }
  }, [scroll]);

  useEffect(() => {
    isFixedCallback();
  }, [isFixedCallback]); */

  // useChangeElementPropertyOnScroll(ref, "position", "fixed", "relative", window.screen.height / 1.54);
  // useChangeElementPropertyOnScroll(ref, "top", "0", "", window.screen.height / 1.54);
  // useChangeElementPropertyOnScroll(ref, "width", "66%", "100%", window.screen.height / 1.54);

  const variants = {
    initial: {
      x: '-100%',
    },
    animate: {
      x: '0%',
    },
  };

  

  return (
    <div ref={ref} className={styles.container}>
      <div className={`${styles.box} ${isFixed && styles.is__fixed}`}>
        <div
          style={{
            pointerEvents: contentOfDocumentStatus === 'pending' && 'none',
          }}
          className={styles.header__box}
          onClick={handleToggleContent}
        >
          {contentOfDocument && contentOfDocumentStatus !== 'pending' ? (
            <>
              <h4 className={styles.header}>
                {t('Content Map of')} {currentDocToWfs?.document_name} {currentDocToWfs?.template_name}
              </h4>
              <i>{toggleContent ? <IoIosArrowUp /> : <IoIosArrowDown />}</i>
            </>
          ) : (
            <div className={styles.line__box}>
              <motion.div
                variants={variants}
                initial='initial'
                animate={contentOfDocumentStatus === 'pending' && 'animate'}
                transition={{ duration: 2, repeat: Infinity }}
                className={styles.line}
              >
                <i>
                  <ImPencil2 color='black' size={25} />
                </i>
              </motion.div>
            </div>
          )}
        </div>
        {contentOfDocument && (
          <Contents
            feature='doc'
            toggleContent={toggleContent}
            contents={contentOfDocument}
          />
        )}
      </div>
    </div>
  );
};

export default ContentMapOfDoc;
