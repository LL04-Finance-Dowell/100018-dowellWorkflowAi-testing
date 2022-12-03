import { useRef, useState } from "react";
import styles from "./collapseItem.module.css";
import Collapse from "../../../layouts/collapse/Collapse";
import { HashLink } from "react-router-hash-link";

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
            {item.parent}
          </div>

          <Collapse
            className={styles.children__item__box}
            /* in={item.isOpen} */
            open={item.isOpen}
          >
            {listType && listType === "ol" ? (
              <ol>
                {item.children.map((item) => (
                  /*  <li key={item.id}>
                  <a>{item.child}</a>
                </li> */
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
          </Collapse>
        </>
      ))}
    </div>
  );
};

export default CollapseItem;
