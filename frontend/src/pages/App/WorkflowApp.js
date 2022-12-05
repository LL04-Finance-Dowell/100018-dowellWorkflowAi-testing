import styles from "./workflowApp.module.css";
import CustomerSupport from "../../components/landingPage/customerSupport/CustomerSupport";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { v4 as uuidv4 } from "uuid";
import SectionBox from "../../components/manageFiles/sectionBox/SectionBox";
import HandleTasks from "../../components/landingPage/handleTasks/HandleTasks";
import FlipMenu from "../../components/flipMenu/FlipMenu";

const WorkflowApp = () => {
  return (
    <WorkflowLayout>
      <div className={styles.container}>
        <CustomerSupport />
        <FlipMenu />
        <div className={styles.section__container}>
          {notifications.map((item) => (
            <SectionBox
              key={item.id}
              title={`notifications - ${item.title}`}
              cardItems={item.items}
              cardBgColor={item.cardBgColor}
            />
          ))}
          <div className={styles.tasks__container}>
            <HandleTasks feature="incomplate" tasks={incomplateTasks} />
            <HandleTasks feature="complated" tasks={complatedTasks} />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
};

export default WorkflowApp;

export const notifications = [
  {
    id: uuidv4(),
    title: "documents",
    cardBgColor: "#1ABC9C",
    items: [
      { id: uuidv4() },
      { id: uuidv4() },
      { id: uuidv4() },
      { id: uuidv4() },
      { id: uuidv4() },
    ],
  },
  {
    id: uuidv4(),
    title: "templates",
    cardBgColor: null,
    items: [{ id: uuidv4() }, { id: uuidv4() }, { id: uuidv4() }],
  },
  {
    id: uuidv4(),
    title: "workflows",
    cardBgColor: null,
    items: [{ id: uuidv4() }, { id: uuidv4() }],
  },
];

export const incomplateTasks = [
  {
    id: uuidv4(),
    parent: "documents",
    children: [
      { id: uuidv4(), child: "document name" },
      { id: uuidv4(), child: "document name" },
    ],
  },
  {
    id: uuidv4(),
    parent: "templates",
    children: [
      { id: uuidv4(), child: "templates name" },
      { id: uuidv4(), child: "templates name" },
    ],
  },
  {
    id: uuidv4(),
    parent: "workflows",
    children: [
      { id: uuidv4(), child: "workflows name" },
      { id: uuidv4(), child: "workflows name" },
    ],
  },
];

export const complatedTasks = [
  {
    id: uuidv4(),
    parent: "documents",
    isOpen: false,
    children: [
      { id: uuidv4(), child: "document name" },
      { id: uuidv4(), child: "document name" },
    ],
  },
  {
    id: uuidv4(),
    parent: "templates",
    isOpen: false,
    children: [
      { id: uuidv4(), child: "templates name" },
      { id: uuidv4(), child: "templates name" },
    ],
  },
  {
    id: uuidv4(),
    parent: "workflows",
    isOpen: false,
    children: [
      { id: uuidv4(), child: "workflows name" },
      { id: uuidv4(), child: "workflows name" },
    ],
  },
];
