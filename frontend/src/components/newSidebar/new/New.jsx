import React, { useState } from "react";
import Collapse from "../../../layouts/collapse/Collapse";
import styles from "./new.module.css";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa";

const New = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div onClick={handleOpen} className={styles.new__button__box}>
          <i>
            <FaPlus size={20} />
          </i>
          <span>New</span>
        </div>
        <Collapse open={isOpen}>
          <div className={styles.new__content}>
            {items.map((item) => (
              <p key={item.id}>{item.content}</p>
            ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default New;

const items = [
  { id: uuidv4(), content: "document" },
  { id: uuidv4(), content: "template" },
  { id: uuidv4(), content: "workflow" },
  { id: uuidv4(), content: "process" },
];
