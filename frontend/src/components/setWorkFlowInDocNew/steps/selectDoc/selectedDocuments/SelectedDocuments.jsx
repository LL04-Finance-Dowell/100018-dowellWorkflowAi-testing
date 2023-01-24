import React from "react";
import { PrimaryButton } from "../../../../styledComponents/styledComponents";
import styles from "./selectedDocuments.module.css";

const SelectedDocuments = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        Copies of the selected document (select for processing)
      </h2>
      <div className={styles.selected__doc__box}>
        <ol>
          <li>document clone 1</li>
          <li>document clone 2</li>
          <li>document clone 3</li>
          <li>document clone 4</li>
        </ol>
      </div>
      <PrimaryButton hoverBg="success">
        Add selected document copies to process (Break processing of unselected)
      </PrimaryButton>
    </div>
  );
};

export default SelectedDocuments;
