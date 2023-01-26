import React from "react";
import styles from "./selectedWorkflows.module.css";
import { v4 as uuidv4 } from "uuid";
import InfoBox from "../../../../infoBox/InfoBox";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWorkflowsToDoc } from "../../../../../features/app/appSlice";

const SelectedWorkflows = () => {
  const dispatch = useDispatch();

  const { selectedWorkflowsToDoc, currentDocToWfs } = useSelector(
    (state) => state.app
  );

  console.log("selectedWorkflowsToDoc", selectedWorkflowsToDoc);

  const handleRemove = (workflow) => {
    dispatch(setSelectedWorkflowsToDoc(workflow));
  };

  return (
    <div className={`${styles.container}  selected-info-box-container`}>
      {selectedWorkflowsToDoc &&
        selectedWorkflowsToDoc?.map((workflow, index) => (
          <div key={workflow._id} className={styles.box__container}>
            <InfoBox
              boxType="dark"
              items={selectedWorkdlows[0].items}
              title={workflow.workflows.workflow_title}
              type="list"
            />
            <div className={styles.selected__box}>
              <span>{(index + 1).toString().padStart(2, "0")}.</span>
              <input
                onClick={() => handleRemove(workflow)}
                checked={workflow.isSelected}
                type="checkbox"
              />
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
