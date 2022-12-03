import { ImHome3 } from "react-icons/im";
import { FaPowerOff } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { AiTwotoneSetting } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mode__box}>
        <h2>6</h2>
        <h2>Learning Mode</h2>
      </div>
      <div className={styles.icon__box}>
        {icons.map((item) => (
          <i key={item.id}>
            <item.icon size={28} />
          </i>
        ))}
      </div>
    </div>
  );
};

export default Footer;

export const icons = [
  { id: uuidv4(), icon: ImHome3 },
  { id: uuidv4(), icon: FaPowerOff },
  { id: uuidv4(), icon: FaUserAlt },
  { id: uuidv4(), icon: FaShieldAlt },
  { id: uuidv4(), icon: AiTwotoneSetting },
];
