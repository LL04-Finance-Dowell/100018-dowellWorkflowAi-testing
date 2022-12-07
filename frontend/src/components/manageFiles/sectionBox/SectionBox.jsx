import styles from "./sectionBox.module.css";
import maneFilesStyles from "../manageFiles.module.css";
import HoverCard from "../../newHoverCard/HoverCard";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";

const SectionBox = ({ cardItems, title, cardBgColor, feature }) => {
  const [test, setTest] = useState("idle");

  const { mineStatus: tempMineStatus } = useSelector((state) => state.template);
  const { mineStatus: docMineStatus } = useSelector((state) => state.document);

  useEffect(() => {
    feature === "template" && setTest(tempMineStatus);
    feature === "document" && setTest(docMineStatus);
  }, [tempMineStatus, docMineStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2 className={maneFilesStyles.header}>{title}</h2>
          {test === "pending" ? (
            <div>
              <LoadingSpinner />
            </div>
          ) : (
            <div className={styles.grid__box}>
              {cardItems &&
                cardItems.map((item) => (
                  <HoverCard
                    feature={feature}
                    item={item}
                    bgColor={cardBgColor}
                    key={item.id}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
