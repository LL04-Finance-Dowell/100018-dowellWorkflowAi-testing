import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { SetDocumentId } from '../../../features/app/appSlice';



export default function AddWorkflowModal(props) {
	const { userDetail } = useSelector((state) => state.auth);
	const { ProcessDetail } = useSelector((state) => state.processes);
	const navigate = useNavigate()
	const dispatch = useDispatch()
	// console.log("ProcessDetail", ProcessDetail, userDetail)

	const handleWorkflowSubmit = (e) => {
		dispatch(SetDocumentId(props.step));
		navigate("/workflows/new-set-workflow-document-step")
	};

	return (
		<Modal
			{...props}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			// centered
		>
			<Modal.Header closeButton>
				{/* <Modal.Title>
					Add Workflow to Step
				</Modal.Title> */}
				{/* <div>
					<div className="d-grid gap-2">
						<Button variant='success' onClick={handleWorkflowSubmit}>Add Workflow in this step</Button>
					</div>
				</div> */}
			</Modal.Header>
			<Modal.Body>
				<div>
					<div className="d-grid gap-2">
						<Button variant='success' onClick={handleWorkflowSubmit}>Add Workflow in this step</Button>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button  variant="outlined" onClick={props.onHide}>Not Interested</Button>
			</Modal.Footer>
		</Modal>
	);
}
