import { useEffect, useState } from "react";
import styles from "./timeInput.module.css";

const TimeInput = ({ placeHolder }) => {
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [period, setPeriod] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      `${
        period ? hours.padStart(2, "0") : Number(hours) + 12
      }:${minutes.padStart(2, "0")}`
    );
  }, [period, minutes, hours]);

  return (
    <div className={styles.time__container}>
      <input
        className={styles.main__input}
        value={time}
        type="text"
        placeholder={placeHolder}
        onChange={(e) => setTime(e.target.value)}
      />
      <div className={styles.time__box}>
        <input
          className={styles.time__input}
          value={hours.padStart(2, "0")}
          onChange={(e) => setHours(e.target.value)}
          style={{ textAlign: "center" }}
          min="1"
          max="12"
          type="number"
        />
        <span>:</span>
        <input
          className={styles.time__input}
          name="minutes"
          type="number"
          min="0"
          max="59"
          value={minutes.padStart(2, "0")}
          onChange={(e) => setMinutes(e.target.value)}
        />
        <input
          className={styles.period__input}
          name="period"
          type="text"
          value={period ? "AM" : "PM"}
          onClick={(e) => setPeriod((prev) => (prev = !prev))}
        />
      </div>
    </div>
  );
};

export default TimeInput;
