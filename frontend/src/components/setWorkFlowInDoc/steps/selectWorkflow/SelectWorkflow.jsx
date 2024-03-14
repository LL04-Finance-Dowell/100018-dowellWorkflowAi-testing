import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import InfoBoxes from "./ınfoBoxes/InfoBoxes";
import styles from "./selectWorkflow.module.css";
import useWindowSize from "../../../../hooks/useWindowSize";
import WorkflowSwiper from "./workFlowSwiper/WorkflowSwiper";

const SelectWorkflow = () => {
	const size = useWindowSize();
	/*   const [selectedWorkFlows, setSelectedWorkFlows] = useState([]); */
	const { selectedWorkflowsToDoc } = useSelector((state) => state.processes);

	const [largeLoop, setLargeLoop] = useState(false);
	const [smallLoop, setSmallLoop] = useState(false);

	useEffect(() => {
		selectedWorkflowsToDoc.length > 3
			? setLargeLoop(true)
			: setLargeLoop(false);
		selectedWorkflowsToDoc.length > 2
			? setSmallLoop(true)
			: setSmallLoop(false);
	}, [selectedWorkflowsToDoc, size.width]);

	return (
		<div className={styles.container}>
			<InfoBoxes />
			<h2 className={`${styles.title} h2-small step-title`}>
				2. Select a Workflow to add to the selected document
			</h2>
			{selectedWorkflowsToDoc.length > 0 && size.width > 1025 ? (
				<WorkflowSwiper
					loop={largeLoop}
					perSlide={3}
				/*  selectedWorkFlows={selectedWorkflowsToDoc} */
				/>
			) : (
				<WorkflowSwiper
					loop={smallLoop}
					perSlide={2}
				/*  selectedWorkFlows={selectedWorkflowsToDoc} */
				/>
			)}
		</div>
	);
};

export default SelectWorkflow;
