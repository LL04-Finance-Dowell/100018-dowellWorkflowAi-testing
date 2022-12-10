import { useState } from "react";
import styles from "./manageFiles.module.css";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate } from "../../features/template/asyncThunks";
import {
  setCurrentWorkflow,
  setToggleManageFileForm,
} from "../../features/app/appSlice";
import { localStorageGetItem } from "../../utils/localStorageUtils";

const ManageFiles = ({ title, children, OverlayComp }) => {
  const userDetail = localStorageGetItem("userDetail");
  const dispatch = useDispatch();
  const { toggleManageFileForm } = useSelector((state) => state.app);

  const handleToggleOverlay = () => {
    if (OverlayComp) {
      dispatch(setToggleManageFileForm(!toggleManageFileForm));
      dispatch(setCurrentWorkflow(null));
    } else {
      const data = {
        created_by: userDetail?.userinfo.username,
        company_id: userDetail?.userinfo.client_admin_id,
      };
      dispatch(createTemplate(data));
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
