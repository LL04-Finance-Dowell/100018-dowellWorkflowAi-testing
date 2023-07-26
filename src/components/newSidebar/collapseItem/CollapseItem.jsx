import { useState } from 'react';
import styles from './collapseItem.module.css';
import Collapse from '../../../layouts/collapse/Collapse';
import { HashLink } from 'react-router-hash-link';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { detailTemplate } from '../../../features/template/asyncThunks';
import { detailDocument } from '../../../features/document/asyncThunks';
import { setToggleManageFileForm } from '../../../features/app/appSlice';
import { detailWorkflow } from '../../../features/workflow/asyncTHunks';
import { useDispatch } from 'react-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';

function ListItem({ item }) {
  let children = null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (item.children && item.children.length) {
    children = (
      <ul>
        {item.children.map((i) => (
          <ListItem item={i} key={i.id} />
        ))}
      </ul>
    );
  }

  const handleLinkItemClick = (e, item) => {
    e.preventDefault();

    if (!item.href) return;

    if (item.searchItem && item.itemObj) {
      const searchItemObj = item.itemObj;
      if (searchItemObj.document_name) {
        dispatch(detailDocument(searchItemObj._id));
        return;
      }
      if (searchItemObj.template_name) {
        dispatch(detailTemplate(searchItemObj._id));
        return;
      }
      if (searchItemObj.workflows) {
        dispatch(setToggleManageFileForm(true));
        dispatch(detailWorkflow(searchItemObj._id));
        return;
      }
      return;
    }
    navigate(item.href);
  };

  return (
    <div key={item.id}>
      <li style={{ color: item.asParent && styles.as__parent }}>
        <HashLink
          className={styles.hash__link}
          to={item.href ? item.href : '#'}
          onClick={(e) => handleLinkItemClick(e, item)}
        >
          {t(item.child)}
        </HashLink>
      </li>
      <HashLink className={styles.hash__link} to={item.href ? item.href : '#'}>
        {children}
      </HashLink>
    </div>
  );
}

const CollapseItem = ({ items, listType, exception }) => {
  const { t } = useTranslation();
  const { customDocName, customTempName, customWrkfName } = useAppContext();

  const [menuItems, setMenuItems] = useState(items);
  const handleParentClick = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  useEffect(() => {
    setMenuItems(items);
  }, [items]);

  return (
    <div className={styles.container}>
      {React.Children.toArray(
        menuItems.map((item) => (
          <>
            <HashLink
              to={item.href && item.href}
              // key={item.id}
              className={`${styles.parent__item__box} ${
                item.isOpen && styles.active
              }`}
              onClick={() => handleParentClick(item.id)}
            >
              <i>
                {item.isOpen ? (
                  <IoMdArrowDropdown size={25} />
                ) : (
                  <IoMdArrowDropright size={25} />
                )}
              </i>
              {t(
                exception
                  ? item.parent
                  : item.parent.toLowerCase().includes('documents') &&
                    customDocName
                  ? item.parent
                      .toLowerCase()
                      .replace('documents', customDocName)
                  : item.parent.toLowerCase().includes('templates') &&
                    customTempName
                  ? item.parent
                      .toLowerCase()
                      .replace('templates', customTempName)
                  : item.parent.toLowerCase().includes('workflows') &&
                    customWrkfName
                  ? item.parent
                      .toLowerCase()
                      .replace('workflows', customWrkfName)
                  : item.parent
              )}{' '}
              {item.count
                ? item.count === '000'
                  ? `(${item.count})`
                  : `(${item.count?.toString().padStart(3, '0')})`
                : ''}
            </HashLink>
            {item.children ? (
              <div className={styles.children__item__container}>
                <Collapse open={item.isOpen}>
                  <div className={styles.children__item__box}>
                    {item.children.length ? (
                      listType && listType === 'ol' ? (
                        <ol>
                          {React.Children.toArray(
                            item.children.map((item) => (
                              <ListItem item={item} />
                            ))
                          )}
                        </ol>
                      ) : (
                        <ul>
                          {React.Children.toArray(
                            item.children.map((item) => (
                              <ListItem item={item} />
                            ))
                          )}
                        </ul>
                      )
                    ) : (
                      <span style={{ marginLeft: '25px' }}>
                        {t('No results found!')}
                      </span>
                    )}
                  </div>
                </Collapse>
              </div>
            ) : (
              ''
            )}
          </>
        ))
      )}
    </div>
  );
};

export default CollapseItem;
