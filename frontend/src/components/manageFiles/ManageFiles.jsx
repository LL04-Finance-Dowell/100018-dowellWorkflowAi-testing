import { useState } from "react";
import styles from "./manageFiles.module.css";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate } from "../../features/template/asyncThunks";
import {
  setCurrentWorkflow,
  setToggleManageFileForm,
} from "../../features/app/appSlice";

const ManageFiles = ({ title, children, OverlayComp }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toggleManageFileForm } = useSelector((state) => state.app);

  const handleToggleOverlay = () => {
    if (OverlayComp) {
      dispatch(setToggleManageFileForm(!toggleManageFileForm));
      dispatch(setCurrentWorkflow(null));
    } else {
      const data = {
        created_by: userDetail?.userinfo.username,
        company_id: userDetail?.portfolio_info.org_id,
        data_type: userDetail?.portfolio_info.data_type,
      };
      dispatch(createTemplate(data));
    }
  };

  return (
    <div className={styles.container}>
      {OverlayComp && toggleManageFileForm && (
        <OverlayComp handleToggleOverlay={handleToggleOverlay} />
      )}
      <h2 className={styles.page__header}>{title} Page</h2>
      <div className={styles.content__box}>
        <div>
          <h2 className={styles.header}>New {title}</h2>
          <div
            onClick={handleToggleOverlay}
            className={styles.add__Form__toggle}
          >
            <i>
              <BsPlusLg cursor="pointer" size={25} />
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
