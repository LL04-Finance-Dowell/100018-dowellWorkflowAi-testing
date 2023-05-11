import styles from './handleTasks.module.css';
import Collapse from '../../../layouts/collapse/Collapse';
import { useEffect, useState } from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';
import { v4 } from 'uuid';

const HandleTasks = ({ feature, tasks }) => {
  const { t } = useTranslation();
  const [compTasks, setCompTask] = useState(tasks);

  const handleToggle = (id) => {
    setCompTask((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const colorClass =
    feature === 'completed' ? styles.completed : styles.incomplete;

  // useEffect(() => {
  //   console.log(feature + ' tasks: ', compTasks);
  // });
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
            <a>{t(item.parent)}</a>
          </div>
          <div className={styles.item__children__container}>
            <Collapse open={item.isOpen}>
              <div className={styles.item__children__box}>
                <ol>
                  <ItemsDisplay items={item.children} colorClass={colorClass} />
                  {/* {item.children.map((item) => (
                    <li key={item.id} className={colorClass}>
                      {item.child}
                    </li>
                  ))} */}
                </ol>
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
  const [adjustHeight, setAdjustHeight] = useState(false);
  const { setRerender } = useAppContext();

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
    setAdjustHeight(true);
  };

  const itemsRemover = () => {
    const rem = itemsToDisplay % 5;
    let modItems = [...itemsToDisplay];
    if (!rem) modItems.splice(-5, 5);
    else modItems.splice(-rem, rem);
    setItemsToDisplay(modItems);
    setAdjustHeight(true);
    setRerender(v4());
  };

  useEffect(() => {
    itemsPusher();
  }, []);

  // useEffect(() => {
  //   console.log('items Display: ', itemsToDisplay);
  // }, [itemsToDisplay]);
  return (
    <>
      {itemsToDisplay.length &&
        itemsToDisplay.map((item) => (
          <li key={item.id} className={colorClass}>
            {item.child}
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
