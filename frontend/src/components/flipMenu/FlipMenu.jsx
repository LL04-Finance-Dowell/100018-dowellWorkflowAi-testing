import Flip from '../flip/Flip';

import styles from './flipMenu.module.css';
import {
  FaFileContract,
  FaRegBell,
  FaHeadSideVirus,
  FaSearch,
} from 'react-icons/fa';
import { FcWorkflow } from 'react-icons/fc';
import { HiOutlineDocument } from 'react-icons/hi';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorLink, setToggleManageFileForm } from '../../features/app/appSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { createTemplate } from '../../features/template/asyncThunks';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { openEditorInNewTab, productName } from '../../utils/helpers';

const FlipMenu = () => {
  const [filpItemsToDisplay, setFlipItemsToDisplay] = useState(flipItems);
  const { notificationsForUser } = useSelector((state) => state.notification);

  useEffect(() => {
    if (!notificationsForUser) return;

    const currentFlipItems = filpItemsToDisplay.slice();
    const totalNotificationCount = notificationsForUser.reduce(
      (a, b) => a + b.items.length,
      0
    );

    const updatedFlipItems = currentFlipItems.map((item) => {
      if (item.role === 'viewNotifications') {
        if (totalNotificationCount < 10)
          item.text = `00${totalNotificationCount}`;
        if (totalNotificationCount >= 10)
          item.text = `0${totalNotificationCount}`;
        if (totalNotificationCount >= 100)
          item.text = `${totalNotificationCount}`;
        return item;
      }
      return item;
    });

    setFlipItemsToDisplay(updatedFlipItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsForUser]);

  return (
    <div className={styles.container}>
      {filpItemsToDisplay.map((item) => (
        <div key={item.id} className={styles.flip__container}>
          <Flip
            Back={() => <FlipBack {...item} />}
            Front={() => <FlipFront {...item} />}
          />
        </div>
      ))}
      {/* <p className='text-4xl' style={{position:'fixed',top:'80vh',left:'70rem'}}>hello</p> */}
      {/* <Chat/> */}
    </div>
  );
};

export default FlipMenu;

export const FlipFront = (props) => {
  const { t } = useTranslation();

  return (
    <div
      style={{ background: `${props.frontBg}` }}
      className={styles.flip__box}
    >
      <div className={styles.flip__box}>
        <i>
          <props.icon size={28} />
        </i>
        <h2 className={styles.flip__text}>{t(props.text)}</h2>
      </div>
    </div>
  );
};

export const FlipBack = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { notificationsForUser } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);

  const handleClick = async (role) => {
    if (role === 'newDoc') {

      navigate('/documents/#newDocument');
      dispatch(setToggleManageFileForm(true));
    }
    if (role === 'viewNotifications') {
      navigate('/#documents', {
        state: {
          elementIdToScrollTo:
            Array.isArray(notificationsForUser) &&
              notificationsForUser.length > 0
              ? `notifications-documents-${notificationsForUser[0]?.id}`
              : '',
        },
      });
    }
    if (role === "") {
      navigate('/documents/demo#demo')
    }
    if (role === 'newTemp') {
      const data = {
        created_by: userDetail?.userinfo.username,
        company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
        data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
        portfolio: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find((portfolio) => portfolio.product === productName)?.portfolio_name : userDetail?.portfolio_info[0].portfolio_name,
      };
      dispatch(createTemplate(data)).then(data => {
        const editorURL = data.payload.editor_link;
        openEditorInNewTab(editorURL, "Untitled Template", 'Template');
      });
    }
    if (role === 'newWorkf') {
      navigate('/workflows/#newWorkflow');
      dispatch(setToggleManageFileForm(true));
    }
    if (role === 'search') {
      navigate('/search');
    }
  };

  return (
    <div
      style={{ background: '#7A7A7A' }}
      className={`${styles.flip__box} ${styles.back__box} ${props.buttonTexts ? styles.grow__back__box : ''
        }`}
    >
      {props.buttonTexts ? (
        React.Children.toArray(
          props.buttonTexts.map((buttonText, index) => {
            return (
              <button
                onClick={() => handleClick(props.roles[index])}
                type='button'
                className={styles.flip__button}
                id={buttonText.id}
              >
                {buttonIcons[index]}
                <Tooltip
                  anchorId={buttonText.id}
                  content={t(buttonText.text)}
                  offset={0}
                />
              </button>
            );
          })
        )
      ) : (
        <button
          onClick={() => handleClick(props.role)}
          type='button'
          className={styles.flip__button}
        >
          {t(props.buttonText)}
        </button>
      )}
    </div>
  );
};

export const flipItems = [
  {
    id: uuidv4(),
    icon: FaRegBell,
    frontBg: '#1ABC9C',
    text: '000',
    buttonText: 'view',
    role: 'viewNotifications',
  },
  {
    id: uuidv4(),
    icon: HiOutlineDocument,
    frontBg: '#7A7A7A',
    text: 'new',
    buttonTexts: [
      { id: uuidv4(), text: 'Document' },
      { id: uuidv4(), text: 'Template' },
      { id: uuidv4(), text: 'Workflow' },
    ],
    roles: ['newDoc', 'newTemp', 'newWorkf'],
  },
  {
    id: uuidv4(),
    icon: FaSearch,
    frontBg: '#61CE70',
    text: 'search',
    buttonText: 'search document',
    role: 'search',
  },
  {
    id: uuidv4(),
    icon: FaHeadSideVirus,
    frontBg: '#C3D6BE',
    text: 'support',
    buttonText: 'dowell knowledge centre',
    role: '',
  },
];

const buttonIcons = [<HiOutlineDocument />, <FaFileContract />, <FcWorkflow />];
