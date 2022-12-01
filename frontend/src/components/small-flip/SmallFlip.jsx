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
<<<<<<< HEAD
              <span style={{ color: "#ffff", fontSize: "large" }}>
=======
              <span
                style={{
                  color: "#ffff",
                  fontSize: "large",
                }}
              >
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
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
<<<<<<< HEAD
              width: "70%",
              height: `${props.size}`,
              border: "3px solid #FFFF",
=======
              width: ` ${props.width}`,
              height: `${props.size}`,
              border: "3px solid #FFFF",
              marginBottom: `${props.btm}`,
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
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
