import { useState } from "react";
import { useRef } from "react";
import styles from "./contents.module.css";

const Contents = ({ contents, toggleContent, feature }) => {
  const contentRef = useRef(null);
  const [currentTableItem, setCurrentTableItem] = useState(null);

  /*  const handleAddContent = (content) => {
    console.log(content);
    const isInclude = selectedContents.map((item) => item._id === content._id);

    setSelectedContents((prev) =>
      prev.map((item) => (item._id === content._id ? prev : [...prev, content]))
    );

    console.log(selectedContents);
  }; */

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
        {contents.length > 0 ? (
          feature === "doc" ? (
            <table>
              <thead>
                <tr>
                  <th className={styles.table__id}>ID</th>
                  <th className={styles.table__content}>Content</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((item) => (
                  <tr
                    className={
                      item._id === currentTableItem &&
                      styles.current__table__item
                    }
                    key={item._id}
                  >
                    <th className={styles.table__id}>{item.id}</th>
                    <th className={styles.table__content}>{item.data}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <ol>
              {contents.map((item) => (
                <li
                  /*   className={selectedContents.map(
                    (selectedItem) =>
                      selectedItem._id === item._id &&
                      styles.current__table__item
                  )} */
                  /*  onClick={() => handleAddContent(item)} */
                  key={item._id}
                >
                  <span>
                    <a>{item.id}</a>
                  </span>
                </li>
              ))}
            </ol>
          )
        ) : (
          <div className={styles.no__data}>No Data</div>
        )}
        {/*  <ol>
          {contents.length > 0 ? (
            contents.map((item, index) => (
              <li key={item._id} data-index={item.id}>
                {feature === "doc" && (
                  <span>
                    <a>{item.data}</a>
                  </span>
                )}
              </li>
            ))
          ) : (
            <div className={styles.no__data}>No Data</div>
          )}
        </ol> */}
      </div>
    </div>
  );
};

export default Contents;
