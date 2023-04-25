import React from "react";
import styles from "./userDetail.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const UserDetail = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/*  <BsThreeDotsVertical cursor="pointer" size={25} /> */}
      <div className={styles.info__box}>
        <span>
          <span className={styles.title}>{t("Member Type")}:</span>{" "}
          {userDetail.portfolio_info[0].member_type}
        </span>
        <span>
          <span className={styles.title}>{t("Portfolio Name")}:</span>{" "}
          {userDetail.portfolio_info[0].portfolio_name}
        </span>
        <span>
          <span className={styles.title}>{t("Username")}:</span>{" "}
          {userDetail.portfolio_info[0].username}
        </span>
        <span>
          <span className={styles.title}>{t("Data type")}:</span>{" "}
          {userDetail.portfolio_info[0].data_type}
        </span>
        <span>
          <span className={styles.title}>{t("Operation Rights")}:</span>{" "}
          {userDetail.portfolio_info[0].operations_right}
        </span>
        <span>
          <span className={styles.title}>{t("Role")}:</span>{" "}
          {userDetail.portfolio_info[0].role}
        </span>
        <span>
          <span className={styles.title}>{t("Organization Name")}:</span>{" "}
          {userDetail.portfolio_info[0].org_name}
        </span>
      </div>
    </div>
  );
};

export default UserDetail;
