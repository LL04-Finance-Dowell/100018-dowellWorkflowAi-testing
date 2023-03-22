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
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DocumentServices } from "../../services/documentServices";
import Spinner from "../../components/spinner/Spinner";
import ProgressBar from "../../components/progressBar/ProgressBar";
import { useLocation } from "react-router-dom";
import {
  setAllProcesses,
  setNotificationFinalStatus,
  setNotificationsForUser,
  setNotificationsLoaded,
  setNotificationsLoading,
  setProcessesLoaded,
  setProcessesLoading,
} from "../../features/app/appSlice";
import Iframe from "../../components/iFrame/Iframe";
import Skeleton from "../../components/skeloton/Skeleton";
import { getAllProcessesV2 } from "../../services/processServices";
import { useAppContext } from "../../contexts/AppContext";
import { getFavoritesForUser } from "../../services/favoritesServices";
import React from "react";
import DocumentCard from "../../components/hoverCard/documentCard/DocumentCard";

const WorkflowApp = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const {
    notificationsLoading,
    notificationsForUser,
    notificationFinalStatus,
    notificationsLoaded,
    processesLoaded,
    processesLoading,
  } = useSelector((state) => state.app);
  const documentServices = new DocumentServices();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isVisible, setVisible] = useState(false);
  const { favoriteItems, setFavoriteitems, favoriteItemsLoaded, setFavoriteitemsLoaded } = useAppContext();

  useEffect(() => {

    if (!notificationsLoaded) {
      dispatch(setNotificationsLoading(true));

      if (
        !userDetail ||
        !userDetail.portfolio_info ||
        userDetail.portfolio_info.length < 1
      ) {
        dispatch(setNotificationsLoading(false));
        return;
      }
  
      dispatch(setNotificationFinalStatus(null));
      documentServices
        .allDocuments(userDetail?.portfolio_info[0]?.org_id)
        .then((res) => {
          const documentsToSign = res.data.documents.reverse().filter(document => 
            document.company_id === userDetail?.portfolio_info[0]?.org_id && 
            document.data_type === userDetail?.portfolio_info[0]?.data_type && 
            (document.state === "processing" || document.document_state === "processing") &&
            document.auth_viewers && document.auth_viewers.includes(userDetail?.userinfo?.username)
          ).filter(document => document.process_id)
          // console.log(documentsToSign)
          dispatch(setNotificationFinalStatus(100));
          const currentNotifications = notificationsForUser.slice();
          let updatedNotifications = currentNotifications.map((notification) => {
            const data = documentsToSign.map((dataObj) => {
              let copyOfDataObj = { ...dataObj };
              copyOfDataObj.type = "sign-document";
              return copyOfDataObj;
            });
            const copyOfNotification = { ...notification };
            if (copyOfNotification.title === "documents") {
              copyOfNotification.items = data;
              return copyOfNotification;
            }
            return notification;
          });
          dispatch(setNotificationsForUser(updatedNotifications));
          dispatch(setNotificationsLoading(false));
          dispatch(setNotificationsLoaded(true));
        })
        .catch((err) => {
          console.log("Failed: ", err.response);
          dispatch(setNotificationsLoading(false));
          console.log("did not fetch documentsss");
        });  
    }

    if (!favoriteItemsLoaded) {
      const dataToPost = {
        "company_id": userDetail?.portfolio_info[0]?.org_id,
        "username": userDetail?.userinfo?.username,
      }
  
      getFavoritesForUser(dataToPost.company_id).then(res => {
        console.log(res.data)
        setFavoriteitems(res.data);
        setFavoriteitemsLoaded(true)
      }).catch(err => {
        console.log(err.response ? err.response.data : err.message);
        console.log("Failed to fetch favorites")
        // setFavoriteitemsLoaded(true)
      })
    }

  }, [userDetail]);

  useEffect(() => {
    if (!location.state || !location.state.elementIdToScrollTo) return;

    const elementToScrollTo = document.getElementById(
      location.state.elementIdToScrollTo
    );

    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  
  useEffect(() => {

    if (processesLoaded) return

    if (
      !userDetail ||
      !userDetail.portfolio_info ||
      userDetail.portfolio_info.length < 1
    ) {
      return;
    }

    getAllProcessesV2(userDetail?.portfolio_info[0]?.org_id).then(res => {
      dispatch(setAllProcesses(res.data.filter(process => process.processing_state).reverse()));
      dispatch(setProcessesLoading(false));
      dispatch(setProcessesLoaded(true));
    }).catch(err => {
      console.log("Failed: ", err.response);
      dispatch(setProcessesLoading(false));
      console.log("did not fetch processes");
    })

  }, [processesLoading, userDetail])

  return (
    <WorkflowLayout>
      <div className={styles.container}>
        <CustomerSupport />
        <FlipMenu />
        {isVisible && (
          <div className={styles.section__container}>
            {notificationsLoading ? (
              <div>
                <Spinner />
                <div style={{ margin: "0 auto 0 1.5%", textAlign: "center" }}>
                  <p>Notifications loading...</p>
                  <ProgressBar
                    durationInMS={8000}
                    finalWidth={notificationFinalStatus}
                    style={{ height: "2rem" }}
                  />
                </div>
              </div>
            ) : (
              notificationsForUser.map((item) => (
                <div key={item._id} id={item.title}>
                  <SectionBox
                    Card={item.card}
                    title={`notifications - ${item.title}`}
                    cardItems={item.items}
                    cardBgColor={item.cardBgColor}
                    idKey={item.id ? item.id : null}
                    hideFavoriteIcon={true}
                    itemType={"notifications"}
                    hideDeleteIcon={true}
                  />
                </div>
              ))
            )}
            <div className={styles.tasks__container}>
              <HandleTasks feature="incomplete" tasks={incompleteTasks} />
              <HandleTasks feature="completed" tasks={completedTasks} />
            </div>
          </div>
        )}
        {!isVisible && (
          <>
          <div style={{ marginBottom: "45px" }}>
            <>
              {
                !favoriteItemsLoaded ? <p style={{ textAlign: "center" }}>Loading favorites...</p> : 
                <>
                {
                  React.Children.toArray(Object.keys(favoriteItems).map(key => {
                    if (key === "documents" && favoriteItems[key].length > 0) return <div>
                      <SectionBox
                        cardBgColor="#1ABC9C"
                        title="favorite documents"
                        Card={DocumentCard}
                        cardItems={favoriteItems[key].filter(item => item.favourited_by === userDetail?.userinfo?.username)}
                        status={favoriteItemsLoaded}
                      />
                    </div>
                    if (key === "templates" && favoriteItems[key].length > 0) return <div>
                      <SectionBox
                        cardBgColor="#1ABC9C"
                        title="favorite templates"
                        Card={TemplateCard}
                        cardItems={favoriteItems[key].filter(item => item.favourited_by === userDetail?.userinfo?.username)}
                        status={favoriteItemsLoaded}
                      />
                    </div>
                    if (key === "workflows" && favoriteItems[key].length > 0) return <div>
                      <SectionBox
                        cardBgColor="#1ABC9C"
                        title="favorite workflows"
                        Card={WorkflowCard}
                        cardItems={favoriteItems[key].filter(item => item.favourited_by === userDetail?.userinfo?.username)}
                        status={favoriteItemsLoaded}
                      />
                    </div>
                    return <></>
                  }))
                }
                </>
              }
            </>
          </div>
          <div className={styles.dowell__Advert__Container}>
            {introVideos.map((item) => (
              <div key={item.id} className={styles.skeleton__box}>
                <span className={styles.iframe__Title}><b>{item.title}</b></span>
                <Iframe
                  Skeleton={Skeleton}
                  src={item.src}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </WorkflowLayout>
  );
};

export default WorkflowApp;

export const introVideos = [
  {
    id: uuidv4(),
    title: "capabilities",
    src: "https://www.youtube.com/embed/videoseries?list=PL6rKBSwpVCYVzo4-0ZhuMwoY0FOZdqwP-",
  },
  {
    id: uuidv4(),
    title: "examples",
    src: "https://www.youtube.com/embed/videoseries?list=PL6rKBSwpVCYXUW09QN3xfGRWeWMNschP9",
  },
];

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

export const incompleteTasks = [
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

export const completedTasks = [
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
