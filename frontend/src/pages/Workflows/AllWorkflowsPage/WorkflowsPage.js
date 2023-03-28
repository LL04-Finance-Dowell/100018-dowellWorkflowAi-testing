import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import { v4 as uuidv4 } from "uuid";
import "./style.css";
import CreateWorkflows from "../../../components/manageFiles/files/workflows/createWorkflows/CreateWorkflow";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	allWorkflows,
	mineWorkflows,
	savedWorkflows,
} from "../../../features/workflow/asyncTHunks";
import WorkflowCard from "../../../components/hoverCard/workflowCard/WorkflowCard";
import { useNavigate } from "react-router-dom";

const WorkflowsPage = ({ home, showOnlySaved, showOnlyTrashed }) => {
	const { userDetail } = useSelector((state) => state.auth);
	const {
		minedWorkflows,
		mineStatus,
		savedWorkflowItems,
		savedWorkflowStatus,
		allWorkflows: allWorkflowsArray,
		allWorkflowsStatus,
	} = useSelector((state) => state.workflow);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const data = {
			company_id: userDetail?.portfolio_info[0].org_id,
		};

		/*   if (savedWorkflowStatus === "idle") dispatch(savedWorkflows(saveddata));
		if (mineStatus === "idle") dispatch(mineWorkflows(data)); */

		if (allWorkflowsStatus === "idle") dispatch(allWorkflows(data.company_id));
	}, [userDetail]);

	useEffect(() => {
		if (showOnlySaved) navigate("#saved-workflows")
		if (showOnlyTrashed) navigate("#trashed-workflows")
		if (home) navigate('#drafts')
	}, [showOnlySaved, showOnlyTrashed, home])

	console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwww", allWorkflowsArray);

	return (
		<WorkflowLayout>
			<div id="new-workflow">
				<ManageFiles title="Workflows" OverlayComp={CreateWorkflows} removePageSuffix={true}>
					{
						home ? <div id="drafts">
							<SectionBox
								cardBgColor="#1ABC9C"
								title="drafts"
								cardItems={
									allWorkflowsArray &&
									allWorkflowsArray.length &&
									allWorkflowsArray.filter(
										(item) =>
											item.created_by === userDetail?.portfolio_info[0].username
									).filter(item => item.workflows && item.workflows?.data_type === userDetail?.portfolio_info[0]?.data_type)
								}
								status={allWorkflowsStatus}
								Card={WorkflowCard}
								itemType={"workflows"}
							/>
						</div> : <></>
					}
					{
						showOnlySaved ? <div id="saved-workflows">
							<SectionBox
								Card={WorkflowCard}
								cardBgColor="#1ABC9C"
								title="saved workflows"
								status={allWorkflowsStatus}
								cardItems={allWorkflowsArray.filter(item => item.workflows && item.workflows?.data_type === userDetail?.portfolio_info[0]?.data_type)}
								itemType={"workflows"}
							/>
						</div> : <></>
					}
					{
						showOnlyTrashed ? <div id="trashed-workflows">
							<SectionBox
								Card={WorkflowCard}
								cardBgColor="#1ABC9C"
								title="trashed workflows"
								status={allWorkflowsStatus}
								cardItems={[]}
								itemType={"workflows"}
							/>
						</div> : <></>
					}
				</ManageFiles>
			</div>
		</WorkflowLayout>
	);
};

export default WorkflowsPage;

export const createWorkflowsByMe = [
	{ id: uuidv4() },
	{ id: uuidv4() },
	{ id: uuidv4() },
	{ id: uuidv4() },
	{ id: uuidv4() },
];

export const drafts = [{ id: uuidv4() }];
