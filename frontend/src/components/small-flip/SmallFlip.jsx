import Button from "react-bootstrap/Button";
import styles from "../small-flip/smallFlip.module.css";
const SmallFlip = (props) => {
  return (
    <div class={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div
          className={styles.flipCardFront}
          style={{ backgroundColor: `${props.color}` }}
        >
          <span className={styles.customer}>
            <div style={{ display: "grid" }}>
              <span style={{ color: "#ffff", fontSize: "large" }}>
                {props.icon}
              </span>
              <span style={{ color: "#ffff", paddingBottom: "5px" }}>
                {" "}
                {props.content}
              </span>
            </div>
          </span>
          <span className={styles.main}></span>
        </div>
        <div
          className={styles.flipCardBack}
          style={{ paddingTop: `${props.padding}` }}
        >
          <Button
            variant="secondary"
            style={{
              width: "70%",
              height: `${props.size}`,
              border: "3px solid #FFFF",
            }}
          >
            {props.button}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmallFlip;
