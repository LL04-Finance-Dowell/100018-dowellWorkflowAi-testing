import React from "react";
import styles from "./sidebar.module.css";
import { v4 as uuidv4 } from "uuid";
import CollapseItem from "./collapseItem/CollapseItem";
import Notifications from "./notifications/Notifications";
import New from "./new/New";
import Search from "./search/Search";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaPowerOff } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { ImHome3 } from "react-icons/im";
import Footer from "./footer/Footer";
import { useUserContext } from "../../contexts/UserContext";
import { getUserInfo } from "../../features/app/asyncThunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaShieldAlt } from "react-icons/fa";
import { AiTwotoneSetting } from "react-icons/ai";
import { dowellLogoutUrl } from "../../services/axios";
import ManageFile from "./manageFile/ManageFile";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { userDetail, currentUser, session_id } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace(dowellLogoutUrl);
  };

  const handleClick = (feature) => {
    feature === "logout" && handleLogout();
    feature === "profile" &&
      window.open(
        `https://100093.pythonanywhere.com/?session_id=${session_id}`,
        "_blank"
      );
    feature === "home" && navigate(`/`);
    /*  feature === "shield" && ;
    feature === "settings" && ; */
  };

  return (
    <div className={styles.container}>
      <div className={styles.header__box}>
        <div className={styles.item__box}>
          <img
            src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/02/cropped-Playstore_logo_2.png?resize=100%2C100&ssl=1"
            alt="logo"
          />
        </div>
        <div className={styles.item__box}>
          <h2 className={styles.header}>Workflow AI</h2>
        </div>
        <div className={styles.item__box}>
          <i>
            <AiOutlineMenuFold cursor="pointer" size={25} />
          </i>
        </div>
      </div>
      <div className={styles.icon__box}>
        {iconBoxItems.map((item) => (
          <i onClick={() => handleClick(item.feature)} key={item.id}>
            {<item.icon cursor="pointer" size={25} />}
          </i>
        ))}
      </div>
      <div className={styles.user__box}>
        {currentUser?.profile_image ? (
          <img src={currentUser?.profile_image} alt="user" />
        ) : (
          <i>
            <CgProfile size={100} />
          </i>
        )}

        <h2 className={styles.user__box__text}>
          Welcome {userDetail?.userinfo?.username}
        </h2>
      </div>
      <div className={styles.organization__box}>
        <h2 className={styles.organization__text}>My Organization</h2>
        <img
          src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/10/artistic-logo.png?fit=916%2C640&ssl=1"
          alt="org-logo"
        />
      </div>
      <Notifications />
      <New />
      <Search />
      <div className={styles.gap}></div>
      <ManageFile />
      <div className={styles.gap}></div>
      <div className={styles.feature__box}>
        <h2 className={styles.feature__title}>Reports</h2>
        <CollapseItem items={manageFileItems} />
      </div>
      <div className={styles.gap}></div>
      <div className={styles.feature__box}>
        <h2
          className={`${styles.feature__title} ${styles.feature__title__small}`}
        >
          DoWell Knowledge Centre
        </h2>
        <CollapseItem items={knowledge} />
      </div>
      <Footer topSideIcons={iconBoxItems} handleIconClick={handleClick} />
    </div>
  );
};

export default Sidebar;

export const iconBoxItems = [
  { id: uuidv4(), icon: FaPowerOff, feature: "logout" },
  { id: uuidv4(), icon: FaUserAlt, feature: "profile" },
  { id: uuidv4(), icon: ImHome3, feature: "home" },
];

export const footerIcons = [
  ...iconBoxItems,
  { id: uuidv4(), icon: FaShieldAlt, feature: "shield" },
  { id: uuidv4(), icon: AiTwotoneSetting, feature: "settings" },
];

export const manageFileItems = [
  {
    id: uuidv4(),
    parent: "My Documnets (003)",
    children: [
      { id: uuidv4(), child: "New Document", href: "/documents/#newDocument" },
      { id: uuidv4(), child: "Drafts", href: "/documents/#drafts" },
      { id: uuidv4(), child: "Created by me", href: "/documents/#createdByMe" },
      { id: uuidv4(), child: "Waiting to Process", href: "#" },
    ],
  },
  {
    id: uuidv4(),
    parent: "My Templates (05)",
    children: [
      { id: uuidv4(), child: "New Template", href: "/templates/#newTemplate" },
      { id: uuidv4(), child: "Drafts", href: "/templates/#drafts" },
      { id: uuidv4(), child: "Created by me", href: "/templates/#createdByMe" },
    ],
  },
  {
    id: uuidv4(),
    parent: "My Workflows (01)",
    children: [
      { id: uuidv4(), child: "New Workflow", href: "/workflows/#newWorkflow" },
      { id: uuidv4(), child: "Drafts", href: "/workflows/#drafts" },
      { id: uuidv4(), child: "Created by me", href: "/workflows/#createdByMe" },
      {
        id: uuidv4(),
        child: "Waiting to Process",
        href: "/workflows/set-workflow",
      },
    ],
  },
];

export const reports = [
  {
    id: uuidv4(),
    parent: "Documnets",
    children: [
      { id: uuidv4(), child: "Report 1" },
      { id: uuidv4(), child: "Report 2" },
      { id: uuidv4(), child: "Report 3" },
    ],
  },
  {
    id: uuidv4(),
    parent: "Templates",
    children: [
      { id: uuidv4(), child: "Report 1" },
      { id: uuidv4(), child: "Report 2" },
      { id: uuidv4(), child: "Report 3" },
    ],
  },
  {
    id: uuidv4(),
    parent: "Workflows",
    children: [
      { id: uuidv4(), child: "Report 1" },
      { id: uuidv4(), child: "Report 2" },
      { id: uuidv4(), child: "Report 3" },
    ],
  },
];

export const knowledge = [
  {
    id: uuidv4(),
    parent: "Templates",
    children: [
      { id: uuidv4(), child: "Proposal" },
      { id: uuidv4(), child: "Student Progress reports" },
      { id: uuidv4(), child: "Resume" },
      { id: uuidv4(), child: "Christmas cards" },
      { id: uuidv4(), child: "Birthday cards" },
    ],
  },
  {
    id: uuidv4(),
    parent: "Landing Supports",
    children: [
      { id: uuidv4(), child: "FAQ" },
      { id: uuidv4(), child: "Feature videos" },
      { id: uuidv4(), child: "Failed scenarios" },
      { id: uuidv4(), child: "1-1 couching" },
      {
        id: uuidv4(),
        child: "White papers",
        children: [
          { id: uuidv4(), child: "Products" },
          { id: uuidv4(), child: "Events" },
          { id: uuidv4(), child: "Conferences" },
          { id: uuidv4(), child: "Tradeshows" },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    parent: "Case Studies",
    children: [{ id: uuidv4(), child: "Customer Stories", asParent: true }],
  },
  {
    id: uuidv4(),
    parent: "New Trends",
    children: [
      { id: uuidv4(), child: "New features we are working on" },
      { id: uuidv4(), child: "Trends in technology" },
    ],
  },
  {
    id: uuidv4(),
    parent: "Legal Compliances",
    children: [
      {
        id: uuidv4(),
        child: "Legal compliance of e signatures and e documents",
        asParent: true,
        children: [
          { id: uuidv4(), child: "USA" },
          { id: uuidv4(), child: "UK" },
          { id: uuidv4(), child: "Australia" },
          { id: uuidv4(), child: "India" },
          { id: uuidv4(), child: "Germany" },
        ],
      },
    ],
  },
];
