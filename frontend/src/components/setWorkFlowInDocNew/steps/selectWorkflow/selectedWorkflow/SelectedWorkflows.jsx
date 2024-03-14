import React from 'react';
import styles from './selectedWorkflows.module.css';
import { v4 as uuidv4 } from 'uuid';
import InfoBox from '../../../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedWorkflowsToDoc } from '../../../../../features/processes/processesSlice';


const SelectedWorkflows = ({ savedDoc }) => {
  const dispatch = useDispatch();

  const { selectedWorkflowsToDoc } = useSelector((state) => state.processes);

 

  const handleRemove = (elem, workflow) => {
    if (savedDoc) {
      return (elem.target.checked = false);
    }
    dispatch(setSelectedWorkflowsToDoc(workflow));
  };

  return (
    <div className={`${styles.container}  selected-info-box-container`}>
      {selectedWorkflowsToDoc &&
        selectedWorkflowsToDoc?.map((workflow, index) => (
          <div key={workflow._id} className={styles.box__container}>
            <InfoBox
              boxType='dark'
              items={workflow.workflows.steps.map((step) => ({
                _id: step._id,
                content: step.step_name,
              }))}
              title={workflow.workflows.workflow_title}
              type='list'
            />
            <div className={styles.selected__box}>
              <span>{(index + 1).toString().padStart(2, '0')}.</span>
              <input
                onClick={(e) => handleRemove(e, workflow)}
                checked={workflow.isSelected}
                type='checkbox'
                style={{ cursor: savedDoc ? 'not-allowed' : 'initial' }}
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
    title: 'workflow',
    items: [
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
    ],
  },
  {
    _id: uuidv4(),
    title: 'workflow',
    items: [
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
    ],
  },
  {
    _id: uuidv4(),
    title: 'workflow',
    items: [
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
      { _id: uuidv4(), content: 'portfolio 1', isSelected: false },
    ],
  },
];
