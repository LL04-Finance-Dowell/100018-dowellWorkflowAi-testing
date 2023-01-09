import styles from "./workflowApp.module.css";
import CustomerSupport from "../../components/landingPage/customerSupport/CustomerSupport";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { v4 as uuidv4 } from "uuid";
import SectionBox from "../../components/manageFiles/sectionBox/SectionBox";
import HandleTasks from "../../components/landingPage/handleTasks/HandleTasks";
import FlipMenu from "../../components/flipMenu/FlipMenu";
import DocumnetCard from "../../components/hoverCard/documentCard/DocumentCard";
import TemplateCard from "../../components/hoverCard/templateCard/TemplateCard";
import WorkflowCard from "../../components/hoverCard/workflowCard/WorkflowCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DocumentServices } from "../../services/documentServices";
import Spinner from "../../components/spinner/Spinner";

const WorkflowApp = () => {
  const documentServices = new DocumentServices();
  const { userDetail } = useSelector(state => state.auth);
  const [ notificationsLoading, setNotificationLoading ] = useState(true);
  const [ notificationsForUser, setNotificationsForUser ] = useState(notifications);
  
  useEffect(() => {
    if (!userDetail) return setNotificationLoading(false);

    documentServices.signDocument({ "company_id": userDetail?.portfolio_info[0]?.org_id}).then(res => {
      const currentNotifications = notificationsForUser.slice();
      let updatedNotifications = currentNotifications.map(notification => {
        const data = res.data.map(dataObj => {
          let copyOfDataObj = { ...dataObj };
          copyOfDataObj.type = "sign-document";
          return copyOfDataObj
        })
        if (notification.title === "documents") notification.items = data;
        return notification
      })
      setNotificationsForUser(updatedNotifications);
      setNotificationLoading(false);
    }).catch(err => {
      console.log("Failed: ", err.response)
      setNotificationLoading(false);
      console.log("did not fetch documentsss");
    })

  }, [])

  return (
    <WorkflowLayout>
      <div className={styles.container}>
        <CustomerSupport />
        <FlipMenu />
        <div className={styles.section__container}>
          {
            notificationsLoading ? <div>
              <Spinner />
              <p>Notifications loading...</p> 
            </div> :
            notificationsForUser.map((item) => (
              <SectionBox
                key={item.id}
                Card={item.card}
                title={`notifications - ${item.title}`}
                cardItems={item.items}
                cardBgColor={item.cardBgColor}
              />
            ))
          }
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
    card: DocumnetCard,
    items: [{ id: uuidv4() }],
  },
  {
    id: uuidv4(),
    title: "templates",
    cardBgColor: null,
    card: TemplateCard,
    items: [{ id: uuidv4() }],
  },
  {
    id: uuidv4(),
    title: "workflows",
    card: WorkflowCard,
    cardBgColor: null,
    items: [{ id: uuidv4() }],
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
