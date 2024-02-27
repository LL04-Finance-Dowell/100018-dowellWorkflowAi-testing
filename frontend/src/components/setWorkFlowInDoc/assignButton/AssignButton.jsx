import React from "react";
import styles from "./assignButton.module.css";
import { ImSpinner7 } from "react-icons/im";
import { motion } from "framer-motion";

const AssignButton = ({ buttonText, loading }) => {
  return (
    <button type="submit" className={`${styles.assign__button}`}>
      {loading && (
        <motion.span
          animate={{
            rotate: 360,
            transition: { duration: 2, repeat: "infinity" },
          }}
        >
          <ImSpinner7 size={12} color="white" />
        </motion.span>
      )}
      <span> {buttonText}</span>
    </button>
  );
};

export default AssignButton;
