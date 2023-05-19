import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromTableOfContentForStep,
  setTableOfContentForStep,
  updateSingleTableOfContentRequiredStatus,
} from "../../../features/app/appSlice";
import styles from "./contents.module.css";
import { Tooltip } from 'react-tooltip'
import { toast } from "react-toastify";
import ContentPagination from "./contentPagination/ContentPagination";

const Contents = ({
  contents,
  toggleContent,
  feature,
  currentStepIndex,
  showCheckBoxForContent,
  stepsPopulated,
}) => {
  const contentRef = useRef(null);
  const [currentTableItem, setCurrentTableItem] = useState(null);
  const dispatch = useDispatch();
  const { docCurrentWorkflow, tableOfContentForStep } = useSelector(
    (state) => state.app
  );
  const [contentsPageWise, setContentsPageWise] = useState([]);
  const [showContent, setShowContent] = useState([]);
  const [ currentPage, setCurrentPage ] = useState(1);

  /*  const handleAddContent = (content) => {
    console.log(content);
    const isInclude = selectedContents.map((item) => item._id === content._id);

    setSelectedContents((prev) =>
      prev.map((item) => (item._id === content._id ? prev : [...prev, content]))
    );

    console.log(selectedContents);
  }; */

  const handleContentSelection = (valueAsJSON, contentPage) => {
    const contentStepAlreadyAdded = tableOfContentForStep.find(
      (step) =>
        step.workflow === docCurrentWorkflow._id &&
        step.id === valueAsJSON.id &&
        step.stepIndex === currentStepIndex
    );

    if (contentStepAlreadyAdded) {
      return dispatch(removeFromTableOfContentForStep({ id: valueAsJSON.id, stepIndex: currentStepIndex }));
    }

    const newTableOfContentObj = {
      ...valueAsJSON,
      workflow: docCurrentWorkflow._id,
      stepIndex: currentStepIndex,
      required: false,
      page: contentPage,
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

    setCurrentPage(1);
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

  const handleContentCheckboxChange = (checkboxElem, itemId) => {
    // checking if the item has been selected
    const contentStepSelected = tableOfContentForStep.find(
      (step) =>
        step.workflow === docCurrentWorkflow._id &&
        step.id === itemId &&
        step.stepIndex === currentStepIndex
    );

    if (!contentStepSelected) {
      checkboxElem.checked = false;
      return toast.info(`Please select ${itemId} first`)
    }
    
    dispatch(
      updateSingleTableOfContentRequiredStatus({
        stepIndex: currentStepIndex,
        workflow: docCurrentWorkflow._id,
        id: itemId,
        value: checkboxElem.checked
      })
    )
  }

  // console.log("contentscontents", contentsPageWise);

  return (
    <div
      style={{
        maxHeight: 
          feature === "table-of-contents" ? "13rem" 
          :
          toggleContent ? `${contentRef.current?.getBoundingClientRect().height}px`
          : "0px",
        padding: feature && feature === "table-of-contents" ? "0" : "",
        overflow: feature === "table-of-contents" ? "" : ""
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
                            {React.Children.toArray(contentsPageWise[page].map((item) => (
                              <tr
                                className={
                                  item._id === currentTableItem &&
                                  styles.current__table__item
                                }
                                // key={item._id}
                              >
                                <th className={styles.table__id}>{item.id}</th>
                                <th className={styles.table__content}>
                                  {Array.isArray(item.data) ? item.data.find(i => i.data.length > 1)?.data : item.data}
                                </th>
                              </tr>
                            )))}
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
            <p style={{ fontSize: "0.85rem", marginBottom: '0.3rem' }}>Select Page</p>
            <ContentPagination 
              pages={Object.keys(contentsPageWise || {}).length} 
              currentPage={currentPage}
              updateCurrentPage={setCurrentPage}
            />
            <ol className={styles.table__Of__Content__List}>
              {React.Children.toArray(contentsPageWise[currentPage]?.map((item) => (
                <li
                  style={
                    feature && feature === "table-of-contents" ? { 
                      width: "100%",
                      padding: "2px 5px 2px 0",
                    } 
                    : {

                    }
                  }
                >
                  <span 
                    style={
                      // tableOfContentForStep.find(
                      //   (step) =>
                      //     step.workflow === docCurrentWorkflow._id &&
                      //     step.id === item.id &&
                      //     step.stepIndex === currentStepIndex
                      // ) && 
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
                        <p>{Array.isArray(item.data) ? item.data.find(i => i.data.length > 1)?.data : item.data}</p>
                        <AiOutlineCloseCircle
                          className="content__Icon"
                          onClick={() => handleShowContent(false, item.id)}
                        />
                      </>
                    ) : (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}>
                        <a
                          style={
                            tableOfContentForStep.find(
                              (step) =>
                                step.workflow === docCurrentWorkflow._id &&
                                step.id === item.id &&
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
                            () => handleContentSelection(item, currentPage)
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
                          feature && feature === "table-of-contents" ? <>
                            <input 
                              id={item._id + currentStepIndex + item._id} 
                              type="checkbox" 
                              onChange={({ target}) => handleContentCheckboxChange(target, item.id)} 
                              checked={tableOfContentForStep.find(
                                (step) =>
                                  step.workflow === docCurrentWorkflow._id &&
                                  step.id === item.id &&
                                  step.stepIndex === currentStepIndex
                              )?.required}
                            />
                            <Tooltip anchorId={item._id + currentStepIndex} content={item.data ? Array.isArray(item.data) ? item.data.find(i => i.data.length > 1)?.data : item.data : "No data"} place="top" />  
                            <Tooltip anchorId={item._id + currentStepIndex + item._id} content={"Required or not required"} place="top" />  
                          </> : 
                          <></>
                        }
                      </div>
                    )}
                  </span>
                </li>
              )))}
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
