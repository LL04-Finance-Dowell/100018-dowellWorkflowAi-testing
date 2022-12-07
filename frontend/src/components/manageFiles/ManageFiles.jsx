import { useState } from "react";
import styles from "./manageFiles.module.css";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate } from "../../features/template/asyncThunks";
import { dataMaanish } from "../newSidebar/new/New";
import { setToggleManageFileForm } from "../../features/app/appSlice";

const ManageFiles = ({ title, children, OverlayComp }) => {
  const dispatch = useDispatch();
  const { toggleManageFileForm } = useSelector((state) => state.app);

  const handleToggleOverlay = () => {
    if (OverlayComp) {
      dispatch(setToggleManageFileForm(!toggleManageFileForm));
    } else {
      dispatch(createTemplate(dataMaanish));
    }
  };

  return (
    <div className={styles.container}>
      {OverlayComp && toggleManageFileForm && (
        <OverlayComp handleToggleOverlay={handleToggleOverlay} />
      )}
      <div className={styles.content__box}>
        <div>
          <h2 className={styles.header}>New {title}</h2>
          <div
            onClick={handleToggleOverlay}
            className={styles.add__Form__toggle}
          >
            <i>
              <BsPlusLg color="white" cursor="pointer" size={25} />
            </i>
            <h2>Add {title}</h2>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ManageFiles;
