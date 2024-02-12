import React from "react";
import styles from "./Popup.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { PrimaryButton } from "../styledComponents/styledComponents";
import { setPopupIsOpen, setCurrentMessage } from "../../features/app/appSlice";
import { useDispatch, useSelector } from "react-redux";

const Popup = ({ isOpen, message }) => {
  const dispatch = useDispatch();
  const { popupIsOpen, currentMessage } = useSelector((state) => state.app);

  const onClose = () => {
    dispatch(setPopupIsOpen(false));
  };

  return currentMessage ? (
    <div className={styles.outer_div}>
      <div className={styles.inner_div}>
        <div
          className={styles.close_btn}
          onClick={() => {
            dispatch(setPopupIsOpen(false));
          }}
        >
          <AiOutlineClose />
        </div>

        <h5 style={{ textAlign: "center" }}>{currentMessage}</h5>
      </div>
    </div>
  ) : (
    <div className={styles.outer_div}>
      <div className={styles.inner_div}>
        <div
          className={styles.close_btn}
          onClick={() => {
            dispatch(setPopupIsOpen(false));
          }}
        >
          <AiOutlineClose />
        </div>

        <h5 className={styles.error_msg}>
          {"An Error Occured while creating a Process"}
        </h5>
        <div className={styles.btn_div}>
          {/* <div
                        className={styles.danger_btn}
                        onClick={() => {
                            dispatch(setPopupIsOpen(false));

                        }}
                    >
                        Cancel
                    </div> */}
          <div
            className={styles.primry_btn}
            onClick={() => {
              dispatch(setPopupIsOpen(false));
            }}
          >
            Retry
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
