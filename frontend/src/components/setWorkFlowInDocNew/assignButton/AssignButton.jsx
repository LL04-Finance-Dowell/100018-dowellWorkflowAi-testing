import React from "react";
import { ImSpinner7 } from "react-icons/im";
import { motion } from "framer-motion";
import { PrimaryButton } from "../../styledComponents/styledComponents";
import { useTranslation } from 'react-i18next';

const AssignButton = ({ buttonText, loading }) => {
  const { t } = useTranslation();
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
      <span> {t(`${buttonText}`)}</span>
    </PrimaryButton>
  );
};

export default AssignButton;
