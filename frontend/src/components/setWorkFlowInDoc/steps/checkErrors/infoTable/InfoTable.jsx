import styles from "./infoTable.module.css";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

const InfoTable = () => {
  const { processSteps } = useSelector((state) => state.app);
  const [ tableInfoToDisplay, setTableInfoToDisplay ] = useState([]);

  useEffect(() => {
    const skippedStepObj = { id: uuidv4(), content: "Step skipped" };
    let infoDataToDisplay = [];

    processSteps.forEach(step => {
      let [ newTableDataObj, currentDataObj ] = [ {}, { id: uuidv4(), content: step.members && typeof step.members === "string" ? step.members.slice(step.members.indexOf("_") + 1) : ""} ];

      if (step.skipped) {
        newTableDataObj = {
          id: uuidv4(),
          content: "Step skipped",
          addEdits: [skippedStepObj],
          approves: [skippedStepObj],
          comments: [skippedStepObj],
          views: [skippedStepObj],
        }
        return infoDataToDisplay.push(newTableDataObj)
      }

      const existingTableObj = infoDataToDisplay.find(elem => elem.content === step?.displayDoc.split("_")[1]);
      
      if (existingTableObj) {

        if (step.taskFeature === "Add/Edit") return existingTableObj.addEdits.push(currentDataObj)
        if (step.taskFeature === "Approve") return existingTableObj.approves.push(currentDataObj)
        if (step.taskFeature === "Comment") return existingTableObj.comments.push(currentDataObj)
        if (step.taskFeature === "View") return existingTableObj.views.push(currentDataObj)

      }
      
      newTableDataObj = {
        id: uuidv4(),
        content: step?.displayDoc.split("_")[1],
        addEdits: step.taskFeature === "Add/Edit" ? [currentDataObj] : [],
        approves: step.taskFeature === "Approve" ? [currentDataObj] : [],
        comments: step.taskFeature === "Comment" ? [currentDataObj] : [],
        views: step.taskFeature === "View" ? [currentDataObj] : [],
      }
      
      infoDataToDisplay.push(newTableDataObj);

    });
    
    setTableInfoToDisplay(infoDataToDisplay);

  }, [processSteps])

  if (tableInfoToDisplay.length === 0) return <></>

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
    content: "date",
    addEdits: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    approves: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    comments: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    views: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
  },
  {
    id: uuidv4(),
    content: "details",
    addEdits: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    approves: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    comments: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    views: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
  },
  {
    id: uuidv4(),
    content: "sign",
    addEdits: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    approves: [],
    comments: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
    views: [
      {
        id: uuidv4(),
        content: "Member Name, Location, Start date, End date, Workflow, Step",
      },
    ],
  },
];
