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
          {contents.map((item, index) => (
            <li data-index={index + 1} key={item.id}>
              <span>
                <a>{item.content}</a>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Contents;
