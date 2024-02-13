import { useState } from "react";
import Overlay from "../../../../../../manageFiles/overlay/Overlay";
import overlayStyles from "../../../../../../manageFiles/overlay/overlay.module.css";
import styles from "./CreateGroup.module.css";
import { useTranslation } from "react-i18next";

const CreateGroup = ({ handleOverlay }) => {
  const { t } = useTranslation();
  const [groupTitle, setGroupTitle] = useState();
  const handleChange = (e) => {
    setGroupTitle(e.target.value);
  };
  return (
    <Overlay title="Create Group" handleToggleOverlay={handleOverlay}>
      <div className={styles.form__container}>
        <div className={overlayStyles.input__box}>
          <label>
            {t("Group Title")} <span>*</span>
          </label>
          <form>
          <div className={styles.form__box} style={{ display: "flex" }}>
          <input value={groupTitle} onChange={handleChange} />
       
          </div>
          </form>
          <div className={styles.button__group}>
            <button
              onClick={handleOverlay}
              className={styles.cancel__button}
            >
              {t("cancel")}
            </button>
            <button
           
              className={styles.add__button}
              type="button"
           
          
            >
              { t("save")}
            </button>
          </div>
        
        </div>
      </div>
    </Overlay>
  );
};

export default CreateGroup;
