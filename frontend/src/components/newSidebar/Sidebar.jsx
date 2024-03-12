import React, { useState } from "react";
import styles from "./sidebar.module.css";
import { v4 as uuidv4 } from "uuid";
import CollapseItem from "./collapseItem/CollapseItem";
import Notifications from "./notifications/Notifications";
import New from "./new/New";
import Search from "./search/Search";

import { FaPowerOff } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { ImHome3 } from "react-icons/im";
import Footer from "./footer/Footer";
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaShieldAlt } from "react-icons/fa";
import { AiTwotoneSetting } from "react-icons/ai";
import { dowellLogoutUrl } from "../../services/axios";
import ManageFile from "./manageFile/ManageFile";
import Reports from "./reports/Reports";

import { getAgreeStatus } from "../../services/legalService";
import Spinner from "../spinner/Spinner";
import useCloseElementOnEscapekeyClick from "../../hooks/useCloseElementOnEscapeKeyClick";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  setDateAgreedToLegalStatus,
  setLegalAgreePageLoading,
  setLegalStatusLoading,
  setLegalTermsAgreed,
  setShowLegalStatusPopup,
  setUserDetailPosition,
  setShowProfileSpinner,
  setLanguageSelectPosition,
} from "../../features/app/appSlice";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { GrStatusGoodSmall } from "react-icons/gr";
import { productName } from "../../utils/helpers";
import { useAppContext } from "../../contexts/AppContext";
import { HashLink } from "react-router-hash-link";

const Sidebar = ({toggleSidebar, isMobile}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [knowledge, Setknowledge] = useState([
    // {
    //   id: uuidv4(),
    //   parent: 'Templates',
    //   children: [
    //     { id: uuidv4(), child: 'Proposal' },
    //     { id: uuidv4(), child: 'Student Progress reports' },
    //     { id: uuidv4(), child: 'Resume' },
    //     { id: uuidv4(), child: 'Christmas cards' },
    //     { id: uuidv4(), child: 'Birthday cards' },
    //   ],
    // },
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
  ]);
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const { IconColor, ShowProfileSpinner, themeColor, creditResponse } =
    useSelector((state) => state.app);
  // // console.log(creditResponse && creditResponse.data)
  const navigate = useNavigate();
  useCloseElementOnEscapekeyClick(() =>
    dispatch(setLegalAgreePageLoading(false))
  );

  const { workflowSettings } = useAppContext();

  useEffect(() => {
    getAgreeStatus(session_id)
      .then((res) => {
        const legalStatus = res.data.data[0]?.i_agree;

        dispatch(setLegalStatusLoading(false));
        dispatch(setLegalTermsAgreed(legalStatus));
        dispatch(
          setDateAgreedToLegalStatus(res.data.data[0]?.i_agreed_datetime)
        );
        // if (!legalStatus) setShowLegalPopup(true);
      })
      .catch((error) => {
        // console.log(error.response ? error.response.data : error.message);
        dispatch(setLegalStatusLoading(false));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.replace(dowellLogoutUrl);
  };

  const handleClick = (feature) => {
    feature === "logout" && handleLogout();

    //
    if (feature === "profile") {
      dispatch(setShowProfileSpinner(true)); // Show spinner
      sessionStorage.clear();

      window.location.replace(
        `https://100093.pythonanywhere.com/?session_id=${session_id}`
      );

      // Hide spinner after 2 seconds
    }

    feature === "home" && navigate(`/`);
    feature === "shield" && dispatch(setShowLegalStatusPopup(true));
    /*  feature === "shield" && ; */
    feature === "settings" && navigate("/settings");
  };

  const handleToggleUserDetail = (e) => {
    const top = e.target.getBoundingClientRect().top;
    const left = e.target.getBoundingClientRect().left + 25;

    dispatch(
      setUserDetailPosition({
        top,
        left,
      })
    );
  };

  const handleMouseLeave = () => {
    dispatch(setUserDetailPosition(null));
  };
  const HandleLanBtnClk = (e) => {
    const top = e.target.getBoundingClientRect().top;
    const left = e.target.getBoundingClientRect().left + 20;

    dispatch(
      setLanguageSelectPosition({
        top,
        left,
      })
    );
    // setIsPopupOpen(true);
  };

  /////////////////////
  // useEffect(() => {
  //   axios
  //     .get(
  //       'https://100094.pythonanywhere.com/v1/companies/6385c0f38eca0fb652c9457e/templates/?='
  //     )
  //     .then((response) => {
  //       const templateNames = response.data.templates.map(
  //         (template) => template.template_name
  //       );
  //       const updatedKnowledge = knowledge.map((item) => {
  //         if (item.parent === 'Templates') {
  //           const updatedChildren = item.children.map((child, index) => {
  //             // Map each template child to the corresponding template name from the response
  //             if (index < templateNames.length) {
  //               return { id: uuidv4(), child: templateNames[index] };
  //             }
  //             return child;
  //           });
  //           return { ...item, children: updatedChildren };
  //         }
  //         return item;
  //       });
  //       Setknowledge(updatedKnowledge);
  //     })
  //     .catch((error) => {
  //       // Handle any errors
  //     });
  // }, []);
  // // console.log(creditResponse.data.is_active)
  // // console.log(creditResponse.data.service_id)

  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleRouteChange = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const sidebarStyle = {
    padding: "15px 15px 15px 15px",
    display: "flex",
    overflow: "hidden",
    color: "var(--e-global-color-9d2ac19) !important",
    borderBottom: "1px solid var(--e-global-color-9d2ac19)",
    fontWeight: "600",
    cursor: "pointer",
    position: "relative",
    outline: "none",
    textDecoration: "underline",
    textTransform: "capitalize",
    top: `${scrollPosition}px`
    // Add other styles here
  };

  const handleLinkClick = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    const routePart = e.currentTarget.getAttribute('href');
    // console.log("routePart", routePart)
    // navigate("/templates/demo#demo")
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
          <h2 className={styles.header}>{t("Workflow AI")}</h2>
        </div>
        <div className={styles.item__box}>
          <img
            className="XNo5Ab"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEsElEQVR4Ac2X1XrjRgBGi9f7AOX2KXq3zBQsMzN3mdkOLjMzhpk5ZmbmoOU4W27/akYZq47i0qK+7xiuzhkQPXBfHN8cjT+VVZQ055XeRF6JQC5PzgTZxSJZRQLLCuOlty0gqyRhInICEROomMHkPMuLBJbsGP5p48bWR25LgFQuDcgSA7BsgqzNvudvSwCRZpZnDliyY/DkbQlgUkbm0YsBlIKRX99/X/XobQ3I/jejJxQKLF5tn3XLAdlSsShnFEkDlvJ8fGgYOr0NwWAE0WiMJ0qJRCIIh8NphEIhitfrdej1zsfFACqTsu1GEipHAsMjcYramcCWa0kqZwGEujYDbDY3L40iFosRWARDEhQIBCxTBrARX+pKIB6PY5TH7ONg9nL0fzAWxxsHxlPyJQU3UXzZBZXKCI/H968DCKkAJmVsvZ6kMmeQw+cnx1PT/uXpcXxynP8vyikfHRhAX78eRqMFfn+AyDMHiMshBrDdzVDYhdF+cyYp2XQEcfSMcdS36qDTmWC12uDz+W4tYGiYgyfMpcn5qU+jSZeg8sUTlFxxQa02wmKxwW63o1uhQWNXX7o8UwATMQb5AG+ESxu1xslRDG5hdhQ2joopcrIMUXR2qaDWGGAwmnDg/FWsLD4Enz9A8fr8FH8gIA1gEka/TZB8e1Zcb8a6S8L+KO8fY3LKItkYXvm2CG+s3Im31uzA22t3Ud7dWID3NxfjvU3FeHdTEQ5eKifyvw/YdFWQuEIcvjiZTK33h8fG4QiIcSn5BBuOqHG1ogkV9S2oaelAbUs76lo78cnWUuw+ew1N3QqoDCZpABFM5lzHGBURrD4Ch9GJ/xc6ExI54ZODUVytbEF1UwfsdgccDgfq27rw9joZelVatv4ZA8go09hwOYleK4eBIZ5hDkp7AttvJKeUL5TxMyJLouRYOd5ctQudfUrYbHasKDqAzftOwOVykYsPEUsDBKGUxZORM9LFjAU8pZdt+HLrHqyQH8L+c9fw3no5epVqGkDw+/1UHgwGxQCJ6F+IpXKBTw5GUF3fgXfWyOlmvFBRB6fTmQpwu900QhoglUnFIhIxZRe/DLsS2HOqEq+v4M+GtTsgO3qOXBdoBAvwer3kYiUG/EspE2eUE+bzZK24ipLjl1HT3In3NsghO3KWbMq0AI/HIwZIRBmlmcVMTnhZZkdfvw4mkxV1bZ14f0MBdvIRDoeTBFB5esCuuCmzUCqWjlpk3s5xLNqZQHO7BlqtkZ4J9e3ddCau1TWxWUgPWLAx9Pi8bYOWhTsTmMyCqdghMn8Hl2LedoG5PPuuWqFWG0gAvR70qTRkBsheEANu9VizteP7mTlVmJH9F7KqsPDlSpRVKaAzWGC30wDG7Q14f8XlabPyapAitwaz82tx7lIPlCo9jCYLkZIIQloA4bY8Ub/7XX10dl4tKLm12He0EwqlDnq9CWazMAM2m40FsNPx9gWs29n5NZGT0W+Wt0Kh0PGbzwCj0QyLxULkaQGE2xrw/orGaUT+xZomdHeroVKR0Rv50UsDCCzAYLCYb9u75YotNY6ODiV6+1TQaMijmR4mkykVwbBarTRGpzNaZbKLz90Xb+Z/Apo8pHRw0e17AAAAAElFTkSuQmCC"
            style={{ height: 20, width: 20, cursor: "pointer" }}
            alt=""
            onClick={(e) => {
              HandleLanBtnClk(e);
            }}
          />
        </div>
        <div>
          <GrStatusGoodSmall color={IconColor} />
        </div>
      </div>
      <div className={styles.icon__box}>
        {iconBoxItems.map((item) => (
          <i
            id={item.id}
            onClick={() => handleClick(item.feature)}
            key={item.id}
          >
            {<item.icon cursor="pointer" size={25} />}
            <Tooltip
              anchorId={item.id}
              content={item.label}
              style={{ fontStyle: "normal", backgroundColor: 'rgb(97, 206, 112)'}}
            />
          </i>
        ))}

        <BsThreeDotsVertical
          cursor="pointer"
          size={25}
          onMouseEnter={(e) => handleToggleUserDetail(e)}
          // onMouseLeave={handleMouseLeave}
        />
      </div>
      <div className={styles.user__box}>
        {userDetail?.userinfo?.profile_img ? (
          <img
            alt=""
            className={styles.Profile_img}
            src={userDetail?.userinfo?.profile_img}
          />
        ) : (
          <i>
            <CgProfile size={100} />
          </i>
        )}

        <h2 className={styles.user__box__text}>
          {t("Welcome", { username: userDetail?.userinfo?.username })}
        </h2>
      </div>
      <div className={styles.organization__box}>
        <h2 className={styles.organization__text} style={{ color: themeColor }}>
          {userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info?.find(
                (portfolio) => portfolio.product === productName
              )?.org_name
              ? userDetail?.portfolio_info?.find(
                  (portfolio) => portfolio.product === productName
                )?.org_name
              : "My Organization"
            : userDetail.portfolio_info[0].org_name
            ? userDetail.portfolio_info[0].org_name
            : "My Organization"}
        </h2>
        <div className={styles.organization__Img_Container}>
          {userDetail?.userinfo?.org_img ? (
            <img
              alt=""
              src={userDetail?.userinfo?.org_img}
              className={styles.organization__Img}
            />
          ) : (
            <img
              className={styles.organization__Img}
              alt=""
              src="https://i0.wp.com/100018-dowellWorkflowAi-testing/wp-content/uploads/2022/10/artistic-logo.png?fit=916%2C640&ssl=1"
            />
          )}
        </div>
      </div>
      <Notifications toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <New toggleSidebar={toggleSidebar} isMobile={isMobile}/>
      <Search />
      <div className={styles.gap}></div>
      <ManageFile />
      <div className={styles.gap}></div>
      <Reports />
      {/* <div className={styles.feature__box}>
				<h2 className={styles.feature__title}>{t("Reports")}</h2>
				<CollapseItem items={manageFileItems} />
			</div> */}
      <div className={styles.gap}></div>
      <div className={styles.feature__box}>
        <h2
          className={`${styles.feature__title}`}
          style={{ color: themeColor, fontSize: "24px" }}
        >
          {t("DoWell")} {t("Knowledge Center")}
        </h2>
        <HashLink
          to="/folders/knowledge_folders"
          className={`${styles.templates_href} ${styles.parent__item__box}`}
        >
          Folder
        </HashLink>
        <HashLink
          to="/templates/demo#demo"
          className={`${styles.templates_href} ${styles.parent__item__box}`}
                  >
          Templates
        </HashLink>

        <HashLink
          to="/documents/demo#demo"
          className={`${styles.templates_href} ${styles.parent__item__box}`}
        >
          Documents
        </HashLink>
        {/* <CollapseItem items={knowledge} exception={true} /> */}

        <span className={styles.knowledge__Extra__Info}>
          {t("DoWell")} {t("True Moments User Experience Lab")}
        </span>
      </div>
      <Footer topSideIcons={iconBoxItems} handleIconClick={handleClick} />
    </div>
  );
};

export default Sidebar;

export const iconBoxItems = [
  { id: uuidv4(), icon: FaPowerOff, feature: "logout", label: "Logout" },
  { id: uuidv4(), icon: FaUserAlt, feature: "profile", label: "Profile" },
  { id: uuidv4(), icon: ImHome3, feature: "home", label: "Home" },
];

export const footerIcons = [
  { id: uuidv4(), icon: FaPowerOff, feature: "logout", label: "Logout" },
  { id: uuidv4(), icon: FaUserAlt, feature: "profile", label: "Profile" },
  { id: uuidv4(), icon: ImHome3, feature: "home", label: "Home" },
  { id: uuidv4(), icon: FaShieldAlt, feature: "shield", label: "Legal Status" },
  {
    id: uuidv4(),
    icon: AiTwotoneSetting,
    feature: "settings",
    label: "Settings",
  },
];

export const manageFileItems = [
  {
    id: uuidv4(),
    parent: "My documents (003)",
    children: [
      { id: uuidv4(), child: "New Document", href: "/documents/#newDocument" },
      { id: uuidv4(), child: "Drafts", href: "/documents/#drafts" },
      { id: uuidv4(), child: "Created by me", href: "/documents/#createdByMe" },
      // { id: uuidv4(), child: "Waiting to Process", href: "#" },
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
      // {
      //   id: uuidv4(),
      //   child: "Waiting to Process",
      //   href: "/workflows/set-workflow",
      // },
    ],
  },
  {
    id: uuidv4(),
    parent: "My Processes (02)",
    children: [
      {
        id: uuidv4(),
        child: "Cancelled Processes",
        href: "/processes/cancelled",
      },
      { id: uuidv4(), child: "Test Processes", href: "/processes/tests" },
      {
        id: uuidv4(),
        child: "Completed Processes",
        href: "/processes/completed",
      },
    ],
  },
];

export const reports = [
  {
    id: uuidv4(),
    parent: "documents",
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
