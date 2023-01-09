import { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromTableOfContentForStep, setTableOfContentForStep } from "../../../features/app/appSlice";
import styles from "./contents.module.css";

const Contents = ({ contents, toggleContent, feature, currentStepIndex, showCheckBoxForContent }) => {
  const contentRef = useRef(null);
  const [currentTableItem, setCurrentTableItem] = useState(null);
  const dispatch = useDispatch();
  const { docCurrentWorkflow, tableOfContentForStep } = useSelector((state) => state.app);

  /*  const handleAddContent = (content) => {
    console.log(content);
    const isInclude = selectedContents.map((item) => item._id === content._id);

    setSelectedContents((prev) =>
      prev.map((item) => (item._id === content._id ? prev : [...prev, content]))
    );

    console.log(selectedContents);
  }; */

  const handleContentSelection = (valueAsJSON) => {
    const contentStepAlreadyAdded = tableOfContentForStep.find(step => step.workflow === docCurrentWorkflow._id && step._id === valueAsJSON._id && step.stepIndex === currentStepIndex);
    
    if (contentStepAlreadyAdded) {
      return dispatch(removeFromTableOfContentForStep(valueAsJSON._id))
    }

    const newTableOfContentObj = {
      ...valueAsJSON,
      "workflow": docCurrentWorkflow._id,
      "stepIndex": currentStepIndex,
    }

    dispatch(setTableOfContentForStep(newTableOfContentObj));
  }

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
                    {/* { showCheckBoxForContent && <input type={"checkbox"} value={JSON.stringify(item)} onChange={handleCheckboxSelection} /> } */}
                    <a style={tableOfContentForStep.find(step => step.workflow === docCurrentWorkflow._id && step._id === item._id && step.stepIndex === currentStepIndex) ? { backgroundColor: "#0048ff", color: "#fff", padding: "2% 30%", borderRadius: "5px", width: "100%" } : {}} onClick={() => handleContentSelection(item)}>{item.id}</a>
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
