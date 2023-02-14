import { useState } from "react";
import styles from "./selectWorkflow.module.css";
import SelectWorkflowBoxes from "./selectWorkflowBoxes/SelectWorkflowBoxes";
import { useEffect } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
import { useDispatch, useSelector } from "react-redux";
import SelectedWorkflows from "./selectedWorkflow/SelectedWorkflows";
import { PrimaryButton } from "../../../styledComponents/styledComponents";
import {
  removeFromSelectedWorkflowsToDocGroup,
  setWfToDocument,
} from "../../../../features/app/appSlice";
import { contentDocument } from "../../../../features/document/asyncThunks";

const SelectWorkflow = () => {
  const dispatch = useDispatch();
  const { currentDocToWfs } = useSelector((state) => state.app);

  const handleRemove = () => {
    dispatch(removeFromSelectedWorkflowsToDocGroup());
  };

  const handleConnectWfToDoc = () => {
    dispatch(setWfToDocument());
    if (currentDocToWfs) {
      const data = { document_id: currentDocToWfs._id };
      console.log(data, "dataaaaaaaaaaaaaaaaaa");
      // dispatch(contentDocument(data));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} h2-small step-title align-left`}>
        2. Select a Workflow to add to the selected document
      </h2>
      <div className={styles.content__box}>
        <SelectWorkflowBoxes />
        <SelectedWorkflows />
        <div className={styles.button__container}>
          <PrimaryButton onClick={handleRemove} hoverBg="error">
            Remove Selected Workflows from document
          </PrimaryButton>
          <PrimaryButton onClick={handleConnectWfToDoc} hoverBg="success">
            Add Selected Workflows to document
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default SelectWorkflow;
