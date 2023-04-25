import React from "react";
import styles from "./spinner.module.css";
import { motion } from "framer-motion";
import {
  RiArrowUpLine,
  RiArrowRightLine,
  RiArrowDownLine,
} from "react-icons/ri";
import { useTranslation } from "react-i18next";

const Spinner = () => {
  const { t } = useTranslation();
  const container = {
    hidden: { opacity: 1, rotate: 0 },
    show: {
      opacity: 1,
      rotate: 360,
      transition: {
        staggerChildren: 1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
    },
  };

  return (
    <div className={styles.main}>
      <motion.div
        animate={{
          rotate: 360,
          transition: { repeat: Infinity, ease: "linear", duration: 6 },
        }}
        className={styles.container}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={styles.box}
        >
          <motion.div
            variants={item}
            className={`${styles.first__square} ${styles.border}`}
          >
            <div className={styles.first__square__inner}></div>
          </motion.div>
          <motion.div variants={item} className={styles.first__arrow}>
            <RiArrowUpLine size={35} color="black" />
          </motion.div>
          <motion.div
            variants={item}
            className={`${styles.first__circle} ${styles.border}`}
          ></motion.div>
          <motion.div variants={item} className={styles.second__arrow}>
            <RiArrowRightLine size={35} color="black" />
          </motion.div>
          <motion.div
            variants={item}
            className={`${styles.second__square} ${styles.border}`}
          ></motion.div>
          <motion.div variants={item} className={styles.third__arrow}>
            <RiArrowDownLine size={35} color="black" />
          </motion.div>
          <motion.div
            variants={item}
            className={`${styles.second__circle} ${styles.border}`}
          ></motion.div>
        </motion.div>
      </motion.div>
      <div className={styles.text}>{t("Workflow AI")}</div>
    </div>
  );
};

export default Spinner;
