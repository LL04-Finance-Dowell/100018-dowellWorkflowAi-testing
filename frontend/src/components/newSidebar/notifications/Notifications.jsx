import React from "react";
import CollapseItem from "../collapseItem/CollapseItem";
import { v4 as uuidv4 } from "uuid";
import styles from "./notification.module.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";

const Notifications = () => {
  const { notificationsForUser } = useSelector((state) => state.app);
  const [ notificationItems, setNotificationItems ] = useState(items);
  
  useEffect(() => {

    if (!notificationsForUser) return

    const currentNotificationItems = notificationItems.slice();

    const updatedItems = currentNotificationItems.map(item => {
      const foundMatchingNotification = notificationsForUser.find(notification => notification.title === item.itemKey);
      if (!foundMatchingNotification) return item
      
      const notificationCount = foundMatchingNotification.items.length;

      if (item.itemKey === "documents") {
        if (notificationCount < 10) item.parent = `Documents (00${notificationCount})`
        if (notificationCount >= 10) item.parent = `Documents (0${notificationCount})`
        if (notificationCount >= 100) item.parent = `Documents (${notificationCount})`
        const documentsToSign = foundMatchingNotification.items.filter(item => item.type === "sign-document").length
        if (notificationCount < 10) item.children[0].child = `To Be Signed (00${documentsToSign})`
        if (notificationCount >= 10) item.children[0].child = `To Be Signed (0${documentsToSign})`
        if (notificationCount >= 100) item.children[0].child = `To Be Signed (${documentsToSign})`
      }
      if (item.itemKey === "workflows") {
        if (notificationCount < 10) item.parent = `Workflows (00${notificationCount})`
        if (notificationCount >= 10) item.parent = `Workflows (0${notificationCount})`
        if (notificationCount >= 100) item.parent = `Workflows (${notificationCount})`
      }
      if (item.itemKey === "templates") {
        if (notificationCount < 10) item.parent = `Templates (00${notificationCount})`
        if (notificationCount >= 10) item.parent = `Templates (0${notificationCount})`
        if (notificationCount >= 100) item.parent = `Templates (${notificationCount})`
      }
      return item
    })

    setNotificationItems(updatedItems)

  }, [notificationsForUser])

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Notifications</h2>
      <div className={styles.line}></div>
      <div className={styles.collapse__box}>
        <CollapseItem listType="ol" items={notificationItems} />
      </div>
    </div>
  );
};

export default Notifications;

const [ parentUuid1, parentUuid2, parentUuid3 ] = [ uuidv4(), uuidv4(), uuidv4() ]
export const items = [
  {
    id: parentUuid1,
    isOpen: false,
    parent: "Documents (000)",
    itemKey: "documents",
    children: [
      { id: uuidv4(), child: "To Be Signed (000)", href: `notifications-documents-${parentUuid1}`, type: "notification" },
      { id: uuidv4(), child: "Rejected by others (000)", href: `notifications-documents-${parentUuid1}`, type: "notification" },
      { id: uuidv4(), child: "To start Processing (000)", href: `notifications-documents-${parentUuid1}`, type: "notification" },
    ],
  },
  {
    id: parentUuid2,
    isOpen: false,
    parent: "Templates (000)",
    itemKey: "templates",
    children: [
      { id: uuidv4(), child: "To Be Approved (000)", href: `notifications-templates-${parentUuid2}`, type: "notification" },
      { id: uuidv4(), child: "Rejected by others (000)", href: `notifications-templates-${parentUuid2}`, type: "notification" },
    ],
  },
  {
    id: parentUuid3,
    isOpen: false,
    parent: "Workflows (000)",
    itemKey: "workflows",
    children: [
      { id: uuidv4(), child: "To Be Signed (000)", href: `notifications-workflows-${parentUuid3}`, type: "notification" },
      { id: uuidv4(), child: "Rejected by others (000)", href: `notifications-workflows-${parentUuid3}`, type: "notification" },
    ],
  },
];
