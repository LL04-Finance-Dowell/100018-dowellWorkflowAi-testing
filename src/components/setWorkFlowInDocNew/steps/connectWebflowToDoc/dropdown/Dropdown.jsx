import React,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDocCurrentWorkflow,
  setDropdowndToggle,
} from '../../../../../features/app/appSlice';
import Collapse from '../../../../../layouts/collapse/Collapse';
import styles from './dropdown.module.css';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';

const Dropdown = ({ disableClick }) => {
  const dispatch = useDispatch();
  const { wfToDocument, docCurrentWorkflow, dropdownToggle } = useSelector(
    (state) => state.app
  );
  /*  const [toggle, setToggle] = useState(false); */

      ////copied workflow
      const copiedWorkflow = useSelector((state) => state.copyProcess.workflow);

      useEffect(()=>{
        const timerId = setTimeout(() => {
          console.log('entered drop down', wfToDocument.workflows)
        if (wfToDocument.workflows  && copiedWorkflow !==null) {
          dispatch(setDocCurrentWorkflow(wfToDocument.workflows[0]));
   
          dispatch(setDropdowndToggle(false));
          console.log('finished dropdown')
        }
      }, 5000);
      return () => clearTimeout(timerId);
      },[copiedWorkflow, wfToDocument])

  const handleToggle = () => {
    if (disableClick) return;
    dispatch(setDropdowndToggle(!dropdownToggle));
  };

  const handleCurrentWorkflow = (item) => {
    dispatch(setDocCurrentWorkflow(item));
   
    dispatch(setDropdowndToggle(false));
  };

  console.log("the wfToDocument.workflows are ",wfToDocument.workflows)
  

  return (
    <>
      {wfToDocument.document && wfToDocument.workflows.length > 0 && (
        <div className={styles.container}>
          <button
            onClick={handleToggle}
            className={`${styles.current__item__box} ${styles.box}`}
            style={{ cursor: disableClick ? 'not-allowed' : 'initial' }}
          >
            <span>
              {docCurrentWorkflow
                ? docCurrentWorkflow?.workflows.workflow_title
                : 'Select a Workflow'}
            </span>
            <i>
              {dropdownToggle ? (
                <TiArrowSortedUp size={22} />
              ) : (
                <TiArrowSortedDown size={22} />
              )}
            </i>
          </button>

          <div style={{ marginBottom: '20px' }}>
            <Collapse open={dropdownToggle}>
              <div className={styles.options__container}>
                {wfToDocument.workflows?.map((item) => (
                  <div
                    /* style={{
                backgroundColor:
                  item._id === docCurrentWorkflow?.workflows._id &&
                  "var(--e-global-color-accent)",
              }} */
                    key={item._id}
                    onClick={() => handleCurrentWorkflow(item)}
                    className={`${styles.option__box} ${styles.box} ${
                      item._id === docCurrentWorkflow?._id && styles.current
                    }`}
                  >
                    <span>{item.workflows.workflow_title}</span>
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
