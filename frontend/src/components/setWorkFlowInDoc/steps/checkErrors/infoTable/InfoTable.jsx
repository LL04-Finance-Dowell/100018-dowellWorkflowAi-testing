import styles from './infoTable.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';

const InfoTable = () => {
  const { processSteps, docCurrentWorkflow } = useSelector(
    (state) => state.processes
  );
  const [tableInfoToDisplay, setTableInfoToDisplay] = useState([]);

  useEffect(() => {
    if (!docCurrentWorkflow) return setTableInfoToDisplay([]);

    const skippedStepObj = { id: uuidv4(), content: 'Step skipped' };
    let infoDataToDisplay = [];
    const currentWorkflowDataToFormat = processSteps.find(
      (step) => step.workflow === docCurrentWorkflow._id
    );

    if (!currentWorkflowDataToFormat) return setTableInfoToDisplay([]);

    currentWorkflowDataToFormat.steps.forEach((step) => {
      let [newTableDataObj, currentDataObj] = [
        {},
        {
          id: uuidv4(),
          content: `${step.member ? step.member + ', ' : ''} ${
            step.location ? step.location + ', ' : ''
          } ${step.start_time ? step.start_time + ', ' : ''} ${
            step.end_time ? step.end_time + ', ' : ''
          } ${step.step_name ? step.step_name + ', ' : ''}`,
        },
      ];

      if (step.skip) {
        newTableDataObj = {
          id: uuidv4(),
          content: `Step skipped, ${
            step.start_time ? step.start_time + ', ' : ''
          } ${step.end_time ? step.end_time + ', ' : ''} ${
            step.step_name ? step.step_name + ', ' : ''
          }`,
          addEdits: [skippedStepObj],
          approves: [skippedStepObj],
          comments: [skippedStepObj],
          views: [skippedStepObj],
        };
        return infoDataToDisplay.push(newTableDataObj);
      }

      const existingTableObj = infoDataToDisplay.find(
        (elem) => elem.content === step.display_before
      );

      if (existingTableObj) {
        if (step.rights === 'ADD/EDIT')
          return existingTableObj.addEdits.push(currentDataObj);
        if (step.rights === 'APPROVE')
          return existingTableObj.approves.push(currentDataObj);
        if (step.rights === 'COMMENT')
          return existingTableObj.comments.push(currentDataObj);
        if (step.rights === 'VIEW')
          return existingTableObj.views.push(currentDataObj);
      }

      newTableDataObj = {
        id: uuidv4(),
        content: step.display_before ? step.display_before : '',
        addEdits: step.rights === 'ADD/EDIT' ? [currentDataObj] : [],
        approves: step.rights === 'APPROVE' ? [currentDataObj] : [],
        comments: step.rights === 'COMMENT' ? [currentDataObj] : [],
        views: step.rights === 'VIEW' ? [currentDataObj] : [],
      };

      infoDataToDisplay.push(newTableDataObj);
    });

    setTableInfoToDisplay(infoDataToDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processSteps]);

  if (tableInfoToDisplay.length === 0) return <></>;

  return (
    <div>
      <table className={styles.info__table}>
        <tr>
          <th>Content</th>
          <th>Add/Edit & Sign</th>
          <th>Approve & Sign</th>
          <th>Comment & Sign</th>
          <th>View & Sign</th>
        </tr>
        {tableInfoToDisplay.map((item, index) => (
          <tr id={item.id}>
            <td>
              <h2 className={`${styles.title__content} h2-small`}>
                {`00${index + 1} ${item.content}`}
              </h2>
            </td>
            <td>
              <div>
                {item.addEdits.map((addEdit) => (
                  <span key={addEdit.id}>{addEdit.content}</span>
                ))}
              </div>
            </td>
            <td>
              <div>
                {item.approves.map((approve) => (
                  <span key={approve.id}>{approve.content}</span>
                ))}
              </div>
            </td>
            <td>
              <div>
                {item.comments.map((comment) => (
                  <span key={comment.id}>{comment.content}</span>
                ))}
              </div>
            </td>
            <td>
              <div>
                {item.views.map((view) => (
                  <span key={view.id}>{view.content}</span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default InfoTable;

export const infoTable = [
  {
    id: uuidv4(),
    content: 'date',
    addEdits: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    approves: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    comments: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    views: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
  },
  {
    id: uuidv4(),
    content: 'details',
    addEdits: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    approves: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    comments: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    views: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
  },
  {
    id: uuidv4(),
    content: 'sign',
    addEdits: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    approves: [],
    comments: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
    views: [
      {
        id: uuidv4(),
        content: 'Member Name, Location, Start date, End date, Workflow, Step',
      },
    ],
  },
];
