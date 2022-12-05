import styles from "./hoverCard.module.css";
import { FaSignature } from "react-icons/fa";

const HoverCard = ({ bgColor }) => {
  return (
    <div className={styles.container}>
      <div
        style={{ backgroundColor: bgColor ? bgColor : "#C3D7BE" }}
        className={`${styles.box} ${styles.current}`}
      >
        <i>
          <FaSignature size={62} />
        </i>
        <h2 className={styles.title}>To be signed</h2>
        <span className={styles.sub__title}>(file name)</span>
      </div>
      <div className={`${styles.box} ${styles.hover__box}`}>
        <h2 className={styles.title}>(file name)</h2>
        <span className={styles.sub__title}>Thumb nail of file</span>
        <button onClick={() => console.log("aaaaaa")} tabIndex={-30}>
          Click here
        </button>
      </div>
    </div>
  );
};

export default HoverCard;
