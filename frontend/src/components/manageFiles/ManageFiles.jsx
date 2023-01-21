import { useState } from "react";
import styles from "./manageFiles.module.css";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate } from "../../features/template/asyncThunks";
import {
  setCurrentWorkflow,
  setToggleManageFileForm,
} from "../../features/app/appSlice";
import { useNavigate } from "react-router-dom";

const ManageFiles = ({ title, children, OverlayComp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDetail } = useSelector((state) => state.auth);
  const { toggleManageFileForm } = useSelector((state) => state.app);

  const handleToggleOverlay = () => {
    if (OverlayComp) {
      dispatch(setToggleManageFileForm(!toggleManageFileForm));
      dispatch(setCurrentWorkflow(null));
    } else {
      if (title.toLowerCase() === "template") {
        const data = {
          created_by: userDetail?.userinfo.username,
          company_id: userDetail?.portfolio_info[0].org_id,
          data_type: userDetail?.portfolio_info[0].data_type,
        };
        dispatch(createTemplate(data));
      }
      if (title.toLowerCase() === "proccess") {
        navigate("/workflows/set-workflow");
      }
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
