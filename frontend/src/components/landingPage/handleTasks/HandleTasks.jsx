import styles from './handleTasks.module.css';
import Collapse from '../../../layouts/collapse/Collapse';
import { useEffect, useState } from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';
import { v4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { detailDocument } from '../../../features/document/asyncThunks';

const HandleTasks = ({ feature, tasks }) => {
  const { t } = useTranslation();
  const [compTasks, setCompTask] = useState(tasks);
  const { customDocName, customTempName, customWrkfName } = useAppContext();

  const handleToggle = (id) => {
    setCompTask((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const colorClass =
    feature === 'completed' ? styles.completed : styles.incomplete;

  return (
    <div className={styles.container}>
      <h2 className={`${styles.item__box__title} ${colorClass}`}>
        {t(feature)} {t('Tasks')}
      </h2>
      {compTasks.map((item) => (
        <div key={item.id} className={styles.item__box}>
          <div
            onClick={() => handleToggle(item.id)}
            className={`${styles.item__parent} ${
              item.isOpen && styles.active
            } ${feature === 'incomplete' && styles.incomplete__parent}`}
          >
            <i>
              {item.isOpen ? (
                <IoMdArrowDropup size={25} />
              ) : (
                <IoMdArrowDropright size={25} />
              )}
            </i>
            <span>
              {t(
                item.parent.toLowerCase().includes('documents') && customDocName
                  ? customDocName
                  : item.parent.toLowerCase().includes('templates') &&
                    customTempName
                  ? customTempName
                  : item.parent.toLowerCase().includes('workflows') &&
                    customWrkfName
                  ? customWrkfName
                  : item.parent
              )}
            </span>
          </div>
          <div className={styles.item__children__container}>
            <Collapse open={item.isOpen}>
              <div className={styles.item__children__box}>
                {item.children.length ? (
                  <ol>
                    <ItemsDisplay
                      items={item.children}
                      colorClass={colorClass}
                    />
                  </ol>
                ) : (
                  <p>
                    No {feature}{' '}
                    {item.parent.toLowerCase().includes('documents') &&
                    customDocName
                      ? customDocName
                      : item.parent.toLowerCase().includes('templates') &&
                        customTempName
                      ? customTempName
                      : item.parent.toLowerCase().includes('workflows') &&
                        customWrkfName
                      ? customWrkfName
                      : item.parent}
                  </p>
                )}
              </div>
            </Collapse>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HandleTasks;

const ItemsDisplay = ({ items, colorClass }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const { setRerender } = useAppContext();
  const dispatch = useDispatch();

  const itemsPusher = () => {
    let count = 0;
    let cutItems = [];

    for (let i = startIndex; i < startIndex + 5; i++) {
      cutItems.push(items[i]);
      count = i;

      if (i === items.length - 1) break;
    }
    setItemsToDisplay([...itemsToDisplay, ...cutItems]);
    setStartIndex(count + 1);
  };

  const itemsRemover = () => {
    const rem = itemsToDisplay % 5;
    let modItems = [...itemsToDisplay];
    if (!rem) modItems.splice(-5, 5);
    else modItems.splice(-rem, rem);
    setItemsToDisplay(modItems);
    setRerender(v4());
  };

  const handleItemOpen = (itm) => {
    const data = {
      document_name: itm.child,
      document_id: itm.id,
    };
    dispatch(detailDocument(data.document_id));
    //  * For this function, no checks were included for document,template or workflows, because as at now, only documents can be incomplete/complete
    // * If any of the others are to be included in the future, do ensure to put a check inorder to avoid unnecesarry bugs
  };

  useEffect(() => {
    itemsPusher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {itemsToDisplay.length > 0 &&
        itemsToDisplay.map((item) => (
          <li key={item.id} className={colorClass}>
            <button
              className={styles.item_btn}
              onClick={() => handleItemOpen(item)}
            >
              {item.child}
            </button>
          </li>
        ))}

      {items.length <= 5 || (
        <div className='btns_wrapper'>
          <button
            className='more_btn'
            disabled={itemsToDisplay.length === items.length}
            style={{
              transition: 'opacity ease 0.5s',
              opacity: `${itemsToDisplay.length === items.length ? 0 : 1}`,
            }}
            onClick={() => {
              itemsPusher();
              setRerender(v4());
            }}
          >
            More
          </button>
          <button
            className='less_btn'
            disabled={itemsToDisplay.length <= 5}
            style={{
              transition: 'opacity ease 0.5s',
              opacity: `${itemsToDisplay.length <= 5 ? 0 : 1}`,
            }}
            onClick={() => itemsRemover()}
          >
            Less
          </button>
        </div>
      )}
    </>
  );
};
