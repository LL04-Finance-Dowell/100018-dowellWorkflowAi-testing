import styles from './contentMapOfDoc.module.css';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';
import { useState, useRef } from 'react';

import Contents from '../contents/Contents';
import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { ImPencil2 } from 'react-icons/im';
import { motion } from 'framer-motion';

const ContentMapOfDoc = () => {
  const { contentOfDocumentStatus, contentOfDocument } = useSelector(
    (state) => state.document
  );
  const { currentDocToWfs } = useSelector((state) => state.processes);

  const [toggleContent, setToggleContent] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const ref = useRef(null);
  /*  const scroll = useScrollPosition(); */

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

  const variants = {
    initial: {
      x: '-100%',
    },
    animate: {
      x: '0%',
    },
  };

 
////
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
                Content Map of {currentDocToWfs?.document_name}
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

// const mapDocuments = [
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
//   { id: uuidv4(), content: "Workflow A1" },
// ];
