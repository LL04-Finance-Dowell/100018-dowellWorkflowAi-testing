import React from "react";
import styles from "./selectedWorkflows.module.css";
import { v4 as uuidv4 } from "uuid";
import InfoBox from "../../../../infoBox/InfoBox";

const SelectedWorkflows = () => {
  return (
    <div className={`${styles.container}  selected-info-box-container`}>
      {selectedWorkdlows.map((workflow, index) => (
        <div key={workflow._id} className={styles.box__container}>
          <InfoBox
            boxType="dark"
            items={workflow.items}
            title={workflow.title}
            type="list"
          />
          <div className={styles.selected__box}>
            <span>{(index + 1).toString().padStart(2, "0")}.</span>
            <input type="checkbox" />
            <span>Select to remove</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedWorkflows;

export const selectedWorkdlows = [
  {
    _id: uuidv4(),
    title: "workflow",
    items: [
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
    ],
  },
  {
    _id: uuidv4(),
    title: "workflow",
    items: [
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
    ],
  },
  {
    _id: uuidv4(),
    title: "workflow",
    items: [
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
      { _id: uuidv4(), content: "portfolio 1", isSelected: false },
    ],
  },
];
