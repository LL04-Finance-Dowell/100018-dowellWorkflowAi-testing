import React from "react";
import styles from "./userDetail.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";

const UserDetail = () => {
  const {
    userDetail: {
      portfolio_info: {
        member_type,
        portfolio_name,
        username,
        data_type,
        operations_right,
        role,
        org_name,
      },
    },
  } = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <BsThreeDotsVertical cursor="pointer" size={25} />
      <div className={styles.info__box}>
        <span>
          <span className={styles.title}>Member Type:</span> {member_type}
        </span>
        <span>
          <span className={styles.title}>Portfolio Name:</span> {portfolio_name}
        </span>
        <span>
          <span className={styles.title}>Username:</span> {username}
        </span>
        <span>
          <span className={styles.title}>Data type:</span> {data_type}
        </span>
        <span>
          <span className={styles.title}>Operation Righ:</span>{" "}
          {operations_right}
        </span>
        <span>
          <span className={styles.title}>Role:</span> {role}
        </span>
        <span>
          <span className={styles.title}>Organization Name:</span> {org_name}
        </span>
      </div>
    </div>
  );
};

export default UserDetail;
