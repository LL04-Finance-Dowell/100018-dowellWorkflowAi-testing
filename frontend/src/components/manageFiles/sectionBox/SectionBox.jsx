import styles from "./sectionBox.module.css";
import maneFilesStyles from "../manageFiles.module.css";
import BookSpinner from "../../bookSpinner/BookSpinner";
import { useState } from "react";
import { Box } from "../../hoverCard/styledComponents";
import { PrimaryButton } from "../../styledComponents/styledComponents";

const SectionBox = ({ cardItems, title, Card, status, idKey }) => {
  const [sliceCount, setSliceCount] = useState(1);

  const handleLoadMore = () => {
    setSliceCount((prev) => prev + 1);
  };

  console.log("slideCount", sliceCount);

  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2
            className={maneFilesStyles.header}
            id={idKey ? title.replaceAll(" ", "") + "-" + idKey : ""}
          >
            {title}
          </h2>
          {status === "pending" ? (
            <div style={{ marginTop: "15px" }}>
              <BookSpinner />
            </div>
          ) : (
            <>
              {Card && cardItems && cardItems.length > 0 && (
                <div className={styles.grid__box}>
                  {cardItems.slice(0, sliceCount * 10).map((item) => (
                    <Card key={item.id} cardItem={item} />
                  ))}
                  {cardItems.length > 10 && (
                    <PrimaryButton
                      style={{
                        pointerEvents: `${
                          cardItems.length / 10 < sliceCount && "none"
                        }`,
                      }}
                      hoverBg="success"
                      onClick={handleLoadMore}
                    >
                      {cardItems.length / 10 < sliceCount
                        ? "no more load"
                        : "load more"}
                    </PrimaryButton>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
