import React, { useState, useEffect, useRef } from 'react';
import styles from './style.module.css';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';

const DisplaySearch = ({ result, handleSearchItemClick }) => {
  const [isShow, setIsShow] = useState({
    docs: false,
    temps: false,
    wrkfs: false,
  });
  const [allDocs, setAllDocs] = useState([]);
  const [allTemps, setAllTemps] = useState([]);
  const [allWrkfs, setAllWrkfs] = useState([]);
  const searchResultRef = useRef([]);
  const dumWrapperRef = useRef([]);

  useEffect(() => {
    setAllDocs(result.filter((item) => item.document_name));
    setAllTemps(result.filter((item) => item.template_name));
    setAllWrkfs(result.filter((item) => item.workflows));
  }, [result]);

  useEffect(() => {
    const dummyWrapperEls = [...new Set(dumWrapperRef.current)].filter(
      (item) => item
    );
    const searchResultEls = [...new Set(searchResultRef.current)].filter(
      (item) => item
    );
    const { docs, temps, wrkfs } = isShow;
    const dummyDocEl = dummyWrapperEls.find((el) => el.dataset.tag === 'docs');
    const searchDocEl = searchResultEls.find((el) => el.dataset.tag === 'docs');
    const dummyTempEl = dummyWrapperEls.find(
      (el) => el.dataset.tag === 'temps'
    );
    const searchTempEl = searchResultEls.find(
      (el) => el.dataset.tag === 'temps'
    );
    const dummyWrkfEl = dummyWrapperEls.find(
      (el) => el.dataset.tag === 'wrkfs'
    );
    const searchWrkfEl = searchResultEls.find(
      (el) => el.dataset.tag === 'wrkfs'
    );

    if (docs)
      searchDocEl.style.height =
        dummyDocEl.getBoundingClientRect().height + 'px';
    else searchDocEl.style.height = 0;

    if (temps)
      searchTempEl.style.height =
        dummyTempEl.getBoundingClientRect().height + 'px';
    else searchTempEl.style.height = 0;

    if (wrkfs)
      searchWrkfEl.style.height =
        dummyWrkfEl.getBoundingClientRect().height + 'px';
    else searchWrkfEl.style.height = 0;
  }, [dumWrapperRef, searchResultRef, isShow]);

  return (
    <>
      <div className={styles.disp_search_wrapper}>
        <article className={styles.disp_search_opt}>
          <button
            className={styles.search_opt_heading}
            style={{ backgroundColor: 'var(--e-global-color-accent)' }}
            onClick={() => setIsShow({ ...isShow, docs: !isShow.docs })}
          >
            Documents{' '}
            <span className='toggle_icon'>
              {isShow.docs ? <AiOutlineUp /> : <AiOutlineDown />}
            </span>
          </button>

          <div
            className={styles.search_results}
            ref={(el) => searchResultRef.current.push(el)}
            data-tag='docs'
          >
            <div
              className={styles.dum_wrapper}
              ref={(el) => dumWrapperRef.current.push(el)}
              data-tag='docs'
            >
              <DispSearchComp
                items={allDocs}
                handleSearchItemClick={handleSearchItemClick}
              />
            </div>
          </div>
        </article>

        <article className={styles.disp_search_opt}>
          <button
            className={styles.search_opt_heading}
            style={{ backgroundColor: 'var(--e-global-color-62c33d9)' }}
            onClick={() => setIsShow({ ...isShow, temps: !isShow.temps })}
          >
            Templates{' '}
            <span className='toggle_icon'>
              {isShow.temps ? <AiOutlineUp /> : <AiOutlineDown />}
            </span>
          </button>
          <div
            className={styles.search_results}
            ref={(el) => searchResultRef.current.push(el)}
            data-tag='temps'
          >
            <div
              className={styles.dum_wrapper}
              ref={(el) => dumWrapperRef.current.push(el)}
              data-tag='temps'
            >
              <DispSearchComp
                items={allTemps}
                handleSearchItemClick={handleSearchItemClick}
              />
            </div>
          </div>
        </article>

        <article className={styles.disp_search_opt}>
          <button
            className={styles.search_opt_heading}
            style={{ backgroundColor: 'var(--e-global-color-1342d1f)' }}
            onClick={() => setIsShow({ ...isShow, wrkfs: !isShow.wrkfs })}
          >
            Workflows{' '}
            <span className='toggle_icon'>
              {isShow.wrkfs ? <AiOutlineUp /> : <AiOutlineDown />}
            </span>
          </button>

          <div
            className={styles.search_results}
            ref={(el) => searchResultRef.current.push(el)}
            data-tag='wrkfs'
          >
            <div
              className={styles.dum_wrapper}
              ref={(el) => dumWrapperRef.current.push(el)}
              data-tag='wrkfs'
            >
              <DispSearchComp
                items={allWrkfs}
                handleSearchItemClick={handleSearchItemClick}
              />
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

const DispSearchComp = ({ items, handleSearchItemClick }) => {
  return (
    <>
      {items.map((searchResultItem) => {
        return (
          <button
            id={searchResultItem._id}
            onClick={() => handleSearchItemClick(searchResultItem)}
            style={{
              width: '100%',
              margin: '0',
              background: 'transparent',
              borderBottom: '1px solid var(--e-global-color-0363588)',
              padding: '3%',
            }}
            className={styles.search_result_btn}
          >
            <span
              className={`${styles.search__Item__Info} 
                                                    ${
                                                      searchResultItem.document_name
                                                        ? styles.search__Item__Doc
                                                        : searchResultItem.template_name
                                                        ? styles.search__Item__Temp
                                                        : searchResultItem.workflows
                                                        ? styles.search__Item__Workf
                                                        : ''
                                                    }`}
            >
              {searchResultItem.document_name
                ? 'Document'
                : searchResultItem.template_name
                ? 'Template'
                : searchResultItem.workflows
                ? 'Workflow'
                : ''}
            </span>
            <span>
              {searchResultItem.document_name
                ? searchResultItem.document_name
                : searchResultItem.template_name
                ? searchResultItem.template_name
                : searchResultItem.workflows
                ? searchResultItem.workflows?.workflow_title
                : ''}
              <Tooltip
                anchorId={searchResultItem._id}
                content={
                  searchResultItem.document_name
                    ? searchResultItem.document_name
                    : searchResultItem.template_name
                    ? searchResultItem.template_name
                    : searchResultItem.workflows?.workflow_title
                    ? searchResultItem.workflows?.workflow_title
                    : ''
                }
                place='top'
              />
            </span>
          </button>
        );
      })}
    </>
  );
};

export default DisplaySearch;
