// ? Ln 167 Used <span> instead of <button> (style conflicts) and <a> (ESLint prompts)
import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import styles from './contents.module.css';
import { removeFromTableOfContentForStep, setTableOfContentForStep } from '../../../features/processes/processesSlice';

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
    (state) => state.processes
  );
  const [contentsPageWise, setContentsPageWise] = useState([]);
  const [showContent, setShowContent] = useState([]);

  /*  const handleAddContent = (content) => {
    
    const isInclude = selectedContents.map((item) => item._id === content._id);

    setSelectedContents((prev) =>
      prev.map((item) => (item._id === content._id ? prev : [...prev, content]))
    );

    
  }; */

  const handleContentSelection = (valueAsJSON) => {
    const contentStepAlreadyAdded = tableOfContentForStep.find(
      (step) =>
        step.workflow === docCurrentWorkflow._id &&
        step._id === valueAsJSON._id &&
        step.stepIndex === currentStepIndex
    );

    if (contentStepAlreadyAdded) {
      return dispatch(
        removeFromTableOfContentForStep({
          id: valueAsJSON._id,
          stepIndex: currentStepIndex,
        })
      );
    }

    const newTableOfContentObj = {
      ...valueAsJSON,
      workflow: docCurrentWorkflow._id,
      stepIndex: currentStepIndex,
    };
    // // console.log(newTableOfContentObj)
    dispatch(setTableOfContentForStep(newTableOfContentObj));
  };

  useEffect(() => {
    const contentsGroupedByPageNum = contents.reduce((r, a) => {
      r[a.pageNum] = r[a.pageNum] || [];
      r[a.pageNum].push(a);
      return r;
    }, Object.create(null));
    // // console.log(contentsGroupedByPageNum)
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



  return (
    <div
      style={{
        maxHeight: toggleContent
          ? `${contentRef.current?.getBoundingClientRect().height}px`
          : '0px',
      }}
      className={styles.content__container}
    >
      <div ref={contentRef} className={styles.content__box}>
        {contents.length > 0 ? (
          feature === 'doc' ? (
            <>
              {React.Children.toArray(Object.keys(contentsPageWise || {})).map(
                (page) => {
                  return (
                    <>
                      <p>Page: {page}</p>
                      <table style={{ marginBottom: '22px' }}>
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
                                key={item._id}
                              >
                                <th className={styles.table__id}>{item.id}</th>
                                <th className={styles.table__content}>
                                  {item.data}
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
                    {showContent.find((content) => content.id === item.id)
                      ?.show ? (
                      <>
                        <p>{item.data}</p>
                        <AiOutlineCloseCircle
                          className='content__Icon'
                          onClick={() => handleShowContent(false, item.id)}
                        />
                      </>
                    ) : (
                      <>
                        <span
                          style={
                            tableOfContentForStep.find(
                              (step) =>
                                step.workflow === docCurrentWorkflow._id &&
                                step._id === item._id &&
                                step.stepIndex === currentStepIndex
                            )
                              ? {
                                backgroundColor: '#0048ff',
                                color: '#fff',
                                padding: '2% 30%',
                                borderRadius: '5px',
                                width: '100%',
                                cursor: 'pointer',
                              }
                              : { cursor: 'pointer' }
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handleContentSelection(item);
                          }}
                        >
                          {item.id}
                        </span>
                        <AiOutlineInfoCircle
                          className='content__Icon'
                          onClick={() => handleShowContent(true, item.id)}
                        />
                      </>
                    )}
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
