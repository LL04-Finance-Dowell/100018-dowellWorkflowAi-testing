import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';

const ContentPagination = ({ pages, currentPage, updateCurrentPage }) => {
  const [initialPageRangeSet, setInitialPageRangeSet] = useState(false);
  const [currentPagesRange, setCurrentPagesRange] = useState(null);

  const createArrayFromNumberRange = (startNum, endNum) => {
    const outputArr = [];

    for (let i = startNum; i <= endNum; i++) outputArr.push(i);

    return outputArr;
  };

  useEffect(() => {
    if (
      !pages ||
      initialPageRangeSet ||
      isNaN(Number(pages)) ||
      (!isNaN(Number(pages)) && pages < 1)
    )
      return;

    if (pages < 7) {
      setCurrentPagesRange({
        startPage: 1,
        endPage: pages,
      });
      setInitialPageRangeSet(true);
      return;
    }

    setCurrentPagesRange({
      startPage: 1,
      endPage: 6,
    });

    setInitialPageRangeSet(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  if (!currentPagesRange) return <></>;

  return (
    <>
      <div className={styles.content__Pagination__Wrapper}>
        {currentPagesRange?.startPage > 1 && (
          <>
            <div
              className={`${styles.arrow__Container} ${styles.left__Arrow}`}
              onClick={
                currentPagesRange?.startPage > 0
                  ? () =>
                      setCurrentPagesRange((prevRange) => {
                        return {
                          ...prevRange,
                          startPage: prevRange.startPage - 1,
                          endPage: prevRange.endPage - 1,
                        };
                      })
                  : () => {}
              }
            >
              <IoIosArrowBack />
            </div>
          </>
        )}
        <div className={styles.pages__Container}>
          {React.Children.toArray(
            createArrayFromNumberRange(
              currentPagesRange?.startPage,
              currentPagesRange?.endPage
            ).map((page) => {
              return (
                <>
                  <span
                    className={`${styles.page__Item} ${
                      currentPage === page ? styles.active__Page : ''
                    }`}
                    onClick={() => updateCurrentPage(page)}
                  >
                    {page}
                  </span>
                </>
              );
            })
          )}
        </div>
        {currentPagesRange?.endPage >= 6 && (
          <>
            <div
              className={`${styles.arrow__Container} ${styles.right__Arrow}`}
              onClick={
                currentPagesRange?.endPage < pages
                  ? () =>
                      setCurrentPagesRange((prevRange) => {
                        return {
                          ...prevRange,
                          startPage: prevRange.startPage + 1,
                          endPage: prevRange.endPage + 1,
                        };
                      })
                  : () => {}
              }
            >
              <IoIosArrowForward />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ContentPagination;
