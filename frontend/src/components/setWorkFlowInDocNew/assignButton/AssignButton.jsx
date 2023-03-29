import React from "react";
import { ImSpinner7 } from "react-icons/im";
import { motion } from "framer-motion";
import { PrimaryButton } from "../../styledComponents/styledComponents";

const AssignButton = ({ buttonText, loading }) => {
  return (
    <PrimaryButton hoverBg="success" type="submit">
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
    </PrimaryButton>
  );
};

export default AssignButton;
