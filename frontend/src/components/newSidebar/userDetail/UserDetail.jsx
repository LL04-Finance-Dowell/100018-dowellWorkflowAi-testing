import React from "react";
import styles from "./userDetail.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";

const UserDetail = () => {
  const { userDetail } = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <BsThreeDotsVertical cursor="pointer" size={25} />
      <div className={styles.info__box}>
        <span>
          <span className={styles.title}>Member Type:</span>{" "}
          {userDetail.portfolio_info[0].member_type}
        </span>
        <span>
          <span className={styles.title}>Portfolio Name:</span>{" "}
          {userDetail.portfolio_info[0].portfolio_name}
        </span>
        <span>
          <span className={styles.title}>Username:</span>{" "}
          {userDetail.portfolio_info[0].username}
        </span>
        <span>
          <span className={styles.title}>Data type:</span>{" "}
          {userDetail.portfolio_info[0].data_type}
        </span>
        <span>
          <span className={styles.title}>Operation Righ:</span>{" "}
          {userDetail.portfolio_info[0].operations_right}
        </span>
        <span>
          <span className={styles.title}>Role:</span>{" "}
          {userDetail.portfolio_info[0].role}
        </span>
        <span>
          <span className={styles.title}>Organization Name:</span>{" "}
          {userDetail.portfolio_info[0].org_name}
        </span>
      </div>
    </div>
  );
};

export default UserDetail;
