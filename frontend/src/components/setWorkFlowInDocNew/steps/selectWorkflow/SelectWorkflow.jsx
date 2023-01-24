import { useState } from "react";
import styles from "./selectWorkflow.module.css";
import SelectWorkflowBoxes from "./selectWorkflowBoxes/SelectWorkflowBoxes";
import { useEffect } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
import { useSelector } from "react-redux";
import SelectedWorkflows from "./selectedWorkflow/SelectedWorkflows";
import { PrimaryButton } from "../../../styledComponents/styledComponents";

const SelectWorkflow = () => {
  const size = useWindowSize();
  /*   const [selectedWorkFlows, setSelectedWorkFlows] = useState([]); */
  const { selectedWorkflowsToDoc } = useSelector((state) => state.app);

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} h2-small step-title align-left`}>
        2. Select a Workflow to add to the selected document
      </h2>
      <div className={styles.content__box}>
        <SelectWorkflowBoxes />
        <SelectedWorkflows />
        <div className={styles.button__container}>
          <PrimaryButton hoverBg="error">
            Remove Selected Workflows from document
          </PrimaryButton>
          <PrimaryButton hoverBg="success">
            Add Selected Workflows to document
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default SelectWorkflow;
