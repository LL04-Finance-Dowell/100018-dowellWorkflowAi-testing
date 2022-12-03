import React, { useState } from "react";
import Collapse from "../../../layouts/collapse/Collapse";
import styles from "./new.module.css";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { useAppContext } from "../../../contexts/AppContext";

const New = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setToggleNewFileForm } = useAppContext();

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNewItemClick = () => {
    setToggleNewFileForm(true);
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
              <HashLink
                onClick={handleNewItemClick}
                to={item.href}
                key={item.id}
              >
                {item.content}
              </HashLink>
            ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default New;

const items = [
  { id: uuidv4(), content: "document", href: "/documents/#newDocument" },
  { id: uuidv4(), content: "template", href: "/" },
  { id: uuidv4(), content: "workflow", href: "/workflows/#newWorkflow" },
  { id: uuidv4(), content: "process", href: "/workflows/set-workflow" },
];
