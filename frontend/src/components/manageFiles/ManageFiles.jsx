import { useState } from "react";
import styles from "./manageFiles.module.css";
import { BsPlusSquareDotted } from "react-icons/bs";

const ManageFiles = ({ title, children, OverlayComp }) => {
  const [toggleOverlay, setToggleOverlay] = useState(false);

  const handleToggleOverlay = () => {
    setToggleOverlay((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {toggleOverlay && (
        <OverlayComp handleToggleOverlay={handleToggleOverlay} />
      )}
      <div>
        <h2 className={styles.header}>{title}</h2>
        <div onClick={handleToggleOverlay} className={styles.add__Form__toggle}>
          <BsPlusSquareDotted color="black" cursor="pointer" size={70} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default ManageFiles;
