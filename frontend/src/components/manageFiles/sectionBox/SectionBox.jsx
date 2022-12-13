import styles from "./sectionBox.module.css";
import maneFilesStyles from "../manageFiles.module.css";
import HoverCard from "../../newHoverCard/HoverCard";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import BookSpinner from "../../bookSpinner/BookSpinner";

const SectionBox = ({ cardItems, title, cardBgColor, Card, status }) => {
  /* const [test, setTest] = useState("idle");

  const { mineStatus: tempMineStatus } = useSelector((state) => state.template);
  const { mineStatus: docMineStatus, draftStatu } = useSelector(
    (state) => state.document
  );
  const { mineStatus: workflowStatus } = useSelector((state) => state.workflow);

  useEffect(() => {
    feature === "template" && setTest(tempMineStatus);
    feature === "document" && setTest(docMineStatus);
    feature === "document-draft" && setTest(draftStatu);
    feature === "workflow" && setTest(workflowStatus);
  }, [tempMineStatus, docMineStatus, draftStatu, workflowStatus]); */

  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2 className={maneFilesStyles.header}>{title}</h2>
          {status === "pending" ? (
            <div>
              <BookSpinner />
            </div>
          ) : (
            <div className={styles.grid__box}>
              {Card &&
                cardItems &&
                cardItems.map((item) => <Card key={item.id} cardItem={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
