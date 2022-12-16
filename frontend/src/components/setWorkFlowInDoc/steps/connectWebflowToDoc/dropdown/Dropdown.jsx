import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocCurrentWorkflow } from "../../../../../features/app/appSlice";
import Collapse from "../../../../../layouts/collapse/Collapse";
import styles from "./dropdown.module.css";

const Dropdown = () => {
  const dispatch = useDispatch();
  const { wfToDocument, docCurrentWorkflow } = useSelector(
    (state) => state.app
  );
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handleCurrentWorkflow = (item) => {
    dispatch(setDocCurrentWorkflow(item));
    console.log("itemmmmmm", item);
    setToggle(false);
  };

  console.log(wfToDocument, docCurrentWorkflow, "aaaaaaaaaaaaaaaaa");

  return (
    <div className={styles.container}>
      <div
        onClick={handleToggle}
        className={`${styles.current__item__box} ${styles.box}`}
      >
        <span>{docCurrentWorkflow?.workflows.workflow_title}</span>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Collapse open={toggle}>
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
  );
};

export default Dropdown;
