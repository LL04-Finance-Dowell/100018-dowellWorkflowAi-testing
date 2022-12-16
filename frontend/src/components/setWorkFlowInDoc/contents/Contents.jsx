import { useRef } from "react";
import styles from "./contents.module.css";

const Contents = ({ contents, toggleContent }) => {
  const contentRef = useRef(null);

  return (
    <div
      style={{
        maxHeight: toggleContent
          ? `${contentRef.current?.getBoundingClientRect().height}px`
          : "0px",
      }}
      className={styles.content__container}
    >
      <div ref={contentRef} className={styles.content__box}>
        <ol>
          {contents.length > 0 ? (
            contents.map((item, index) => (
              <li key={item._id} data-index={index + 1}>
                <span>
                  <a>{item.data}</a>
                </span>
              </li>
            ))
          ) : (
            <div className={styles.no__data}>No Data</div>
          )}
        </ol>
      </div>
    </div>
  );
};

export default Contents;
