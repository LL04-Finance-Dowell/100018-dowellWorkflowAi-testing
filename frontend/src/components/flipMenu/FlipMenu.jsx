import Flip from "../flip/Flip";
import styles from "./flipMenu.module.css";
import { FaRegBell } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { FaHeadSideVirus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { setToggleManageFileForm } from "../../features/app/appSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  };

  return (
    <div
      style={{ background: "#7A7A7A" }}
      className={`${styles.flip__box} ${styles.back__box}`}
    >
      <button
        onClick={() => handleClick(props.role)}
        type="button"
        className={styles.flip__button}
      >
        {props.buttonText}
      </button>
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
    buttonText: "Create document",
    role: "newDoc",
  },
  {
    id: uuidv4(),
    icon: FaSearch,
    frontBg: "#61CE70",
    text: "search",
    buttonText: "search document",
    role: "",
  },
  {
    id: uuidv4(),
    icon: FaHeadSideVirus,
    frontBg: "#C3D6BE",
    text: "support",
    buttonText: "dowell knowladge centre",
    role: "",
  },
];
