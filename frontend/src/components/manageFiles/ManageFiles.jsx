import { useState } from "react";
import styles from "./manageFiles.module.css";
import { BsPlusSquareDotted } from "react-icons/bs";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const ManageFiles = ({ title, children, OverlayComp }) => {
  const navigate = useNavigate();
  /*   const [toggleOverlay, setToggleOverlay] = useState(false); */
  const { toggleNewFileForm, setToggleNewFileForm } = useAppContext();

  const handleToggleOverlay = () => {
    if (OverlayComp) {
      setToggleNewFileForm((prev) => !prev);
    } else {
      navigate("/");
    }
  };

  return (
    <div className={styles.container}>
      {OverlayComp && toggleNewFileForm && (
        <OverlayComp handleToggleOverlay={handleToggleOverlay} />
      )}
      <div className={styles.content__box}>
        <div>
          <h2 className={styles.header}>{title}</h2>
          <div
            onClick={handleToggleOverlay}
            className={styles.add__Form__toggle}
          >
            <BsPlusSquareDotted color="black" cursor="pointer" size={70} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ManageFiles;
