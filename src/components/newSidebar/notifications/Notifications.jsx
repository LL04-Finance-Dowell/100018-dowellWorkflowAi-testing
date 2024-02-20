import React from 'react';
import CollapseItem from '../collapseItem/CollapseItem';
import { v4 as uuidv4 } from 'uuid';
import styles from './notification.module.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Notifications = ({toggleSidebar, isMobile}) => {
  const { t } = useTranslation();
  const { notificationsForUser } = useSelector((state) => state.notification);
  const [notificationItems, setNotificationItems] = useState(items);

  useEffect(() => {
    if (!notificationsForUser) return;

    const currentNotificationItems = notificationItems.slice();

    const updatedItems = currentNotificationItems.map((item) => {
      const foundMatchingNotification = notificationsForUser.find(
        (notification) => notification.title === item.itemKey
      );
      if (!foundMatchingNotification) return item;

      const notificationCount = foundMatchingNotification.items.length;

      if (item.itemKey === 'documents') {
        if (notificationCount < 10)
          item.parent = `Documents (00${notificationCount})`;
        if (notificationCount >= 10)
          item.parent = `Documents (0${notificationCount})`;
        if (notificationCount >= 100)
          item.parent = `Documents (${notificationCount})`;
        const documentsToSign = foundMatchingNotification.items.filter(
          (item) => item.type === 'sign-document'
        ).length;
        if (notificationCount < 10)
          item.children[0].child = `To Be Signed (00${documentsToSign})`;
        if (notificationCount >= 10)
          item.children[0].child = `To Be Signed (0${documentsToSign})`;
        if (notificationCount >= 100)
          item.children[0].child = `To Be Signed (${documentsToSign})`;
      }
      if (item.itemKey === 'workflows') {
        if (notificationCount < 10)
          item.parent = `Workflows (00${notificationCount})`;
        if (notificationCount >= 10)
          item.parent = `Workflows (0${notificationCount})`;
        if (notificationCount >= 100)
          item.parent = `Workflows (${notificationCount})`;
      }
      if (item.itemKey === 'templates') {
        if (notificationCount < 10)
          item.parent = `Templates (00${notificationCount})`;
        if (notificationCount >= 10)
          item.parent = `Templates (0${notificationCount})`;
        if (notificationCount >= 100)
          item.parent = `Templates (${notificationCount})`;
      }
      return item;
    });

    setNotificationItems(updatedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsForUser]);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{t('Notifications')}</h2>
      {/* <div className={styles.line}></div> */}
      <div className={styles.collapse__box}>
        <CollapseItem listType='ol' items={notificationItems} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Notifications;

const [parentUuid1, parentUuid2, parentUuid3] = [uuidv4(), uuidv4(), uuidv4()];
export const items = [
  {
    id: parentUuid1,
    isOpen: false,
    parent: 'Documents (000)',
    href: '/#documents',
    itemKey: 'documents',
    children: [
      {
        id: uuidv4(),
        child: 'To Be Signed (000)',
        href: `/#documents`,
        type: 'notification',
      },
      {
        id: uuidv4(),
        child: 'Rejected by others (000)',
        href: `/#documents`,
        type: 'notification',
      },
      
    ],
  },
  {
    id: parentUuid2,
    isOpen: false,
    parent: 'Templates (000)',
    href: '/#templates',
    itemKey: 'templates',
    children: [
      {
        id: uuidv4(),
        child: 'To Be Approved (000)',
        href: `/#templates`,
        type: 'notification',
      },
      {
        id: uuidv4(),
        child: 'Rejected by others (000)',
        href: `/#templates`,
        type: 'notification',
      },
    ],
  },
  {
    id: parentUuid3,
    isOpen: false,
    parent: 'Workflows (000)',
    href: '/#workflows',
    itemKey: 'workflows',
    children: [
      {
        id: uuidv4(),
        child: 'To Be Signed (000)',
        href: `/#workflows`,
        type: 'notification',
      },
      {
        id: uuidv4(),
        child: 'Rejected by others (000)',
        href: `/#workflows`,
        type: 'notification',
      },
    ],
  },
];
