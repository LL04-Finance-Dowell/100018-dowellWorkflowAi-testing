import { useState } from "react";
import styles from "./selectWorkflow.module.css";
import InfoBoxes from "./ınfoBoxes/InfoBoxes";
import { useEffect } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
import WorkflowSwiper from "./workFlowSwiper/WorkflowSwiper";

const SelectWorkflow = () => {
  const size = useWindowSize();
  const [selectedWorkFlows, setSelectedWorkFlows] = useState([]);

  const [largeLoop, setLargeLoop] = useState(false);
  const [smallLoop, setSmallLoop] = useState(false);

  useEffect(() => {
    if (selectedWorkFlows.length > 3) setLargeLoop(true);
    if (selectedWorkFlows.length > 2) setSmallLoop(true);
  }, [selectedWorkFlows, size.width]);

  return (
    <div className={styles.container}>
      <InfoBoxes setSelectedWorkFlows={setSelectedWorkFlows} />
      <h2 className={`${styles.title} h2-small step-title`}>
        2. Select a Workflow to add to the selected document
      </h2>
      {selectedWorkFlows.length > 0 && size.width > 1025 ? (
        <WorkflowSwiper
          loop={largeLoop}
          perSlide={3}
          selectedWorkFlows={selectedWorkFlows}
        />
      ) : (
        <WorkflowSwiper
          loop={smallLoop}
          perSlide={2}
          selectedWorkFlows={selectedWorkFlows}
        />
      )}
    </div>
  );
};

export default SelectWorkflow;
