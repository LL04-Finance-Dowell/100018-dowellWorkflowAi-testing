import { useRef, useState } from "react";
import styles from "./collapseItem.module.css";
import Collapse from "../../../layouts/collapse/Collapse";
import { HashLink } from "react-router-hash-link";
import { IoMdArrowDropright } from "react-icons/io";
import { useEffect } from "react";

function ListItem({ item }) {
  let children = null;

  if (item.children && item.children.length) {
    console.log(item);
    children = (
      <ul>
        {item.children.map((i) => (
          <ListItem item={i} key={i.id} />
        ))}
      </ul>
    );
  }

  return (
    <li key={item.id}>
      <li style={{ color: item.asParent && styles.as__parent }}>
        <HashLink
          className={styles.hash__link}
          to={item.href ? item.href : "#"}
        >
          {item.child}
        </HashLink>
      </li>
      <HashLink className={styles.hash__link} to={item.href ? item.href : "#"}>
        {children}
      </HashLink>
    </li>
  );
}

const CollapseItem = ({ items, listType }) => {
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
      {menuItems.map((item) => (
        <>
          <div
            key={item.id}
            className={`${styles.parent__item__box} ${
              item.isOpen && styles.active
            }`}
            onClick={() => handleParentClick(item.id)}
          >
            <i>
              <IoMdArrowDropright size={25} />
            </i>
            {item.parent}{" "}
            {item.count
              ? item.count === "000"
                ? `(${item.count})`
                : `(${item.count?.toString().padStart(3, "0")})`
              : ""}
          </div>
          <div className={styles.children__item__container}>
            <Collapse open={item.isOpen}>
              <div className={styles.children__item__box}>
                {listType && listType === "ol" ? (
                  <ol>
                    {item.children.map((item) => (
                      <ListItem item={item} key={item.id} />
                    ))}
                  </ol>
                ) : (
                  <ul>
                    {item.children.map((item) => (
                      <ListItem item={item} key={item.id} />
                    ))}
                  </ul>
                )}
              </div>
            </Collapse>
          </div>
        </>
      ))}
    </div>
  );
};

export default CollapseItem;
