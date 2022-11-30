import styles from "./infoTable.module.css";
import { v4 as uuidv4 } from "uuid";

const InfoTable = () => {
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
        {infoTable.map((item, index) => (
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
