import styles from "../hover-card/hoverCard.module.css";
import WifiChannelIcon from "@mui/icons-material/WifiChannel";
const HoverCard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.front}>
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
          <button>Click Here</button>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.front}>
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
          <button>Click Here</button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.front}>
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
          <button>Click Here</button>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.front}>
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
          <button>Click Here</button>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.front}>
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
          <button>Click Here</button>
        </div>
      </div>
    </div>
  );
};

export default HoverCard;
