import React, { useState } from "react";
import Collapse from "../../../layouts/collapse/Collapse";
import styles from "./new.module.css";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { useAppContext } from "../../../contexts/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate } from "../../../features/template/asyncThunks";

export const dataMaanish = {
  created_by: "Maanish",
  company_id: "6365ee18ff915c925f3a6691",
};

const New = () => {
  const dispatch = useDispatch();
  /*   const { status } = useSelector((state) => state.template); */

  const [isOpen, setIsOpen] = useState(false);
  const { setToggleNewFileForm } = useAppContext();

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  /*  console.log(status); */

  const handleNewItemClick = (e, content) => {
    if (content === "template") {
      e.preventDefault();

      dispatch(createTemplate(dataMaanish));
    } else {
      setToggleNewFileForm(true);
    }
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
                onClick={(e) => handleNewItemClick(e, item.content)}
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
