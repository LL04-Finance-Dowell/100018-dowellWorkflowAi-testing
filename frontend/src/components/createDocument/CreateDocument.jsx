import styles from "./createDocument.module.css";
import globalStyles from "./globalStyles.css";
import { BsHouseDoorFill } from "react-icons/bs";
import { BsPersonFill } from "react-icons/bs";
import { BsFillGearFill } from "react-icons/bs";
import { BsPower } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import { HiTable } from "react-icons/hi";
import { FiArrowRightCircle } from "react-icons/fi";
import { FaAngleRight } from "react-icons/fa";
import { GrMenu } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import CreateDocumentForm from "./createDocumentForm/CreateDocumentForm";

const CreateDocument = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [currentParentMenu, setCurrentMenuParrent] = useState("");
  const [currentChildMenu, setCurrentChildMenu] = useState("");
  const [toggleMenuItem, setToggleMenuItem] = useState(false);
  const [childHeight, setChildHeight] = useState(0);

  const handleToggleSidebar = () => {
    setToggleSidebar((prev) => !prev);
  };

  const handleParentMenuClick = (item) => {
    setCurrentMenuParrent(item);
    setCurrentChildMenu("");
    if (item.id === currentParentMenu.id && toggleMenuItem) {
      setToggleMenuItem(false);
    } else {
      setToggleMenuItem(true);
    }
  };

  const handleChildMenuClick = (id) => setCurrentChildMenu(id);

  useEffect(() => {
    const currentHeight = document.querySelector(
      ".current-children-menu-batu"
    )?.offsetHeight;

    if (currentHeight) setChildHeight(currentHeight);
  }, [currentParentMenu]);

  console.log("aaaa", toggleSidebar);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.nav__container} ${
          toggleSidebar && styles.toggle__sidebar
        }`}
      >
        <div
          onClick={handleToggleSidebar}
          className={styles.toggle__sidebar__icon}
        >
          <GrMenu cursor="pointer" />
        </div>
        <div className={styles.sidebar__container}>
          <div className={styles.sidebar__header__box}>
            <img
              src="https://100084.pythonanywhere.com/static/images/doc_logo1.png"
              alt="logo"
            />
          </div>
          <h1 className={styles.sidebar__header__content}>Dowell Workflow</h1>
          <div className={styles.menu__container}>
            <ul className={styles.menu__box}>
              {menuItems.map((menuItem) => (
                <li
                  key={menuItem.id}
                  className={`${
                    menuItem.children.length > 0 &&
                    styles.toggle__menu__item__icon__parent
                  } ${styles.parent__li}`}
                >
                  <a
                    onClick={() => handleParentMenuClick(menuItem)}
                    className={`${
                      menuItem.children.length > 0 &&
                      toggleMenuItem &&
                      menuItem.id === currentParentMenu.id &&
                      styles.active__item
                    } ${styles.parent__menu__item}`}
                  >
                    {menuItem.children.length > 0 && (
                      <i className={styles.toggle__menu__item__icon}>
                        <FaAngleRight size={15} cursor="pointer" />
                      </i>
                    )}
                    <i>
                      <menuItem.icon />
                    </i>
                    <span>{menuItem.parent}</span>
                  </a>
                  <div
                    className={styles.toggle__menu__content__box}
                    style={{
                      maxHeight: `${
                        toggleMenuItem && menuItem.id === currentParentMenu.id
                          ? `${childHeight}px`
                          : "0px"
                      }`,
                    }}
                  >
                    <ul
                      className={`${
                        toggleMenuItem &&
                        menuItem.id === currentParentMenu.id &&
                        "current-children-menu-batu"
                      } ${styles.menu__content__box}`}
                    >
                      {menuItem.children.map((child) => (
                        <li
                          className={styles.child__li}
                          onClick={() => handleChildMenuClick(child.id)}
                          key={child.id}
                        >
                          <a
                            className={`${
                              child.id === currentChildMenu &&
                              styles.active__item
                            }`}
                          >
                            <i>
                              <FiArrowRightCircle />
                            </i>
                            <span>{child.child}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.sidebar__footer}>
            <a>
              <BsHouseDoorFill />
            </a>
            <a>
              <BsPersonFill />
            </a>
            <a>
              <BsFillGearFill />
            </a>
            <a>
              <BsPower />
            </a>
          </div>
        </div>
      </div>
      <CreateDocumentForm toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default CreateDocument;

export const menuItems = [
  {
    id: uuidv4(),
    parent: "Manage Documents",
    icon: FaFolderOpen,
    children: [
      { id: uuidv4(), child: "to be signed" },
      { id: uuidv4(), child: "new documents" },
      { id: uuidv4(), child: "drafts documents" },
      { id: uuidv4(), child: "created by me" },
      { id: uuidv4(), child: "rejected by others" },
    ],
  },
  {
    id: uuidv4(),
    parent: "Manage Templates",
    icon: HiTable,
    children: [
      { id: uuidv4(), child: "new template" },
      { id: uuidv4(), child: "my templates" },
    ],
  },
  {
    id: uuidv4(),
    parent: "Manage Workflows",
    icon: BsHouseDoorFill,
    children: [],
  },
];
