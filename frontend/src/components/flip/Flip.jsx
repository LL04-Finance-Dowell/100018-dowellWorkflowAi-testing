import { useRef } from "react";
import styles from "./flip.module.css";

const Flip = ({ Front, Back }) => {
  const ref = useRef(null);

  return (
    <div
      style={{ height: `${ref.current?.getBoundingClientRect().height}px` }}
      className={styles.flip__card}
    >
      <div ref={ref} className={styles.flip__card__inner}>
        <div className={styles.flip__card__front}>{<Front />}</div>
        <div className={styles.flip__card__back}>{<Back />}</div>
      </div>
    </div>
  );
};

export default Flip;
