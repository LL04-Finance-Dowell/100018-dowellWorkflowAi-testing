import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromTableOfContentForStep,
  setTableOfContentForStep,
} from "../../../features/app/appSlice";
import styles from "./contents.module.css";
import { Tooltip } from 'react-tooltip'

const Contents = ({
  contents,
  toggleContent,
  feature,
  currentStepIndex,
  showCheckBoxForContent,
}) => {
  const contentRef = useRef(null);
  const [currentTableItem, setCurrentTableItem] = useState(null);
  const dispatch = useDispatch();
  const { docCurrentWorkflow, tableOfContentForStep } = useSelector(
    (state) => state.app
  );
  const [contentsPageWise, setContentsPageWise] = useState([]);
  const [showContent, setShowContent] = useState([]);

  /*  const handleAddContent = (content) => {
    console.log(content);
    const isInclude = selectedContents.map((item) => item._id === content._id);

    setSelectedContents((prev) =>
      prev.map((item) => (item._id === content._id ? prev : [...prev, content]))
    );

    console.log(selectedContents);
  }; */

  const handleContentSelection = (valueAsJSON) => {
    const contentStepAlreadyAdded = tableOfContentForStep.find(
      (step) =>
        step.workflow === docCurrentWorkflow._id &&
        step._id === valueAsJSON._id &&
        step.stepIndex === currentStepIndex
    );

    if (contentStepAlreadyAdded) {
      return dispatch(removeFromTableOfContentForStep({ id: valueAsJSON._id, stepIndex: currentStepIndex }));
    }

    const newTableOfContentObj = {
      ...valueAsJSON,
      workflow: docCurrentWorkflow._id,
      stepIndex: currentStepIndex,
    };

    dispatch(setTableOfContentForStep(newTableOfContentObj));
  };

  useEffect(() => {
    const contentsGroupedByPageNum = contents.reduce((r, a) => {
      r[a.pageNum] = r[a.pageNum] || [];
      r[a.pageNum].push(a);
      return r;
    }, Object.create(null));

    setContentsPageWise(contentsGroupedByPageNum);

    setShowContent(
      contents.map((content) => {
        return { show: false, id: content.id };
      })
    );
  }, [contents]);

  const handleShowContent = (value, id) => {
    const currentContents = showContent.slice();
    const contentToUpdate = currentContents.find(
      (content) => content.id === id
    );
    if (!contentToUpdate) return;
    contentToUpdate.show = value;
    setShowContent(currentContents);
  };

  // console.log("contentscontents", contentsPageWise);

  return (
    <div
      style={{
        maxHeight: 
          feature === "table-of-contents" ? "8rem" 
          :
          toggleContent ? `${contentRef.current?.getBoundingClientRect().height}px`
          : "0px",
        padding: feature && feature === "table-of-contents" ? "0" : "",
        overflow: feature === "table-of-contents" ? "auto" : ""
      }}
      className={styles.content__container}
    >
      <div ref={contentRef} className={styles.content__box} style={feature && feature === "table-of-contents" ? { overflow: "auto", padding: "0 6px 10px", border: "none" } : {}}>
        {contents.length > 0 ? (
          feature === "doc" ? (
            <>
              {React.Children.toArray(Object.keys(contentsPageWise || {})).map(
                (page) => {
                  return (
                    <>
                      <p>Page: {page}</p>
                      <table style={{ marginBottom: "22px" }}>
                        <thead>
                          <tr>
                            <th className={styles.table__id}>ID</th>
                            <th className={styles.table__content}>Content</th>
                          </tr>
                        </thead>
                        <tbody>
                          <>
                            {contentsPageWise[page].map((item) => (
                              <tr
                                className={
                                  item._id === currentTableItem &&
                                  styles.current__table__item
                                }
                                key={item._id}
                              >
                                <th className={styles.table__id}>{item.id}</th>
                                <th className={styles.table__content}>
                                  {item.data}
                                </th>
                              </tr>
                            ))}
                          </>
                        </tbody>
                      </table>
                    </>
                  );
                }
              )}
            </>
          ) : (
            <>
            <ol>
              {React.Children.toArray(contents.map((item) => {
                return <li
                  /*   className={selectedContents.map(
                    (selectedItem) =>
                      selectedItem._id === item._id &&
                      styles.current__table__item
                  )} */
                  /*  onClick={() => handleAddContent(item)} */
                  // key={item._id}
                  style={feature && feature === "table-of-contents" ? { width: "100%" } : {}}
                >
                  <span 
                    style={
                      tableOfContentForStep.find(
                        (step) =>
                          step.workflow === docCurrentWorkflow._id &&
                          step._id === item._id &&
                          step.stepIndex === currentStepIndex
                      ) && 
                      feature && feature === "table-of-contents" ? 
                      { 
                        width: "100%" 
                      } : 
                      { }
                    }
                  >
                    {/* { showCheckBoxForContent && <input type={"checkbox"} value={JSON.stringify(item)} onChange={handleCheckboxSelection} /> } */}
                    {showContent.find((content) => content.id === item.id)
                      ?.show ? (
                      <>
                        <p>{item.data}</p>
                        <AiOutlineCloseCircle
                          className="content__Icon"
                          onClick={() => handleShowContent(false, item.id)}
                        />
                      </>
                    ) : (
                      <>
                        <a
                          style={
                            tableOfContentForStep.find(
                              (step) =>
                                step.workflow === docCurrentWorkflow._id &&
                                step._id === item._id &&
                                step.stepIndex === currentStepIndex
                            )
                              ? {
                                  backgroundColor: "#0048ff",
                                  color: "#fff",
                                  padding: "1%",
                                  borderRadius: "5px",
                                  display: "block",
                                  width: "100%",
                                  margin: "1% 0",
                                }
                              : {
                                display: "block",
                                margin: "1% 0",
                              }
                          }
                          onClick={
                            () => handleContentSelection(item)
                          }
                          id={item._id + currentStepIndex}
                        >
                          {item.id}
                        </a>
                        {/* <AiOutlineInfoCircle
                          className="content__Icon"
                          onClick={() => handleShowContent(true, item.id)}
                        /> */}
                        {
                          feature && feature === "table-of-contents" ?
                          <Tooltip anchorId={item._id + currentStepIndex} content={item.data ? item.data : "No data"} place="top" /> : 
                          <></>
                        }
                      </>
                    )}
                  </span>
                </li>
              }))}
            </ol>
            </>
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
