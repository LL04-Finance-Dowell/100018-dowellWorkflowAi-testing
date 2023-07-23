import React, { useState } from 'react';
import Collapse from '../../../layouts/collapse/Collapse';
import styles from './new.module.css';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus } from 'react-icons/fa';
import { HashLink } from 'react-router-hash-link';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate } from '../../../features/template/asyncThunks';
import { setToggleManageFileForm } from '../../../features/app/appSlice';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../utils/helpers';
import { useAppContext } from '../../../contexts/AppContext';

const New = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const { themeColor } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const { setShowFoldersActionModal } = useAppContext();

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNewItemClick = (e, content) => {
    if (content === 'template') {
      e.preventDefault();
      const data = {
        created_by: userDetail?.userinfo.username,
        company_id:
          userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.org_id
            : userDetail?.portfolio_info[0].org_id,
        data_type:
          userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.data_type
            : userDetail?.portfolio_info[0].data_type,
        portfolio: 
          userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.portfolio_name
            : userDetail?.portfolio_info[0].portfolio_name,
      };

      dispatch(createTemplate(data));
    } else {
      dispatch(setToggleManageFileForm(true));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div
          onClick={handleOpen}
          className={styles.new__button__box}
          style={{ backgroundColor: themeColor }}
        >
          <i>
            <FaPlus size={20} />
          </i>
          <span>{t('new')}</span>
        </div>
        <Collapse open={isOpen}>
          <div className={styles.new__content}>
            {items.map((item) => (
              <HashLink
                onClick={(e) => handleNewItemClick(e, item.content)}
                to={item.href}
                key={item.id}
              >
                {t(item.content)}
              </HashLink>
            ))}
            <button
              onClick={() =>
                setShowFoldersActionModal({ state: true, action: 'create' })
              }
            >
              Folder
            </button>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default New;

const items = [
  { id: uuidv4(), content: 'template', href: '/templates/#newTemplate' },
  { id: uuidv4(), content: 'document', href: '/documents/#newDocument' },
  { id: uuidv4(), content: 'workflow', href: '/workflows/#newWorkflow' },
  { id: uuidv4(), content: 'process', href: '/workflows/new-set-workflow' },
];
