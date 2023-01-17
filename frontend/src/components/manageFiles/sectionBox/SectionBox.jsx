import styles from "./sectionBox.module.css";
import maneFilesStyles from "../manageFiles.module.css";
import BookSpinner from "../../bookSpinner/BookSpinner";

const SectionBox = ({ cardItems, title, Card, status, idKey }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2 className={maneFilesStyles.header} id={idKey ? title.replaceAll(" ", "") + "-" + idKey : ""}>{title}</h2>
          {status === "pending" ? (
            <div style={{ marginTop: "15px" }}>
              <BookSpinner />
            </div>
          ) : (
            <div className={styles.grid__box}>
              {Card &&
                cardItems &&
                cardItems.length > 0 &&
                cardItems.map((item) => <Card key={item.id} cardItem={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
