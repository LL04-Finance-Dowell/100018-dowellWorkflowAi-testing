import Flip from "../flip/Flip";
import styles from "./flipMenu.module.css";
import { FaRegBell } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { FaHeadSideVirus } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const FlipMenu = () => {
  return (
    <div className={styles.container}>
      {flipItems.map((item) => (
        <div className={styles.flip__container}>
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
  return (
    <div
      style={{ background: "#7A7A7A" }}
      className={`${styles.flip__box} ${styles.back__box}`}
    >
      <button className={styles.flip__button}>{props.buttonText}</button>
    </div>
  );
};

export const flipItems = [
  {
    id: uuidv4(),
    icon: FaRegBell,
    frontBg: "#1ABC9C",
    text: "000",
    buttonText: "View",
  },
  {
    id: uuidv4(),
    icon: HiOutlineDocument,
    frontBg: "#7A7A7A",
    text: "new",
    buttonText: "Drafts documents",
  },
  {
    id: uuidv4(),
    icon: FaSearch,
    frontBg: "#61CE70",
    text: "Search",
    buttonText: "search document",
  },
  {
    id: uuidv4(),
    icon: FaHeadSideVirus,
    frontBg: "#C3D6BE",
    text: "Support",
    buttonText: "dowell knowladge centre",
  },
];
