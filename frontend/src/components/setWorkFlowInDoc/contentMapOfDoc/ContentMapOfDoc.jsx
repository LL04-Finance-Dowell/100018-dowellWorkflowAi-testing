import styles from "./contentMapOfDoc.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState, useRef } from "react";
import useScrollPosition from "../../../hooks/useScrollPosition";

const ContentMapOfDoc = () => {
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);
  const scrollPosition = useScrollPosition();

  console.log(isSticky, scrollPosition);

  useEffect(() => {
    if (
      ref.current?.getBoundingClientRect().bottom <= 0 ||
      ref.current?.getBoundingClientRect().top === 105
    ) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }, [scrollPosition]);

  console.log("top", ref.current?.getBoundingClientRect().top, isSticky);
  console.log("aaa", scrollPosition);

  return (
    <div
      ref={ref}
      className={`${styles.container} ${isSticky && styles.sticky}`}
    >
      <div className={styles.header__box}>
        <h4 className={styles.header}>Content Map of selected Doucument</h4>
        <IoIosArrowDown />
      </div>
    </div>
  );
};

export default ContentMapOfDoc;
