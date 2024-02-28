import styles from './workflowApp.module.css';
import CustomerSupport from '../../components/landingPage/customerSupport/CustomerSupport';
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import { v4 as uuidv4 } from 'uuid';
import SectionBox from '../../components/manageFiles/sectionBox/SectionBox';
import HandleTasks from '../../components/landingPage/handleTasks/HandleTasks';
import FlipMenu from '../../components/flipMenu/FlipMenu';
// import DocumnetCard from '../../components/hoverCard/documentCard/DocumentCard';
import TemplateCard from '../../components/hoverCard/templateCard/TemplateCard';
import WorkflowCard from '../../components/hoverCard/workflowCard/WorkflowCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Spinner from '../../components/spinner/Spinner';
import ProgressBar from '../../components/progressBar/ProgressBar';
import { useLocation } from 'react-router-dom';
import {
  setNotificationFinalStatus,
  setNotificationsForUser,
  setNotificationsLoaded,
  setNotificationsLoading,
} from '../../features/notifications/notificationSlice';
import Iframe from '../../components/iFrame/Iframe';
import Skeleton from '../../components/skeloton/Skeleton';

import { useAppContext } from '../../contexts/AppContext';
import { getFavoritesForUser } from '../../services/favoritesServices';
import React from 'react';
import DocumentCard from '../../components/hoverCard/documentCard/DocumentCard';
import { useTranslation } from 'react-i18next';
import { productName } from '../../utils/helpers';
import { DocumentServices } from '../../services/documentServices';
import ApiKeyFailureModal from '../../components/apiKeyFailureModal/ApiKeyFailureModal';

const WorkflowApp = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const {
    ShowProfileSpinner,
    showApiKeyFetchFailureModal,
  } = useSelector((state) => state.app);

  const {
    notificationsLoading,
    notificationsForUser,
    notificationFinalStatus,
    notificationsLoaded,
  } = useSelector((state) => state.notification);

  // // console.log('notification: ', notificationsForUser);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const location = useLocation();
  const [isVisible, setVisible] = useState(false);
  const {
    favoriteItems,
    setFavoriteitems,
    favoriteItemsLoaded,
    setFavoriteitemsLoaded,
    customDocName,
    customTempName,
    customWrkfName,
    userName,
    portfolioName,
  } = useAppContext();
  const { allDocuments } = useSelector((state) => state.document);
  // const { allTemplates } = useSelector((state) => state.template);
  // const { allWorkflows } = useSelector((state) => state.workflow);
  const [docs, setDocs] = useState(null);
  // const [temps, setTemps] = useState(null);
  // const [wrkfs, setWrkfs] = useState(null);
  const [uncompletedTasks, setUncompletedTasks] = useState([
    {
      id: uuidv4(),
      parent: 'documents',
      children: [],
      isOpen: false,
    },
    {
      id: uuidv4(),
      parent: 'templates',
      children: [],
      isOpen: false,
    },
    {
      id: uuidv4(),
      parent: 'workflows',
      children: [],
      isOpen: false,
    },
  ]);
  const [completedTasks, setCompletedTasks] = useState([
    {
      id: uuidv4(),
      parent: 'documents',
      children: [],
      isOpen: false,
    },
    {
      id: uuidv4(),
      parent: 'templates',
      children: [],
      isOpen: false,
    },
    {
      id: uuidv4(),
      parent: 'workflows',
      children: [],
      isOpen: false,
    },
  ]);

  ///choose notification
  const [whichNotification, setWhichNotification] = useState("")

  useEffect(() => {
    if (!userDetail || userDetail.msg || userDetail.message) return;

    const [userCompanyId, userPortfolioDataType, userPortfolioName] = [
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.org_id
        : userDetail?.portfolio_info[0]?.org_id,
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.data_type
        : userDetail?.portfolio_info[0]?.data_type,
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.portfolio_name
        : userDetail?.portfolio_info[0]?.portfolio_name,
    ];
    if (!notificationsLoaded && userName && portfolioName) {
      dispatch(setNotificationsLoading(true));

      dispatch(setNotificationFinalStatus(null));

      const documentService = new DocumentServices();

      documentService
        .getNotifications(
          userCompanyId,
          userPortfolioDataType,
          userName,
          portfolioName
        )
        .then((res) => {
          // // console.log('response: ', res.data);
          const documentsToSign = res.data.documents
            ? res.data.documents
                ?.reverse()
                .filter(
                  (document) =>
                    document.auth_viewers &&
                    Array.isArray(document.auth_viewers) &&
                    // new format
                    ((document.auth_viewers.every(
                      (item) => typeof item === 'object'
                    ) &&
                      document.auth_viewers
                        .map((viewer) => viewer.member)
                        .includes(userDetail?.userinfo?.username) &&
                      document.auth_viewers
                        .map((viewer) => viewer.portfolio)
                        .includes(userPortfolioName)) ||
                      // old format
                      document.auth_viewers.includes(
                        userDetail?.userinfo?.username
                      ))
                )
                .filter((document) => document.process_id)
            : [];

          dispatch(setNotificationFinalStatus(100));

          // // console.log('notificationForUser: ', notificationsForUser);

          const currentNotifications = notificationsForUser.slice();

          // // console.log('currentNotifications: ', currentNotifications);
          // // console.log('documentsToSign: ', documentsToSign);

          let updatedNotifications = currentNotifications.map(
            (notification) => {
              const data = documentsToSign.map((dataObj) => {
                let copyOfDataObj = { ...dataObj };
                copyOfDataObj.type = 'sign-document';
                return copyOfDataObj;
              });
              const copyOfNotification = { ...notification };
              if (copyOfNotification.title === 'documents') {
                copyOfNotification.items = data;
                return copyOfNotification;
              }
              return notification;
            }
          );

          dispatch(setNotificationsForUser(updatedNotifications));
          dispatch(setNotificationsLoading(false));
          dispatch(setNotificationsLoaded(true));
        })
        .catch((err) => {
          // console.log(
          //   'Failed to load notifications: ',
          //   err.response ? err.response.data : err.message
          // );
          dispatch(setNotificationsLoading(false));
        });
    }

    if (!favoriteItemsLoaded) {
      const dataToPost = {
        company_id: userCompanyId,
        username: userDetail?.userinfo?.username,
      };

      getFavoritesForUser(dataToPost.company_id)
        .then((res) => {
          setFavoriteitems(res.data);
          // console.log("the favourite items are ", res.data)
          setFavoriteitemsLoaded(true);
        })
        .catch((err) => {
          // console.log(
          //   err
          //   // .response ? err.response.data : err.message
          // );
          // setFavoriteitemsLoaded(true)
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userDetail,
    favoriteItemsLoaded,
    notificationsLoaded,
    userName,
    portfolioName,
  ]);

  useEffect(() => {
    if (!location.state || !location.state.elementIdToScrollTo) return;

    const elementToScrollTo = document.getElementById(
      location.state.elementIdToScrollTo
    );

    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      // // console.log("the location is ", location.hash)
      setWhichNotification(location.hash)
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  useEffect(() => {
    if (allDocuments && Array.isArray(allDocuments)) {
      const completedDocs = allDocuments.filter(
        (doc) => doc.document_state === 'finalized'
      );

      const unCompletedDocs = allDocuments.filter(
        (doc) => doc.document_state === 'processing'
      );

      setDocs({
        completed: completedDocs.map((doc) => ({
          id: doc._id,
          child: doc.document_name,
        })),

        unCompleted: unCompletedDocs.map((doc) => ({
          id: doc._id,
          child: doc.document_name,
        })),
      });
    } else setDocs({ completed: [], unCompleted: [] });
  }, [allDocuments]);

  useEffect(() => {
    if (docs) {
      setUncompletedTasks(
        uncompletedTasks.map((task) =>
          task.parent === 'documents'
            ? { ...task, children: [...docs.unCompleted] }
            : task
        )
      );

      setCompletedTasks(
        completedTasks.map((task) =>
          task.parent === 'documents'
            ? { ...task, children: [...docs.completed] }
            : task
        )
      );
    }
  }, [docs]);

  // useEffect(() => {
  // }, [uncompletedTasks, completedTasks]);

  return (
    <WorkflowLayout>
      {ShowProfileSpinner && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.2s ease-in-out',
            zIndex: 99999,
            overflow: 'hidden',
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            position: 'fixed',
            top: '0%',
            left: '0%',
          }}
        >
          <Spinner />
        </div>
      )}
      {showApiKeyFetchFailureModal && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.2s ease-in-out',
            zIndex: 99999,
            overflow: 'hidden',
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            position: 'fixed',
            top: '0%',
            left: '0%',
          }}
        >
          <ApiKeyFailureModal />
        </div>
      )}
      <div className={styles.container}>
        <CustomerSupport />

        <FlipMenu />
        {isVisible && (
          <div className={styles.section__container}>
            {notificationsLoading ? (
              <div>
                <Spinner />
                <div style={{ margin: '0 auto 0 1.5%', textAlign: 'center' }}>
                  <p>Notifications loading...</p>
                  <ProgressBar
                    durationInMS={8000}
                    finalWidth={notificationFinalStatus}
                    style={{ height: '2rem' }}
                  />
                </div>
              </div>
            ) : (
                whichNotification == "#documents" ? 
                 <div key={notificationsForUser[0]._id} id={notificationsForUser[0].title}>
                  <SectionBox
                    Card={notificationsForUser[0].card}
                    title={`notifications - ${
                      notificationsForUser[0].title.toLowerCase().includes('documents') &&
                      customDocName
                        ? customDocName
                        : notificationsForUser[0].title.toLowerCase().includes('templates') &&
                          customTempName
                        ? customTempName
                        : notificationsForUser[0].title.toLowerCase().includes('workflows') &&
                          customWrkfName
                        ? customWrkfName
                        : notificationsForUser[0].title
                    }`}
                    cardItems={notificationsForUser[0].items}
                    cardBgColor={notificationsForUser[0].cardBgColor}
                    idKey={notificationsForUser[0].id ? notificationsForUser[0].id : null}
                    hideFavoriteIcon={true}
                    itemType={'notifications'}
                    hideDeleteIcon={true}
                  />
                </div> :
                whichNotification == "#templates" ? 
                <div key={notificationsForUser[1]._id} id={notificationsForUser[1].title}>
                 <SectionBox
                   Card={notificationsForUser[1].card}
                   title={`notifications - ${
                    notificationsForUser[1].title.toLowerCase().includes('documents') &&
                     customDocName
                       ? customDocName
                       : notificationsForUser[1].title.toLowerCase().includes('templates') &&
                         customTempName
                       ? customTempName
                       : notificationsForUser[1].title.toLowerCase().includes('workflows') &&
                         customWrkfName
                       ? customWrkfName
                       : notificationsForUser[1].title
                   }`}
                   cardItems={notificationsForUser[1].items}
                   cardBgColor={notificationsForUser[1].cardBgColor}
                   idKey={notificationsForUser[1].id ? notificationsForUser[1].id : null}
                   hideFavoriteIcon={true}
                   itemType={'notifications'}
                   hideDeleteIcon={true}
                 />
               </div> :
          
                <div key={notificationsForUser[2]._id} id={notificationsForUser[2].title}>
                 <SectionBox
                   Card={notificationsForUser[2].card}
                   title={`notifications - ${
                    notificationsForUser[2].title.toLowerCase().includes('documents') &&
                     customDocName
                       ? customDocName
                       : notificationsForUser[2].title.toLowerCase().includes('templates') &&
                         customTempName
                       ? customTempName
                       : notificationsForUser[2].title.toLowerCase().includes('workflows') &&
                         customWrkfName
                       ? customWrkfName
                       : notificationsForUser[2].title
                   }`}
                   cardItems={notificationsForUser[2].items}
                   cardBgColor={notificationsForUser[2].cardBgColor}
                   idKey={notificationsForUser[2].id ? notificationsForUser[2].id : null}
                   hideFavoriteIcon={true}
                   itemType={'notifications'}
                   hideDeleteIcon={true}
                 />
               </div> 


              // notificationsForUser.map((item) => (
              //   <div key={item._id} id={item.title}>
              //     <SectionBox
              //       Card={item.card}
              //       title={`notifications - ${
              //         item.title.toLowerCase().includes('documents') &&
              //         customDocName
              //           ? customDocName
              //           : item.title.toLowerCase().includes('templates') &&
              //             customTempName
              //           ? customTempName
              //           : item.title.toLowerCase().includes('workflows') &&
              //             customWrkfName
              //           ? customWrkfName
              //           : item.title
              //       }`}
              //       cardItems={item.items}
              //       cardBgColor={item.cardBgColor}
              //       idKey={item.id ? item.id : null}
              //       hideFavoriteIcon={true}
              //       itemType={'notifications'}
              //       hideDeleteIcon={true}
              //     />
              //   </div>
              // ))
            )}
            <div className={styles.tasks__container}>
              {uncompletedTasks[0].children.length ? (
                <HandleTasks feature='incomplete' tasks={uncompletedTasks} />
              ) : (
                ''
              )}

              {completedTasks[0].children.length ? (
                <HandleTasks feature='completed' tasks={completedTasks} />
              ) : (
                ''
              )}
            </div>
          </div>
        )}
        {!isVisible && (
          <>
            <div style={{ marginBottom: '45px' }}>
              <>
                {!favoriteItemsLoaded ? (
                  <p style={{ textAlign: 'center' }}>
                    {' '}
                    {t('loading')} {t('bookmarks')}...
                  </p>
                ) : (
                  <>
                    {React.Children.toArray(
                      Object.keys(favoriteItems).map((key) => {
                        if (
                          key === 'documents' &&
                          favoriteItems[key].filter(
                            (item) =>
                              item.favourited_by ===
                              userDetail?.userinfo?.username
                          ).length > 0
                        )
                          return (
                            <div>
                              <SectionBox
                                cardBgColor='#1ABC9C'
                                title='bookmarked documents'
                                Card={DocumentCard}
                                cardItems={favoriteItems[key].filter(
                                  (item) =>
                                    item.favourited_by ===
                                    userDetail?.userinfo?.username
                                )}
                                status={favoriteItemsLoaded}
                                itemType={'documents'}
                              />
                            </div>
                          );
                        if (
                          key === 'templates' &&
                          favoriteItems[key].filter(
                            (item) =>
                              item.favourited_by ===
                              userDetail?.userinfo?.username
                          ).length > 0
                        )
                          return (
                            <div>
                              <SectionBox
                                cardBgColor='#1ABC9C'
                                title='bookmarked templates'
                                Card={TemplateCard}
                                cardItems={favoriteItems[key].filter(
                                  (item) =>
                                    item.favourited_by ===
                                    userDetail?.userinfo?.username
                                )}
                                status={favoriteItemsLoaded}
                              />
                            </div>
                          );
                        if (
                          key === 'workflows' &&
                          favoriteItems[key].filter(
                            (item) =>
                              item.favourited_by ===
                              userDetail?.userinfo?.username
                          ).length > 0
                        )
                          return (
                            <div>
                              <SectionBox
                                cardBgColor='#1ABC9C'
                                title='bookmarked workflows'
                                Card={WorkflowCard}
                                cardItems={favoriteItems[key].filter(
                                  (item) =>
                                    item.favourited_by ===
                                    userDetail?.userinfo?.username
                                )}
                                status={favoriteItemsLoaded}
                              />
                            </div>
                          );
                        return <></>;
                      })
                    )}
                  </>
                )}
              </>
            </div>
            <div className={styles.dowell__Advert__Container}>
              {introVideos.map((item) => (
                <div key={item.id} className={styles.skeleton__box}>
                  <span className={styles.iframe__Title}>
                    <b>{t(item.title)}</b>
                  </span>
                  <Iframe
                    Skeleton={Skeleton}
                    src={item.src}
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
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
    title: 'capabilities',
    src: 'https://www.youtube.com/embed/e5HdKmoA8b8',
  },
  {
    id: uuidv4(),
    title: 'examples',
    src: 'https://www.youtube.com/embed/videoseries?list=PL6rKBSwpVCYXUW09QN3xfGRWeWMNschP9',
  },
];

export const notifications = [
  {
    id: uuidv4(),
    title: 'documents',
    cardBgColor: '#1ABC9C',
    card: DocumentCard,
    items: [{ id: uuidv4() }],
  },
  {
    id: uuidv4(),
    title: 'templates',
    cardBgColor: null,
    card: TemplateCard,
    items: [{ id: uuidv4() }],
  },
  {
    id: uuidv4(),
    title: 'workflows',
    card: WorkflowCard,
    cardBgColor: null,
    items: [{ id: uuidv4() }],
  },
];

// export const incompleteTasks = [
//   {
//     id: uuidv4(),
//     parent: 'documents',
//     children: [
//       { id: uuidv4(), child: 'document name' },
//       { id: uuidv4(), child: 'document name' },
//     ],
//   },
//   {
//     id: uuidv4(),
//     parent: 'templates',
//     children: [
//       { id: uuidv4(), child: 'templates name' },
//       { id: uuidv4(), child: 'templates name' },
//     ],
//   },
//   {
//     id: uuidv4(),
//     parent: 'workflows',
//     children: [
//       { id: uuidv4(), child: 'workflows name' },
//       { id: uuidv4(), child: 'workflows name' },
//     ],
//   },
// ];

// export const completedTasks = [
//   {
//     id: uuidv4(),
//     parent: 'documents',
//     isOpen: false,
//     children: [
//       { id: uuidv4(), child: 'document name' },
//       { id: uuidv4(), child: 'document name' },
//     ],
//   },
//   {
//     id: uuidv4(),
//     parent: 'templates',
//     isOpen: false,
//     children: [
//       { id: uuidv4(), child: 'templates name' },
//       { id: uuidv4(), child: 'templates name' },
//     ],
//   },
//   {
//     id: uuidv4(),
//     parent: 'workflows',
//     isOpen: false,
//     children: [
//       { id: uuidv4(), child: 'workflows name' },
//       { id: uuidv4(), child: 'workflows name' },
//     ],
//   },
// ];
