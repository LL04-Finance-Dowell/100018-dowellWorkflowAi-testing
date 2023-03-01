import Flip from "../flip/Flip";
import styles from "./flipMenu.module.css";
import { FaFileContract, FaRegBell } from "react-icons/fa";
import { FcWorkflow } from "react-icons/fc";
import { HiOutlineDocument } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { FaHeadSideVirus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { setToggleManageFileForm } from "../../features/app/appSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { createTemplate } from "../../features/template/asyncThunks";

const FlipMenu = () => {
  const [filpItemsToDisplay, setFlipItemsToDisplay] = useState(flipItems);
  const { notificationsForUser } = useSelector((state) => state.app);

  useEffect(() => {
    if (!notificationsForUser) return;

    const currentFlipItems = filpItemsToDisplay.slice();
    const totalNotificationCount = notificationsForUser.reduce(
      (a, b) => a + b.items.length,
      0
    );

    const updatedFlipItems = currentFlipItems.map((item) => {
      if (item.role === "viewNotifications") {
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
    </div>
  );
};

export default FlipMenu;

export const FlipFront = (props) => {
  return (
    <div
      style={{ background: `${props.frontBg}` }}
      className={styles.flip__box}
    >
      <div className={styles.flip__box}>
        <i>
          <props.icon size={28} />
        </i>
        <h2 className={styles.flip__text}>{props.text}</h2>
      </div>
    </div>
  );
};

export const FlipBack = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationsForUser } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);

  const handleClick = (role) => {
    if (role === "newDoc") {
      console.log("wwwwwwwwwwwwwwwwwwwwwwwwwww", role);
      navigate("/documents/#newDocument");
      dispatch(setToggleManageFileForm(true));
    }
    if (role === "viewNotifications") {
      navigate("/#documents", {
        state: {
          elementIdToScrollTo: `notifications-documents-${notificationsForUser[0].id}`,
        },
      });
    }
    if (role === "newTemp") {
      const data = {
        created_by: userDetail?.userinfo.username,
        company_id: userDetail?.portfolio_info[0].org_id,
        data_type: userDetail?.portfolio_info[0].data_type,
      };
      dispatch(createTemplate(data));
    }
    if (role === "newWorkf") {
      navigate("/workflows/#newWorkflow");
      dispatch(setToggleManageFileForm(true));
    }
    if (role === "search") {
      navigate("/search")
    }
  };

  return (
    <div
      style={{ background: "#7A7A7A" }}
      className={`${styles.flip__box} ${styles.back__box} ${props.buttonTexts ? styles.grow__back__box : ''}`}
    >
      {
        props.buttonTexts ?
        React.Children.toArray(props.buttonTexts.map((buttonText, index) => {
          return <button
            onClick={() => handleClick(props.roles[index])}
            type="button"
            className={styles.flip__button}
          >
            {buttonIcons[index]}
          </button>
            })) :
        <button
          onClick={() => handleClick(props.role)}
          type="button"
          className={styles.flip__button}
        >
          {props.buttonText}
        </button>
      }
    </div>
  );
};

export const flipItems = [
  {
    id: uuidv4(),
    icon: FaRegBell,
    frontBg: "#1ABC9C",
    text: "000",
    buttonText: "view",
    role: "viewNotifications",
  },
  {
    id: uuidv4(),
    icon: HiOutlineDocument,
    frontBg: "#7A7A7A",
    text: "new",
    buttonTexts: [
      "Document",
      "Template",
      "Workflow"
    ],
    roles: [
      "newDoc",
      "newTemp",
      "newWorkf",
    ]
  },
  {
    id: uuidv4(),
    icon: FaSearch,
    frontBg: "#61CE70",
    text: "search",
    buttonText: "search document",
    role: "search",
  },
  {
    id: uuidv4(),
    icon: FaHeadSideVirus,
    frontBg: "#C3D6BE",
    text: "support",
    buttonText: "dowell knowledge centre",
    role: "",
  },
];

const buttonIcons = [
  <HiOutlineDocument />,
  <FaFileContract />,
  <FcWorkflow />,   
]