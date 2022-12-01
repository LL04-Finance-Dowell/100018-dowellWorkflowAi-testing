import styles from "../hover-card/hoverCard.module.css";
import WifiChannelIcon from "@mui/icons-material/WifiChannel";
const HoverCard = (props) => {
  return (
<<<<<<< HEAD
    <div className={styles.wrapper}>
=======
    <div style={{ zIndex: "0" }} className={styles.wrapper}>
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
      <div className={styles.card}>
        <div
          style={{ backgroundColor: `${props.color}` }}
          className={styles.front}
        >
          <span className={styles.icon}>
            <WifiChannelIcon fontSize="large" />
          </span>
          <span className={styles.sign}>To be signed</span>
          <span className={styles.file}>File Name</span>
        </div>
        <div className={styles.info}>
          <h4
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "100px",
              color: "white",
            }}
          >
            (File Name)
          </h4>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              color: "white",
            }}
          >
            Thum nail of file
          </p>
<<<<<<< HEAD
          <button>Click Here</button>
=======
          <button
            style={{
              paddingLeft: "28px",
              margin: "auto",
              width: "50%",
              border: "1px solid white",
            }}
          >
            Click Here
          </button>
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
        </div>
      </div>
    </div>
  );
};

export default HoverCard;
