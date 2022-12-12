import React from "react";
import CollapseItem from "../collapseItem/CollapseItem";
import { v4 as uuidv4 } from "uuid";
import styles from "./notification.module.css";
const Notifications = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Notifications</h2>
      <div className={styles.line}></div>
      <div className={styles.collapse__box}>
        <CollapseItem listType="ol" items={items} />
      </div>
    </div>
  );
};

export default Notifications;

export const items = [
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Documents (003)",
    children: [
      { id: uuidv4(), child: "To Be Signed (002)" },
      { id: uuidv4(), child: "Rejected by others (001)" },
      { id: uuidv4(), child: "To start Processing (003)" },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Templates (004)",
    children: [
      { id: uuidv4(), child: "To Be Approved (002)" },
      { id: uuidv4(), child: "Rejected by others (001)" },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Workflows (003)",
    children: [
      { id: uuidv4(), child: "To Be Signed (002)" },
      { id: uuidv4(), child: "Rejected by others (001)" },
    ],
  },
];
