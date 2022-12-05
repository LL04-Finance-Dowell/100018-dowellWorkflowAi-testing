import { useState } from "react";
import styles from "./manageFiles.module.css";
import { BsPlusLg } from "react-icons/bs";
import { useAppContext } from "../../contexts/AppContext";
import { useDispatch } from "react-redux";
import { createTemplate } from "../../features/template/asyncThunks";
import { dataMaanish } from "../newSidebar/new/New";

const ManageFiles = ({ title, children, OverlayComp }) => {
  const dispatch = useDispatch();
  const { toggleNewFileForm, setToggleNewFileForm } = useAppContext();

  const handleToggleOverlay = () => {
    if (OverlayComp) {
      setToggleNewFileForm((prev) => !prev);
    } else {
      dispatch(createTemplate(dataMaanish));
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
            <i>
              <BsPlusLg color="white" cursor="pointer" size={25} />
            </i>
            <h2>Add Workflow</h2>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ManageFiles;
