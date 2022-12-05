import styles from "./handleTasks.module.css";
import Collapse from "../../../layouts/collapse/Collapse";
import { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";

const HandleTasks = ({ feature, tasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [compTasks, setCompTask] = useState(tasks);

  const handleToggle = (id) => {
    setCompTask((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const colorClass =
    feature === "complated" ? styles.complated : styles.incomplate;

  return (
    <div className={styles.container}>
      <h2 className={`${styles.item__box__title} ${colorClass}`}>
        {feature} Tasks
      </h2>
      {compTasks.map((item) => (
        <div key={item.id} className={styles.item__box}>
          <div
            onClick={() => handleToggle(item.id)}
            className={`${styles.item__parent} ${
              item.isOpen && styles.active
            } ${feature === "incomplate" && styles.incomplate__parent}`}
          >
            <i>
              {item.isOpen ? (
                <IoMdArrowDropup size={25} />
              ) : (
                <IoMdArrowDropright size={25} />
              )}
            </i>
            <a>{item.parent}</a>
          </div>
          <div className={styles.item__children__container}>
            <Collapse open={item.isOpen}>
              <div className={styles.item__children__box}>
                <ol>
                  {item.children.map((item) => (
                    <li key={item.id} className={colorClass}>
                      {item.child}
                    </li>
                  ))}
                </ol>
              </div>
            </Collapse>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HandleTasks;
