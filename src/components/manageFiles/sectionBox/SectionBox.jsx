// import styles from './sectionBox.module.css';
// import maneFilesStyles from '../manageFiles.module.css';
// import BookSpinner from '../../bookSpinner/BookSpinner';
// import { useEffect, useState, useCallback, useRef } from 'react';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'

// import { PrimaryButton } from '../../styledComponents/styledComponents';
// import { IoIosRefresh } from 'react-icons/io';
// import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
// import { useDispatch, useSelector } from 'react-redux';
// import { DocumentServices } from '../../../services/documentServices';
// import { toast } from 'react-toastify';
// import { TemplateServices } from '../../../services/templateServices';
// import { WorkflowServices } from '../../../services/workflowServices';
// import { getAllProcessesV2 } from '../../../services/processServices';
// import {
//   setAllProcesses,
//   setNotificationsForUser,
// } from '../../../features/app/appSlice';
// import { setAllDocuments } from '../../../features/document/documentSlice';
// import { setAllTemplates } from '../../../features/template/templateSlice';
// import { setAllWorkflows } from '../../../features/workflow/workflowsSlice';
// import { useTranslation } from 'react-i18next';
// import { productName } from '../../../utils/helpers';
// import { useAppContext } from '../../../contexts/AppContext';
// import {
//   SetKnowledgeFolders
// } from '../../../features/app/appSlice';
// import axios from 'axios';

// const SectionBox = ({
//   cardItems,
//   title,
//   Card,
//   status,
//   idKey,
//   itemType,
//   hideFavoriteIcon,
//   hideDeleteIcon,
//   folderId,
//   isDemo,
//   isReports,
//   isCompleted,
//   isRejected,
//   isReport,
//   knowledgeCenter,
// }) => {
//   const [sliceCount, setSliceCount] = useState(12);
//   // const [sliceCount, setSliceCount] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [disableLoadMore, setDisableLoadMore] = useState(false); // State to disable load more button
//   const [allCardsLoaded, setAllCardsLoaded] = useState(false);
  
//   const [refreshLoading, setRefreshLoading] = useState(false);
//   const { userDetail } = useSelector((state) => state.auth);
//   const { processesLoading, notificationsForUser, notificationsLoading } =
//     useSelector((state) => state.app);
//   const { allDocumentsStatus } = useSelector((state) => state.document);
//   const { allTemplatesStatus } = useSelector((state) => state.template);
//   const { allWorkflowsStatus } = useSelector((state) => state.workflow);
//   const [filterName, setFilterName] = useState('');
//   const dispatch = useDispatch();
//   const { t } = useTranslation();
//   const [isDemoLoading, setIsDemoLoading] = useState(false);
//   // const [cardItemsVar, setCardItemsVar] = useState([]);
//   const [cardItemsVar, setCardItemsVar] = useState(cardItems);
//   const [count, setCount] = useState(1);
//   const [loadingMoreText, setLoadingMoreText] = useState(false)
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const {
//     fetchDemoTemplates,
//     fetchDemoDocuments,
//     fetchDocumentReports,
//     fetchTemplateReports,
//     userName,
//     portfolioName,
//     fetchOrgDocumentReports,
//     isFetchingFolders,
//     fetchFolders
//   } = useAppContext();

//   const [isLoading, setIsLoading] = useState(true);
//   const [loading, setLoading] = useState(true)
//   const observer = useRef();

//   // useEffect(() => {
//   //   if (!loadingMore) {
//   //     const timeout = setTimeout(() => {
//   //       setLoadingMore(true);
//   //       setSliceCount((prevSliceCount) => prevSliceCount + 20);
//   //     }, 2000); // Load more every 5 seconds

//   //     // Cleanup function to clear the timeout when component unmounts
//   //     return () => clearTimeout(timeout);
//   //   }
//   // }, [loadingMore]);

//   // const lastCardRef = useCallback((node) => {
//   //   if (loadingMore) return;
//   //   if (observer.current) observer.current.disconnect();
//   //   observer.current = new IntersectionObserver((entries) => {
//   //     if (entries[0].isIntersecting) {
//   //       handleLoadMore();
//   //     }
//   //   });
//   //   if (node) observer.current.observe(node);
//   // }, [loadingMore]);

//   // const handleLoadMore = () => {
//   //   setLoadingMore(true);
//   //   setTimeout(() => {
//   //     setSliceCount((prevSliceCount) => prevSliceCount + 12);
//   //     setLoadingMore(false);
//   //   }, 1000);
//   // };

//   useEffect(() => {
//     if (sliceCount >= cardItems?.length) {
//       setAllCardsLoaded(true);
//     }
//   }, [sliceCount, cardItems]);

//   useEffect(() => {
//     setCardItemsVar(cardItems)
//   }, [cardItems]);

//   // const lastCardRef = useCallback(node => {
//   //   if (isLoadingMore) return;
//   //   if (observer.current) observer.current.disconnect();
//   //   observer.current = new IntersectionObserver(entries => {
//   //     if (entries[0].isIntersecting) {
//   //       handleLoadMore();
//   //     }
//   //   });
//   //   if (node) observer.current.observe(node);
//   // }, [isLoadingMore]);

//   // useEffect(() =>{
//   //   setCardItemsVar(cardItems);
//   // }, [cardItems]);

//   // useEffect(() => {
//   //   if (cardItems) {
//   //     setCardItemsVar(cardItems?.slice(0, sliceCount));
//   //   }
//   // }, [cardItems, sliceCount]);

//   // useEffect(() => {
//   //   if (!isLoadingMore) return;
//   //   if (isDemo) {
//   //     handleDemoLoadMore();
//   //   } else {
//   //     setSliceCount(prev => prev + 1);
//   //   }
//   //   setIsLoadingMore(false);
//   // }, [isLoadingMore]);

//   // useEffect(() => {
//   //   if (isLoading) return;
//   //   if (isDemo) {
//   //     handleDemoLoadMore();
//   //   } else {
//   //     setSliceCount(prev => prev + 1)
//   //   }
//   //   setIsLoading(true);
//   // }, [isLoading]);

//   // useEffect(() => {
//   //   if (loadingMoreText) {
//   //     setLoadingMoreText(false);
//   //     window.scroll(0, document.body.scrollHeight)
//   //   }
//   // }, [loadingMoreText]);

//   // const handleLoadMore = () => {
     
//   //   setLoadingMore(true)
//   //   // setLoadingMoreText(true);
//   //   // setIsLoading(true)
//   // };

//   // const handleLoadMore = () => {
//   //   setLoadingMore(true);
//   //   // Simulate loading more items after a delay
//   //   setTimeout(() => {
//   //     setSliceCount((prevSliceCount) => prevSliceCount + 6);
//   //     setLoadingMore(false);
//   //   }, 1000); // Adjust the delay as needed
//   // };

//   // const lastCardRef = useRef();
//   // useEffect(() => {
//   //   // Automatically load more cards after 5 seconds
//   //   if (!loadingMore && !disableLoadMore) {
//   //     const timeout = setTimeout(() => {
//   //       setLoadingMore(true);
//   //       setSliceCount((prevSliceCount) => prevSliceCount + 6); // Increase sliceCount by 6
//   //     }, 5000); // Delay of 5 seconds before loading more

//   //     return () => clearTimeout(timeout);
//   //   }
//   // }, [loadingMore, disableLoadMore]);

//   // useEffect(() => {
//   //   // Check if all cards are loaded
//   //   if (sliceCount >= cardItems?.length) {
//   //     setAllCardsLoaded(true);
//   //     setDisableLoadMore(true); // Disable load more if all cards are loaded
//   //   }
//   // }, [sliceCount, cardItems]);

//   // useEffect(() => {
//   //   setCardItemsVar(cardItems);
//   // }, [cardItems]);

//   // useEffect(() => {
//   //   setCardItemsVar(cardItems);
//   // }, [cardItems]);

//   // useEffect(() => {
//   //   if (cardItems) {
//   //     setSliceCount(10);
//   //   }
//   // }, [cardItems]);

//   // useEffect(() => {
//   //   if (isLoading) {
//   //     setIsLoading(false)
//   //   }
//   // }, [isLoading])

//   // useEffect(() => {
//   //   if (isLoadingMore) {
//   //     setLoadingMore(false);
//   //   }
//   // }, [isLoadingMore]);

//   // useEffect(() => {
//   //   if (loadingMore && sliceCount < cardItems.length) {
//   //     setSliceCount(prev => prev + 6);
//   //   } else if (sliceCount >= cardItems?.length) {
//   //     setAllCardsLoaded(true);
//   //   }
//   //   setLoadingMore(false);
//   // }, [loadingMore, sliceCount, cardItems]);

//   // const handleLoadMore = () => {
//   //   setSliceCount((prev) => prev + 1);
//   // };

//   // const handleLoadMore = () => {
//   //   if (sliceCount * 12 < cardItemsVar.length) {
//   //     setSliceCount(prev => prev + 1);
//   //   }
//   // };

//   const handleDemoLoadMore = async () => {

//     const hasMoreCards = cardItemsVar?.length / 10 > sliceCount;

//     // if (hasMoreCards) {
//     //   setSliceCount((prev) => prev + 1);
//     // } else {
//     //   setIsDemoLoading(true);
//     // }

//     if (hasMoreCards) {
//       setSliceCount((prev) => prev + 1);
//     } else {
//       setIsDemoLoading(true);
//       try {
//         const res =
//           itemType === 'templates'
//             ? new TemplateServices().demoTemplates(count + 1)
//             : itemType === 'documents'
//               ? await new DocumentServices().demoDocuments(count + 1)
//               : {};
//         setCardItemsVar(
//           res.data ? [...cardItemsVar, ...res.data.templates] : cardItemsVar
//         );
//         setCount(count + 1);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setIsDemoLoading(false);
//       }
//     }
//   };

//   const renderNextBatch = () => {
//     setTimeout(() => {
//       handleDemoLoadMore();
//     }, 2000);
//   };
  
//   // Automatically render the first batch of cards
//   useEffect(() => {
//     renderNextBatch();
//   }, []);
  
//   // Automatically render subsequent batches of cards after a delay
//   useEffect(() => {
//     if (sliceCount > 1) {
//       renderNextBatch();
//     }
//   }, [sliceCount]);

//   // useEffect(() => {
//   //   // console.log('cardItemsVar: ', cardItemsVar);
//   // }, [cardItemsVar]);

//   const handleRefresh = () => {
//     if (refreshLoading) return;

//     const [
//       currentUserCompanyId,
//       currentUserportfolioDataType,
//       currentUserPortfolioName,
//     ] = [
//         userDetail?.portfolio_info?.length > 1
//           ? userDetail?.portfolio_info.find(
//             (portfolio) => portfolio.product === productName
//           )?.org_id
//           : userDetail?.portfolio_info[0]?.org_id,
//         userDetail?.portfolio_info?.length > 1
//           ? userDetail?.portfolio_info.find(
//             (portfolio) => portfolio.product === productName
//           )?.data_type
//           : userDetail?.portfolio_info[0]?.data_type,
//         userDetail?.portfolio_info?.length > 1
//           ? userDetail?.portfolio_info.find(
//             (portfolio) => portfolio.product === productName
//           )?.data_type
//           : userDetail?.portfolio_info[0]?.portfolio_name,
//       ];

//     if (itemType === 'documents') {
//       setRefreshLoading(true);

//       const data = {
//         company_id: currentUserCompanyId,
//         data_type: currentUserportfolioDataType,
//       };

//       const documentServices = new DocumentServices();

//       if (isDemo) fetchDemoDocuments();
//       else if (isCompleted && !window.location.hash.includes('completed#org')) fetchDocumentReports('finalized');
//       else if (isCompleted && window.location.hash.includes('completed#org')) fetchOrgDocumentReports('finalized');
//       else if (isRejected && !window.location.hash.includes('rejected#org')) fetchDocumentReports('rejected');
//       else if (isRejected && window.location.hash.includes('rejected#org')) fetchOrgDocumentReports('rejected');
//       else {
//         documentServices
//           .allDocuments(data.company_id, data.data_type)
//           .then((res) => {
//             dispatch(
//               setAllDocuments(
//                 res.data.documents

//                   .filter(
//                     (document) =>
//                       document.document_state !== 'trash' &&
//                       document.data_type &&
//                       document.data_type === currentUserportfolioDataType
//                   )
//               )
//             );
//             toast.success('Successfully refreshed documents');
//             setRefreshLoading(false);
//           })
//           .catch((err) => {
//             // // console.log(err, 'Refresh for documents failed');
//             toast.info('Refresh for documents failed');
//             setRefreshLoading(false);
//           });
//       }
//       setRefreshLoading(false);
//     }

//     if (itemType === 'templates') {
//       setRefreshLoading(true);

//       if (isDemo) fetchDemoTemplates();
//       else if (isReports) fetchTemplateReports();
//       else {
//         const data = {
//           company_id: currentUserCompanyId,
//           data_type: currentUserportfolioDataType,
//         };

//         const templatesServices = new TemplateServices();

//         templatesServices
//           .allTemplates(data.company_id, data.data_type)
//           .then((res) => {
//             dispatch(
//               setAllTemplates(
//                 res.data.templates

//                   .filter(
//                     (template) =>
//                       template.data_type &&
//                       template.data_type === currentUserportfolioDataType
//                   )
//               )
//             );
//             toast.success('Successfully refreshed templates');
//             setRefreshLoading(false);
//           })
//           .catch((err) => {
//             // // console.log(err, 'Refresh for templates failed');
//             toast.info('Refresh for templates failed');
//             setRefreshLoading(false);
//           });
//       }
//     }

//     if (itemType === 'workflows') {
//       setRefreshLoading(true);

//       const data = {
//         company_id: currentUserCompanyId,
//         data_type: currentUserportfolioDataType,
//       };

//       const workflowServices = new WorkflowServices();

//       workflowServices
//         .allWorkflows(data.company_id, data.data_type)
//         .then((res) => {
//           dispatch(
//             setAllWorkflows(
//               res.data.workflows.filter(
//                 (workflow) =>
//                   (workflow?.data_type &&
//                     workflow?.data_type === currentUserportfolioDataType) ||
//                   (workflow.workflows.data_type &&
//                     workflow.workflows.data_type ===
//                     currentUserportfolioDataType)
//               )
//             )
//           );
//           toast.success('Successfully refreshed workflows');
//           setRefreshLoading(false);
//         })
//         .catch((err) => {
//           // // console.log(err, 'Refresh for workflows failed');
//           toast.info('Refresh for workflows failed');
//           setRefreshLoading(false);
//         });
//     }

//     if (itemType === 'processes') {
//       setRefreshLoading(true);

//       const data = {
//         company_id: currentUserCompanyId,
//         data_type: currentUserportfolioDataType,
//       };

//       getAllProcessesV2(data.company_id, data.data_type)
//         .then((res) => {
//           const savedProcessesInLocalStorage = JSON.parse(
//             localStorage.getItem('user-saved-processes')
//           );
//           // console.log('the res.data is ', res.data)
//           if (savedProcessesInLocalStorage) {
//             const processes = [
//               ...savedProcessesInLocalStorage,
//               ...res.data.reverse(),
//             ].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
//             dispatch(setAllProcesses(processes));
//           } else {
//             dispatch(
//               setAllProcesses(
//                 res.data.reverse()
//               )
//             );
//           }
//           toast.success('Successfully refreshed processes');
//           setRefreshLoading(false);
//         })
//         .catch((err) => {
//           // // console.log(err, 'Refresh for processes failed');
//           toast.info('Refresh for processes failed');
//           setRefreshLoading(false);
//         });
//     }

//     if (itemType === 'folders') {
//       if (!knowledgeCenter) {
//         setRefreshLoading(true);
//         fetchFolders();
//         setRefreshLoading(false);
//       }
//       else {
//         setRefreshLoading(true);
//         const url = `https://100094.pythonanywhere.com/v2/companies/6385c0f38eca0fb652c9457e/folders/knowledge-centre/?data_type=Real_Data`;
//         axios.get(url)
//           .then(response => {
//             dispatch(SetKnowledgeFolders(response.data));
//             // console.log('Data:', response.data);
//             toast.info("page refreshed successfully")
//             // Handle the response data
//           })
//           .catch(error => {
//             console.error('Error fetching data:', error);
//             // Handle the error
//           });
//         setRefreshLoading(false);
//       }
//     }


//     if (itemType === 'notifications') {
//       setRefreshLoading(true);

//       const documentService = new DocumentServices();

//       documentService
//         .getNotifications(
//           currentUserCompanyId,
//           currentUserportfolioDataType,
//           userName,
//           portfolioName
//         )
//         .then((res) => {
//           const documentsToSign = res.data.documents
//             ? res.data.documents
//               ?.reverse()
//               .filter(
//                 (document) =>
//                   document.auth_viewers &&
//                   Array.isArray(document.auth_viewers) &&
//                   // new format
//                   ((document.auth_viewers.every(
//                     (item) => typeof item === 'object'
//                   ) &&
//                     document.auth_viewers
//                       .map((viewer) => viewer.member)
//                       .includes(userDetail?.userinfo?.username) &&
//                     document.auth_viewers
//                       .map((viewer) => viewer.portfolio)
//                       .includes(currentUserPortfolioName)) ||
//                     // old format
//                     document.auth_viewers.includes(
//                       userDetail?.userinfo?.username
//                     ))
//               )
//               .filter((document) => document.process_id)
//             : [];

//           const currentNotifications = notificationsForUser.slice();
//           let updatedNotifications = currentNotifications.map(
//             (notification) => {
//               const data = documentsToSign.map((dataObj) => {
//                 let copyOfDataObj = { ...dataObj };
//                 copyOfDataObj.type = 'sign-document';
//                 return copyOfDataObj;
//               });
//               const copyOfNotification = { ...notification };
//               if (copyOfNotification.title === 'documents') {
//                 copyOfNotification.items = data;
//                 return copyOfNotification;
//               }
//               return notification;
//             }
//           );
//           // // console.log(updatedNotifications);
//           dispatch(setNotificationsForUser(updatedNotifications));
//           toast.success('Successfully refreshed notifications');
//           setRefreshLoading(false);
//         })
//         .catch((err) => {
//           // // console.log(err, 'Refresh for notifications failed');
//           toast.info('Refresh for notifications failed');
//           setRefreshLoading(false);
//         });
//     }
//   };

//   useEffect(() => {
//     setCardItemsVar(cardItems);
//     // console.log("1 mubeen")
//   }, [cardItems]);
//   // console.log('the card items are ', cardItems)

//   const handleFilterChange = (event) => {
//     setFilterName(event.target.value);
//     // Filter the cardItemsVar based on the input value
//     if (itemType === 'documents') {
//       const filteredItems = cardItems.filter(item => item.document_name.toLowerCase().includes(event.target.value.toLowerCase()));
//       setCardItemsVar(filteredItems);
//     }
//     else if (itemType === 'templates') {
//       const filteredItems = cardItems.filter(item => item.template_name.toLowerCase().includes(event.target.value.toLowerCase()));
//       setCardItemsVar(filteredItems);
//     }
//     else if (itemType === 'workflows') {
//       const filteredItems = cardItems.filter(item => item.workflows?.workflow_title.toLowerCase().includes(event.target.value.toLowerCase()));
//       setCardItemsVar(filteredItems);
//     }
//     else if (itemType === 'processes') {
//       const filteredItems = cardItems.filter(item => item.process_title.toLowerCase().includes(event.target.value.toLowerCase()));
//       setCardItemsVar(filteredItems);
//     }
//     else if (itemType === 'folders') {
//       const filteredItems = cardItems.filter(item => item.folder_name.toLowerCase().includes(event.target.value.toLowerCase()));
//       setCardItemsVar(filteredItems);
//     }


//   };

//   // console.log("cardItemsVar", cardItems)

//   return (
//     <div className={styles.container}>
//       <div className={styles.content__container}>
//         <div className={styles.content__box}>
//           <h2
//             className={maneFilesStyles.header}
//             id={idKey ? title.replaceAll(' ', '') + '-' + idKey : ''}

//           >
//             {t(title)}
//             {itemType ? (
//               itemType === 'documents' ? (
//                 allDocumentsStatus !== 'pending' ? (
//                   <div className={styles.RightBox}>
//                     {cardItems?.length > 10 ?
//                       <div className={styles.search__item__wrapper} >
//                         <input
//                           type="text"
//                           placeholder="Filter by name"
//                           value={filterName}
//                           onChange={handleFilterChange}
//                           className={styles.search__item}
//                         />
//                       </div> : ""
//                     }
//                     <button
//                       className={styles.refresh__btn}
//                       onClick={handleRefresh}
//                     >
//                       {refreshLoading ? (
//                         <LoadingSpinner
//                           color={'white'}
//                           width={'1rem'}
//                           height={'1rem'}
//                         />
//                       ) : (
//                         <IoIosRefresh />
//                       )}
//                       <span>{t('Refresh')}</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <></>
//                 )
//               ) : itemType === 'templates' ? (
//                 allTemplatesStatus !== 'pending' ? (
//                   <div className={styles.RightBox}>
//                     {cardItems?.length > 10 ?
//                       <div className={styles.search__item__wrapper} >
//                         <input
//                           type="text"
//                           placeholder="Filter by name"
//                           value={filterName}
//                           onChange={handleFilterChange}
//                           className={styles.search__item}
//                         />
//                       </div> : ""
//                     }
//                     <button
//                       className={styles.refresh__btn}
//                       onClick={handleRefresh}
//                     >
//                       {refreshLoading ? (
//                         <LoadingSpinner
//                           color={'white'}
//                           width={'1rem'}
//                           height={'1rem'}
//                         />
//                       ) : (
//                         <IoIosRefresh />
//                       )}
//                       <span>Refresh</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <></>
//                 )
//               ) : itemType === 'workflows' ? (
//                 allWorkflowsStatus !== 'pending' ? (
//                   <div className={styles.RightBox}>
//                     {cardItems?.length > 10 ?
//                       <div className={styles.search__item__wrapper} >
//                         <input
//                           type="text"
//                           placeholder="Filter by name"
//                           value={filterName}
//                           onChange={handleFilterChange}
//                           className={styles.search__item}
//                         />
//                       </div> : ""
//                     }
//                     <button
//                       className={styles.refresh__btn}
//                       onClick={handleRefresh}
//                     >
//                       {refreshLoading ? (
//                         <LoadingSpinner
//                           color={'white'}
//                           width={'1rem'}
//                           height={'1rem'}
//                         />
//                       ) : (
//                         <IoIosRefresh />
//                       )}
//                       <span>{t('Refresh')}</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <></>
//                 )
//               ) : itemType === 'processes' ? (
//                 !processesLoading ? (
//                   <div className={styles.RightBox}>
//                     {cardItems?.length > 12 ?
//                       <div className={styles.search__item__wrapper} >
//                         <input
//                           type="text"
//                           placeholder="Filter by name"
//                           value={filterName}
//                           onChange={handleFilterChange}
//                           className={styles.search__item}
//                         />
//                       </div> : ""
//                     }
//                     <button
//                       className={styles.refresh__btn}
//                       onClick={handleRefresh}
//                     >
//                       {refreshLoading ? (
//                         <LoadingSpinner
//                           color={'white'}
//                           width={'1rem'}
//                           height={'1rem'}
//                         />
//                       ) : (
//                         <IoIosRefresh />
//                       )}
//                       <span>Refresh</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <></>
//                 )
//               ) : itemType === 'folders' ? (
//                 !isFetchingFolders ? (
//                   <div className={styles.RightBox}>
//                     {cardItems?.length > 12 ?
//                       <div className={styles.search__item__wrapper} >
//                         <input
//                           type="text"
//                           placeholder="Filter by name"
//                           value={filterName}
//                           onChange={handleFilterChange}
//                           className={styles.search__item}
//                         />
//                       </div> : ""
//                     }
//                     <button
//                       className={styles.refresh__btn}
//                       onClick={handleRefresh}
//                     >
//                       {refreshLoading ? (
//                         <LoadingSpinner
//                           color={'white'}
//                           width={'1rem'}
//                           height={'1rem'}
//                         />
//                       ) : (
//                         <IoIosRefresh />
//                       )}
//                       <span>Refresh</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <></>
//                 )
//               )
//                 : itemType === 'notifications' ? (
//                   !notificationsLoading ? (
//                     <button
//                       className={styles.refresh__btn}
//                       onClick={handleRefresh}
//                     >
//                       {refreshLoading ? (
//                         <LoadingSpinner
//                           color={'white'}
//                           width={'1rem'}
//                           height={'1rem'}
//                         />
//                       ) : (
//                         <IoIosRefresh />
//                       )}
//                       <span>{t('Refresh')}</span>
//                     </button>
//                   ) : (
//                     <></>
//                   )
//                 ) : (
//                   <></>
//                 )
//             ) : (
//               <></>
//             )}
//           </h2>

//           {/* {status === 'pending' ? (
//             <BookSpinner />
//             // <Skeleton />
//           ) : (
//             Card &&
//             cardItemsVar &&
//             cardItemsVar.length && (
//               <>
//                 {!isDemo ? (
//                   cardItemsVar &&
//                   cardItemsVar.length > 0 && (
//                     <div className={styles.grid__box}>
//                       {Card &&
//                         cardItemsVar.map((item) => (
//                           <Card 
//                             key={item?._id}
//                             cardItem={item}
//                             hideFavoriteIcon={hideFavoriteIcon}
//                             hideDeleteIcon={hideDeleteIcon}
//                             isFolder={itemType === 'folder' ? true : false}
//                             folderId={folderId}
//                             isCompletedDoc={isCompleted}
//                             isRejectedDoc={isRejected}
//                             isReport={isReport}
//                             knowledgeCenter={knowledgeCenter}
//                           />  || <Skeleton />
//                         ))}
//                     </div>
//                   )
//                 ) : null}
//               </>
//             )
//           )} */}

//               {status === 'pending' ? (
//                 <div style={{ marginTop: '15px' }}>
//                   <BookSpinner />
//                 </div>
//           ) : (
            
//                 <div className={styles.grid__box}>
//                   {cardItemsVar?.slice(0, sliceCount).map((item, index) => (
//                   <div key={item._id}>
//                     <Card
//                       cardItem={item}
//                       hideFavoriteIcon={hideFavoriteIcon}
//                       hideDeleteIcon={hideDeleteIcon}
//                       isFolder={itemType === 'folder'}
//                       folderId={folderId}
//                       isCompletedDoc={isCompleted}
//                       isRejectedDoc={isRejected}
//                       isReport={isReport}
//                       knowledgeCenter={knowledgeCenter}
//                     />
//                     {index === cardItemsVar?.length - 1 && <div ref={observer}></div>}
//                   </div>   
//                   ))}
//                 </div>
//           )} 
//           {loadingMore && <p>Loading more..</p>}
//           </div>
//       </div>
//     </div>
//   );
// };

// export default SectionBox;

// // import React, { useEffect, useState, useRef } from 'react';

// // const SectionBox = ({
// //   cardItems,
// //   title,
// //   Card,
// //   status,
// //   idKey,
// //   itemType,
// //   hideFavoriteIcon,
// //   hideDeleteIcon,
// //   folderId,
// //   isDemo,
// //   isReports,
// //   isCompleted,
// //   isRejected,
// //   isReport,
// //   knowledgeCenter,
// // }) => {
// //   const [sliceCount, setSliceCount] = useState(1);
// //   const [refreshLoading, setRefreshLoading] = useState(false);
// //   const [filterName, setFilterName] = useState('');
// //   const [isDemoLoading, setIsDemoLoading] = useState(false);
// //   const [cardItemsVar, setCardItemsVar] = useState(cardItems);
// //   const [count, setCount] = useState(1);
//   // const [isLoadingMore, setIsLoadingMore] = useState(false);
// //   const observer = useRef();

//   // const lastCardRef = useCallback(node => {
//   //   if (isLoadingMore) return;
//   //   if (observer.current) observer.current.disconnect();
//   //   observer.current = new IntersectionObserver(entries => {
//   //     if (entries[0].isIntersecting) {
//   //       handleLoadMore();
//   //     }
//   //   });
//   //   if (node) observer.current.observe(node);
//   // }, [isLoadingMore]);

//   // useEffect(() => {
//   //   setCardItemsVar(cardItems);
//   // }, [cardItems]);

//   // useEffect(() => {
//   //   if (!isLoadingMore) return;
//   //   if (isDemo) {
//   //     handleDemoLoadMore();
//   //   } else {
//   //     setSliceCount(prev => prev + 1);
//   //   }
//   //   setIsLoadingMore(false);
//   // }, [isLoadingMore]);

//   // const handleLoadMore = () => {
//   //   setIsLoadingMore(true);
//   // };

import styles from './sectionBox.module.css';
import maneFilesStyles from '../manageFiles.module.css';
import BookSpinner from '../../bookSpinner/BookSpinner';
import { useEffect, useState, useRef } from 'react';

import { PrimaryButton } from '../../styledComponents/styledComponents';
import { IoIosRefresh } from 'react-icons/io';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentServices } from '../../../services/documentServices';
import { toast } from 'react-toastify';
import { TemplateServices } from '../../../services/templateServices';
import { WorkflowServices } from '../../../services/workflowServices';
import { getAllProcessesV2 } from '../../../services/processServices';
import {
  setAllProcesses,
  setNotificationsForUser,
} from '../../../features/app/appSlice';
import { setAllDocuments } from '../../../features/document/documentSlice';
import { setAllTemplates } from '../../../features/template/templateSlice';
import { setAllWorkflows } from '../../../features/workflow/workflowsSlice';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../utils/helpers';
import { useAppContext } from '../../../contexts/AppContext';
import {
  SetKnowledgeFolders
} from '../../../features/app/appSlice';
import axios from 'axios';

const SectionBox = ({
  cardItems,
  title,
  Card,
  status,
  idKey,
  itemType,
  hideFavoriteIcon,
  hideDeleteIcon,
  folderId,
  isDemo,
  isReports,
  isCompleted,
  isRejected,
  isReport,
  knowledgeCenter,
}) => {
  const [sliceCount, setSliceCount] = useState(1);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const { processesLoading, notificationsForUser, notificationsLoading } =
    useSelector((state) => state.app);
  const { allDocumentsStatus } = useSelector((state) => state.document);
  const { allTemplatesStatus } = useSelector((state) => state.template);
  const { allWorkflowsStatus } = useSelector((state) => state.workflow);
  const [filterName, setFilterName] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [cardItemsVar, setCardItemsVar] = useState(cardItems);
  const [count, setCount] = useState(1);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
  const {
    fetchDemoTemplates,
    fetchDemoDocuments,
    fetchDocumentReports,
    fetchTemplateReports,
    userName,
    portfolioName,
    fetchOrgDocumentReports,
    isFetchingFolders,
    fetchFolders
  } = useAppContext();

  // const handleLoadMore = () => {
  //   setSliceCount((prev) => prev + 1);
  // };

  // const bottomOfPageRef = useRef();

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting && !loadMoreDisabled) {
  //         handleDemoLoadMore();
  //       }
  //     },
  //     {
  //       root: null,
  //       rootMargin: '0px',
  //       threshold: 0.5,
  //     }
  //   );

  //   if (bottomOfPageRef.current) {
  //     observer.observe(bottomOfPageRef.current);
  //   }

  //   return () => {
  //     if (bottomOfPageRef.current) {
  //       observer.unobserve(bottomOfPageRef.current);
  //     }
  //   };
  // }, [loadMoreDisabled]);

  const handleDemoLoadMore = async () => {
     
    if (cardItemsVar?.length / 18 > sliceCount) {
      setSliceCount((prev) => prev + 1);
    } else {
      setIsDemoLoading(true);
      try {
        const res =
          itemType === 'templates'
            ? await new TemplateServices().demoTemplates(count + 1)
            : itemType === 'documents'
              ? await new DocumentServices().demoDocuments(count + 1)
              : {};
        setCardItemsVar(
          res.data ? [...cardItemsVar, ...res.data.templates] : cardItemsVar
        );
        setCount(count + 1);
      } catch (err) {
        console.log(err);
      } finally {
        setIsDemoLoading(false);
      }
    }
  };

  // useEffect(() => {
  //   console.log('cardItemsVar: ', cardItemsVar);
  // }, [cardItemsVar]);

  const handleRefresh = () => {
    if (refreshLoading) return;

    const [
      currentUserCompanyId,
      currentUserportfolioDataType,
      currentUserPortfolioName,
    ] = [
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
          )?.data_type
          : userDetail?.portfolio_info[0]?.portfolio_name,
      ];

    if (itemType === 'documents') {
      setRefreshLoading(true);

      const data = {
        company_id: currentUserCompanyId,
        data_type: currentUserportfolioDataType,
      };

      const documentServices = new DocumentServices();

      if (isDemo) fetchDemoDocuments();
      else if (isCompleted && !window.location.hash.includes('completed#org')) fetchDocumentReports('finalized');
      else if (isCompleted && window.location.hash.includes('completed#org')) fetchOrgDocumentReports('finalized');
      else if (isRejected && !window.location.hash.includes('rejected#org')) fetchDocumentReports('rejected');
      else if (isRejected && window.location.hash.includes('rejected#org')) fetchOrgDocumentReports('rejected');
      else {
        documentServices
          .allDocuments(data.company_id, data.data_type)
          .then((res) => {
            dispatch(
              setAllDocuments(
                res.data.documents

                  .filter(
                    (document) =>
                      document.document_state !== 'trash' &&
                      document.data_type &&
                      document.data_type === currentUserportfolioDataType
                  )
              )
            );
            toast.success('Successfully refreshed documents');
            setRefreshLoading(false);
          })
          .catch((err) => {
            // console.log(err, 'Refresh for documents failed');
            toast.info('Refresh for documents failed');
            setRefreshLoading(false);
          });
      }
      setRefreshLoading(false);
    }

    if (itemType === 'templates') {
      setRefreshLoading(true);

      if (isDemo) fetchDemoTemplates();
      else if (isReports) fetchTemplateReports();
      else {
        const data = {
          company_id: currentUserCompanyId,
          data_type: currentUserportfolioDataType,
        };

        const templatesServices = new TemplateServices();

        templatesServices
          .allTemplates(data.company_id, data.data_type)
          .then((res) => {
            dispatch(
              setAllTemplates(
                res.data.templates

                  .filter(
                    (template) =>
                      template.data_type &&
                      template.data_type === currentUserportfolioDataType
                  )
              )
            );
            toast.success('Successfully refreshed templates');
            setRefreshLoading(false);
          })
          .catch((err) => {
            // console.log(err, 'Refresh for templates failed');
            toast.info('Refresh for templates failed');
            setRefreshLoading(false);
          });
      }
    }

    if (itemType === 'workflows') {
      setRefreshLoading(true);

      const data = {
        company_id: currentUserCompanyId,
        data_type: currentUserportfolioDataType,
      };

      const workflowServices = new WorkflowServices();

      workflowServices
        .allWorkflows(data.company_id, data.data_type)
        .then((res) => {
          dispatch(
            setAllWorkflows(
              res.data.workflows.filter(
                (workflow) =>
                  (workflow?.data_type &&
                    workflow?.data_type === currentUserportfolioDataType) ||
                  (workflow.workflows.data_type &&
                    workflow.workflows.data_type ===
                    currentUserportfolioDataType)
              )
            )
          );
          toast.success('Successfully refreshed workflows');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for workflows failed');
          toast.info('Refresh for workflows failed');
          setRefreshLoading(false);
        });
    }

    if (itemType === 'processes') {
      setRefreshLoading(true);

      const data = {
        company_id: currentUserCompanyId,
        data_type: currentUserportfolioDataType,
      };

      getAllProcessesV2(data.company_id, data.data_type)
        .then((res) => {
          const savedProcessesInLocalStorage = JSON.parse(
            localStorage.getItem('user-saved-processes')
          );
          console.log('the res.data is ', res.data)
          if (savedProcessesInLocalStorage) {
            const processes = [
              ...savedProcessesInLocalStorage,
              ...res.data.reverse(),
            ].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
            dispatch(setAllProcesses(processes));
          } else {
            dispatch(
              setAllProcesses(
                res.data.reverse()
              )
            );
          }
          toast.success('Successfully refreshed processes');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for processes failed');
          toast.info('Refresh for processes failed');
          setRefreshLoading(false);
        });
    }

    if (itemType === 'folders') {
      if (!knowledgeCenter) {
        setRefreshLoading(true);
        fetchFolders();
        setRefreshLoading(false);
      }
      else {
        setRefreshLoading(true);
        const url = `https://100094.pythonanywhere.com/v2/companies/6385c0f38eca0fb652c9457e/folders/knowledge-centre/?data_type=Real_Data`;
        axios.get(url)
          .then(response => {
            dispatch(SetKnowledgeFolders(response.data));
            console.log('Data:', response.data);
            toast.info("page refreshed successfully")
            // Handle the response data
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            // Handle the error
          });
        setRefreshLoading(false);
      }
    }


    if (itemType === 'notifications') {
      setRefreshLoading(true);

      const documentService = new DocumentServices();

      documentService
        .getNotifications(
          currentUserCompanyId,
          currentUserportfolioDataType,
          userName,
          portfolioName
        )
        .then((res) => {
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
                      .includes(currentUserPortfolioName)) ||
                    // old format
                    document.auth_viewers.includes(
                      userDetail?.userinfo?.username
                    ))
              )
              .filter((document) => document.process_id)
            : [];

          const currentNotifications = notificationsForUser.slice();
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
          // console.log(updatedNotifications);
          dispatch(setNotificationsForUser(updatedNotifications));
          toast.success('Successfully refreshed notifications');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for notifications failed');
          toast.info('Refresh for notifications failed');
          setRefreshLoading(false);
        });
    }
  };

  useEffect(() => {
    setCardItemsVar(cardItems);
  }, [cardItems]);
  console.log("cardItemsVar", cardItems);

  // useEffect(() => {
  //   if (cardItemsVar && cardItemsVar.length > 20) {
  //     setTimeout(() => {
  //       setSliceCount(2);
  //       // setLoadMoreDisabled(false);
  //     }, 3000);
  //   }
  // }, [cardItemsVar]);

  useEffect(() => {
    if (cardItemsVar && cardItemsVar.length > 20) {
      const intervalId = setInterval(() => {
        if (cardItemsVar?.length / 12 > sliceCount) {
          setSliceCount((prev) => prev + 1);
        } else {
          clearInterval(intervalId);
          setLoadMoreDisabled(true);
        }
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [cardItemsVar, sliceCount]);

  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
    // Filter the cardItemsVar based on the input value
    if (itemType === 'documents') {
      const filteredItems = cardItems.filter(item => item.document_name.toLowerCase().includes(event.target.value.toLowerCase()));
      setCardItemsVar(filteredItems);
    }
    else if (itemType === 'templates') {
      const filteredItems = cardItems.filter(item => item.template_name.toLowerCase().includes(event.target.value.toLowerCase()));
      setCardItemsVar(filteredItems);
    }
    else if (itemType === 'workflows') {
      const filteredItems = cardItems.filter(item => item.workflows?.workflow_title.toLowerCase().includes(event.target.value.toLowerCase()));
      setCardItemsVar(filteredItems);
    }
    else if (itemType === 'processes') {
      const filteredItems = cardItems.filter(item => item.process_title.toLowerCase().includes(event.target.value.toLowerCase()));
      setCardItemsVar(filteredItems);
    }
    else if (itemType === 'folders') {
      const filteredItems = cardItems.filter(item => item.folder_name.toLowerCase().includes(event.target.value.toLowerCase()));
      setCardItemsVar(filteredItems);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2 className={maneFilesStyles.header} id={idKey ? title.replaceAll(' ', '') + '-' + idKey : ''}>
            {t(title)}
            {/* Refresh button and search input */}
            {itemType &&
              ((itemType === 'documents' && allDocumentsStatus !== 'pending') ||
                (itemType === 'templates' && allTemplatesStatus !== 'pending') ||
                (itemType === 'workflows' && allWorkflowsStatus !== 'pending') ||
                (itemType === 'processes' && !processesLoading) ||
                (itemType === 'folders' && !isFetchingFolders) ||
                (itemType === 'notifications' && !notificationsLoading)) && (
                <div className={styles.RightBox}>
                  {cardItems?.length > 10 && (
                    <div className={styles.search__item__wrapper}>
                      <input
                        type="text"
                        placeholder="Filter by name"
                        value={filterName}
                        onChange={handleFilterChange}
                        className={styles.search__item}
                      />
                    </div>
                  )}
                  <button className={styles.refresh__btn} onClick={handleRefresh}>
                    {refreshLoading ? (
                      <LoadingSpinner color={'white'} width={'1rem'} height={'1rem'} />
                    ) : (
                      <IoIosRefresh />
                    )}
                    <span>{t('Refresh')}</span>
                  </button>
                </div>
              )}
          </h2>

          {status === 'pending' ? (
            <div style={{ marginTop: '15px' }}>
              <BookSpinner />
            </div>
          ) : (
            Card &&
            cardItemsVar &&
            cardItemsVar.length && (
              <>
                <div className={styles.grid__box}>
                  {Card &&
                    cardItemsVar &&
                    cardItemsVar?.length > 0 &&
                    cardItemsVar.slice(0, sliceCount * 18).map((item) => (
                      <Card
                        key={item?._id}
                        cardItem={item}
                        hideFavoriteIcon={hideFavoriteIcon}
                        hideDeleteIcon={hideDeleteIcon}
                        isFolder={itemType === 'folder' ? true : false}
                        folderId={folderId}
                        isCompletedDoc={isCompleted}
                        isRejectedDoc={isRejected}
                        isReport={isReport}
                        knowledgeCenter={knowledgeCenter}
                      />
                    ))}
                </div>
                {/* <div ref={bottomOfPageRef} /> */}
                {cardItemsVar?.length > sliceCount * 18 && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  {cardItemsVar?.length > sliceCount * 18 && (
                    <p
                      onClick={handleDemoLoadMore}
                      style={isDemoLoading ? { pointerEvents: 'none' } : {}}
                      disabled={isDemoLoading}
                    >
                      {isDemoLoading ? (
                        <LoadingSpinner color={'white'} width={'1rem'} height={'1rem'} />
                      ) : (
                        'Load More...'
                      )}
                    </p>
                  )}
                </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
