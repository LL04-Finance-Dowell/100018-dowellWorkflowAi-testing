import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WorkflowSettingServices } from '../services/workflowSettingServices';
import { useMediaQuery } from 'react-responsive';
import { dateTimeStampFormat, productName } from '../utils/helpers';
import {
  setFetchedPermissionArray,
  setThemeColor,
} from '../features/app/appSlice';
import { v4 } from 'uuid';
import { FolderServices } from '../services/folderServices';
import { TemplateServices } from '../services/templateServices';
import { DocumentServices } from '../services/documentServices';
import {
  getCompletedProcesses,
  getActiveProcesses,
} from '../services/processServices';

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const isDesktop = useMediaQuery({
    query: '(min-width: 1050px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });
  const [nonDesktopStyles] = useState({
    gap: '0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gridGap: '10px',
  });
  const [toggleNewFileForm, setToggleNewFileForm] = useState(null);
  const [favoriteItems, setFavoriteitems] = useState({
    documents: [],
    templates: [],
    workflows: [],
  });
  const [favoriteItemsLoaded, setFavoriteitemsLoaded] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [searchItemsStatus, setSearchItemsStatus] = useState({
    documentsAdded: false,
    templatesAdded: false,
    workflowsAdded: false,
  });
  const [workflowTeams, setWorkflowTeams] = useState([]);
  const [selectedTeamIdGlobal, setSelectedTeamIdGlobal] = useState();

  const [rerun, setRerun] = useState(false);
  const [sync, setSync] = useState(true);
  const [isPublicUser, setIsPublicUser] = useState(false);
  const [publicUserConfigured, setPublicUserConfigured] = useState(false);

  const [filter, setFilter] = useState('team_member');
  // const [isFetchingTeams, setIsFetchingTeams] = useState(true);
  const [isNoPointerEvents, setIsNoPointerEvents] = useState(false);
  const [workflowTeamsLoaded, setWorkflowTeamsLoaded] = useState(false);
  const [workflowSettings, setWorkflowSettings] = useState(null);
  const [fetchedItems, setFetchedItems] = useState([]);

  const { userDetail } = useSelector((state) => state.auth);
  const [rerender, setRerender] = useState('rand'); //* This is to force certain useEffects to rerun
  const [processDisplayName, setProcessDisplayName] = useState('');
  const [openNameChangeModal, setOpenNameChangeModal] = useState(false);
  const [nameChangeTitle, setNameChangeTitle] = useState('');
  const [customDocName, setCustomDocName] = useState('');
  const [customTempName, setCustomTempName] = useState('');
  const [customWrkfName, setCustomWrkfName] = useState('');
  const { permissionArray } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const [folders, setFolders] = useState(null);
  const [folderActionId, setFolderActionId] = useState('');
  const [isFetchingFolders, setIsFetchingFolders] = useState(false);
  const [demoTemplates, setDemoTemplates] = useState(null);
  const [demoDocuments, setDemoDocuments] = useState(null);
  const [demoDocStatus, setDemoDocStatus] = useState('');
  const [demoTempStatus, setDemoTempStatus] = useState('');
  const [docsCompleted, setDocsCompleted] = useState(null);
  const [docsRejected, setDocsRejected] = useState(null);
  const [docsCompletedStatus, setDocsCompletedStatus] = useState('');
  const [docsRejectedStatus, setDocsRejectedStatus] = useState('');
  const [orgDocsCompleted, setOrgDocsCompleted] = useState(null);
  const [orgDocsRejected, setOrgDocsRejected] = useState(null);
  const [orgDocsCompletedStatus, setOrgDocsCompletedStatus] = useState('');
  const [orgDocsRejectedStatus, setOrgDocsRejectedStatus] = useState('');
  const [savedDocuments, setSavedDocuments] = useState(null);
  const [draftDocuments, setDraftDocuments] = useState(null);
  const [savedDocumentsStatus, setSavedDocumentsStatus] = useState('');
  const [draftDocumentsStatus, setDraftDocumentsStatus] = useState('');
  const [tempReports, setTempReports] = useState(null);
  const [tempReportsStatus, setTempReportsStatus] = useState('');
  const [completedProcesses, setCompletedProcesses] = useState(null);
  const [completedProcessesStatus, setCompletedProcessesStatus] = useState('');
  const [activeProcesses, setActiveProcesses] = useState(null);
  const [activeProcessesStatus, setActiveProcessesStatus] = useState('');

  const [companyId, setCompanyId] = useState(
    userDetail?.portfolio_info?.length > 1
      ? userDetail?.portfolio_info.find(
        (portfolio) => portfolio.product === productName
      )?.org_id
      : userDetail?.portfolio_info[0].org_id
  );
  const [userName, setUserName] = useState(
    userDetail?.portfolio_info[0]?.username
  );
  const [portfolioName, setPortfolioName] = useState(
    userDetail?.portfolio_info[0]?.portfolio_name
  );
  const [member, setMember] = useState(
    userDetail?.portfolio_info[0]?.portfolio_name
  );
  const [dataType, setDataType] = useState(
    userDetail?.portfolio_info?.length > 1
      ? userDetail?.portfolio_info.find(
        (portfolio) => portfolio.product === productName
      )?.data_type
      : userDetail?.portfolio_info[0]?.data_type
  );

  const [showFoldersActionModal, setShowFoldersActionModal] = useState({
    state: false,
    action: '',
  });
  const [dowellReasearchTemplates, setDowellResearchTemplates] = useState([]);

  const [isAssignTask, setIsAssignTask] = useState(true);

  // const [createdNewTeam, setCreatedNewTeam] = useState();

  const addToFavoritesState = (category, value) => {
    const currentFavorites = { ...favoriteItems };

    currentFavorites[category] = [...currentFavorites[`${category}`], value];

    setFavoriteitems(currentFavorites);
  };
  // const handleDropdownChange = () => {

  //   }

  const removeFromFavoritesState = (category, itemId) => {
    const currentFavorites = { ...favoriteItems };
    currentFavorites[category] = currentFavorites[category].filter(
      (item) => item._id !== itemId
    );
    setFavoriteitems(currentFavorites);
  };

  const updateSearchItemStatus = (itemAdded, value) => {
    if (itemAdded === 'documentsAdded')
      setSearchItemsStatus((prevItems) => {
        return { ...prevItems, documentsAdded: value };
      });
    if (itemAdded === 'templatesAdded')
      setSearchItemsStatus((prevItems) => {
        return { ...prevItems, templatesAdded: value };
      });
    if (itemAdded === 'workflowsAdded')
      setSearchItemsStatus((prevItems) => {
        return { ...prevItems, workflowsAdded: value };
      });
  };

  const extractTeamContent = ({ content }) => {
    return content
      .slice(0, content.length - 1)
      .split('(')
      .slice(1)
      .join('')
      .split(', ');
  };

  const fetchSettings = async () => {
    const userCompanyId =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info?.find(
          (portfolio) => portfolio.product === productName
        )?.org_id
        : userDetail?.portfolio_info[0]?.org_id;

    const res = await new WorkflowSettingServices().fetchWorkflowSettings(
      userCompanyId
    );

    setWorkflowSettings(res.data);
  };

  const fetchSettingsData = async () => {
    const companyId =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info?.find(
          (portfolio) => portfolio.product === productName
        )?.org_id
        : userDetail?.portfolio_info[0]?.org_id;

    try {
      const res = await new WorkflowSettingServices().fetchWorkflowSettingsData(
        companyId,
        dataType
      );
  
      // console.log("res.data",res.data)
      setWorkflowSettings(res.data); 
    } catch (error) {
      
    }
  };
  
  const fetchDemoTemplates = async () => {
    setDemoTempStatus('pending');
    try {
      const res = await new TemplateServices().demoTemplates(1);
      setDemoTemplates(res.data ? res.data.templates : []);
    } catch (err) {
      // console.log(err);
    } finally {
      setDemoTempStatus('');
    }
  };

  const fetchDocumentReports = async (state) => {
    if (state === 'finalized') setDocsCompletedStatus('pending');
    else if (state === 'rejected') setDocsRejectedStatus('pending');
    try {
      const res = await new DocumentServices().getDocumentReports(
        companyId,
        dataType,
        userName,
        member,
        portfolioName,
        state
      );
      if (state === 'finalized')
        setDocsCompleted(res.data.documents ? res.data.documents.reverse() : []);
      else if (state === 'rejected')
        setDocsRejected(res.data.documents ? res.data.documents : []);
    } catch (err) {
      // console.log(err);
    } finally {
      if (state === 'finalized') setDocsCompletedStatus('');
      else if (state === 'rejected') setDocsRejectedStatus('');
    }
  };

  const fetchOrgDocumentReports = async (state) => {
    if (state === 'finalized') setOrgDocsCompletedStatus('pending');
    else if (state === 'rejected') setOrgDocsRejectedStatus('pending');
    const member = userDetail.userinfo.username
    try {
      const res = await new DocumentServices().getOrgDocumentReports(
        companyId,
        dataType,
        state,
        member
      );
       
      const resp = await new DocumentServices().getOrgDocumentReportsFinalized(
        companyId,
        dataType,
        state
      );
      if (state === 'finalized')
        setOrgDocsCompleted(resp.data.clones ? resp.data.clones : []);
      else if (state === 'rejected')
        setOrgDocsRejected(res.data.clones ? res.data.clones : []);
    } catch (err) {
      console.log(err);
    } finally {
      if (state === 'finalized') setOrgDocsCompletedStatus('');
      else if (state === 'rejected') setOrgDocsRejectedStatus('');
    }
  };

//   const fetchOrgDocumentReports = async (state) => {
//     if (state === 'finalized') setOrgDocsCompletedStatus('pending');
//     else if (state === 'rejected') setOrgDocsRejectedStatus('pending');
//     const member = userDetail.userinfo.username;
//     try {
//       // Make the first API call
//       const res = await new DocumentServices().getOrgDocumentReports(
//         companyId,
//         dataType,
//         state,
//         member
//       );
       
//       // Process the response of the first API call
//       if (state === 'rejected')
//         setOrgDocsRejected(res.data.clones ? res.data.clones : []);

//       // Make the second API call only if the state is 'finalized'
//       if (state === 'finalized') {
//         const resp = await new DocumentServices().getOrgDocumentReportsFinalized(
//           companyId,
//           dataType,
//           state
//         );
//         setOrgDocsCompleted(resp.data.clones ? resp.data.clones : []);
//       }
//     } catch (err) {
//       console.log(err);
//     } finally {
//       // Reset the status after API calls
//       if (state === 'finalized') setOrgDocsCompletedStatus('');
//       else if (state === 'rejected') setOrgDocsRejectedStatus('');
//     }
// };

// 6385c0e78eca0fb652c944ae


  const fetchProcessReports = async (type) => {
    if (type === 'completed') setCompletedProcessesStatus('pending');
    else if (type === 'active') setActiveProcessesStatus('pending');

    try {
      let processes = [];
      if (type === 'completed') {
        const res = await getCompletedProcesses(companyId, dataType, 'finalized');
        processes = res.data ? res.data : [];
      } else if (type === 'active') {
            const res = await getActiveProcesses(companyId, dataType, 'processing');
            processes = res.data ? res.data : [];
        }
        processes.sort((a, b) => {
            const aDate = a.created_at || a.created_on;
            const bDate = b.created_at || b.created_on;
            const dateA = new Date(dateTimeStampFormat(aDate));
            const dateB = new Date(dateTimeStampFormat(bDate));
            return dateB - dateA;
            // return dateA - dateB;
        });

        if (type === 'completed') setCompletedProcesses(processes);
        else if (type === 'active') setActiveProcesses(processes);
    } catch (err) {
        console.error('Error fetching processes:', err);
    } finally {
        if (type === 'completed') setCompletedProcessesStatus('');
        else if (type === 'active') setActiveProcessesStatus('');
    }
  };


  const fetchSavedDocuments = async () => {
    setSavedDocumentsStatus('pending');
    try {
      const res = await new DocumentServices().savedDocuments(
        companyId,
        dataType,
      );
      setSavedDocuments(res.data ? res.data.clones : []);
    } catch (err) {
      // console.log(err);
    } finally {
      setSavedDocumentsStatus('');
    }
  };

  ////////////////////// New

  const fetchDraftDocuments = async () => {
    setDraftDocumentsStatus('pending');
    const member = userDetail.userinfo.username
    try {
      const res = await new DocumentServices().getDraftDocuments(
        companyId,
        dataType,
        member
      );
      setDraftDocuments(res.data ? res.data.clones : []);
    } catch (err) {
      // console.log(err);
    } finally {
      setDraftDocumentsStatus('');
    }
  };

  const fetchTemplateReports = async () => {
    setTempReportsStatus('pending');
    try {
      const res = new TemplateServices().getTemplateReports(
        companyId,
        dataType,
        userName,
        portfolioName
      );
      setTempReports(res.data ? res.data.templates : []);
    } catch (err) {
      // console.log(err);
    } finally {
      setTempReportsStatus('');
    }
  };

  // // console.log(userName, portfolioName, dataType);

  const fetchDemoDocuments = async () => {
    setDemoDocStatus('pending');
    try {
      const res = await new DocumentServices().demoDocuments(1);
      setDemoDocuments(res.data ? res.data.documents : []);
    } catch (err) {
      // console.log(err);
    } finally {
      setDemoDocStatus('');
    }
  };

  const fetchFolders = async () => {
    const folderServices = new FolderServices();
    const userCompanyId =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info?.find(
          (portfolio) => portfolio.product === productName
        )?.org_id
        : userDetail?.portfolio_info[0]?.org_id;
    setIsFetchingFolders(true);
    try {
      const res = await folderServices.getAllFolders(userCompanyId, dataType);
      setFolders(res.data ? res.data.reverse() : []); /////////////////////////
    } catch (err) {
      // console.log(err);
    } finally {
      setIsFetchingFolders(false);
    }
  };

  const extractCustomName = (str) =>
    str ? str.slice(str.indexOf('(') + 1, str.indexOf(')')) : str;

  useEffect(() => {
    if (userDetail) {
      setCompanyId(
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.org_id
          : userDetail?.portfolio_info[0].org_id
      );
      setUserName(userDetail?.portfolio_info[0]?.username);
      setPortfolioName(userDetail?.portfolio_info[0]?.portfolio_name);
      setMember(userDetail?.portfolio_info[0]?.portfolio_name);
      setDataType(
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.data_type
          : userDetail?.portfolio_info[0]?.data_type
      );
    }
  }, [userDetail]);

  useEffect(() => {
    if (!publicUserConfigured) return;
    if (userDetail && userDetail.portfolio_info && !isPublicUser) {
      if (!workflowTeamsLoaded) {
        //* Fetching workflow teams
        const settingService = new WorkflowSettingServices();
        const userCompanyId =
          userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info?.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
            : userDetail?.portfolio_info[0]?.org_id;

        settingService
          .getAllTeams(userCompanyId, dataType)
          .then((res) => {
            setWorkflowTeams(Array.isArray(res.data) ? res.data : []);
            setWorkflowTeamsLoaded(true);
          })
          .catch((err) => {
            // console.log(
            //   'Failed to fetch teams: ',
            //   err
            //   // .response ? err.response.data : err.message
            // );
            setWorkflowTeamsLoaded(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail, isPublicUser, publicUserConfigured]);

  useEffect(() => {
    if (userDetail && userDetail.portfolio_info) {
      // fetchSettings();
      fetchSettingsData();
      // fetchFolders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail]);

  useEffect(() => {
    if (workflowSettings) {
      let tempItems = [];
      for (let key in workflowSettings[0]) {
        if (
          typeof workflowSettings[0][key] !== 'string' &&
          workflowSettings[0][key].length
        ) {
          tempItems.push({
            title: key.replace('_', ' '),
            content: workflowSettings[0][key],
          });
        } else if (key === 'theme_color') {
          tempItems.push({ title: key, content: workflowSettings[0][key] });
        }
      }
      setFetchedItems(tempItems);
    }
  }, [workflowSettings]);

  useEffect(() => {
    if (fetchedItems.length) {
      let rawItems = [];
      permissionArray[0].children.forEach((child) => {
        child.column.forEach((col) => {
          fetchedItems.forEach(({ title, content }) => {
            if (
              title === col.proccess_title ||
              (title === 'Process' && col.proccess_title === 'Processes') ||
              (title === 'Portfolio Choice' &&
                col.proccess_title === 'Portfolio/Team Roles')
            ) {
              col.items.forEach((item) => {
                content.forEach((fItem) => {
                  if (
                    fItem === item.content ||
                    item.content.includes(fItem.split(' (')[0])
                  )
                    rawItems.push({
                      _id: item._id,
                      content: fItem,
                      title:
                        title === 'Process'
                          ? 'Processes'
                          : title === 'Portfolio Choice'
                            ? 'Portfolio/Team Roles'
                            : title,
                      boxId: child._id,
                    });
                });
              });
            }
          });
        });
      });

      dispatch(setFetchedPermissionArray(rawItems));
      dispatch(
        setThemeColor(
          fetchedItems.find((item) => item.title === 'theme_color').content
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedItems]);

  useEffect(() => {
    // ! If user unselects option in the process, the custom name is lost
    if (permissionArray) {
      const customArr = permissionArray[0].children[0].column[0].items.map(
        (item) =>
          (item.content.includes('Documents') ||
            item.content.includes('Templates') ||
            item.content.includes('Workflows')) &&
            !item.content.includes('set display name')
            ? item.content
            : null
      );

      const iniDocs = customArr.find((item) =>
        item && item.includes('Documents') ? item : null
      );

      const iniTemps = customArr.find((item) =>
        item && item.includes('Templates') ? item : null
      );

      const iniWorks = customArr.find((item) =>
        item && item.includes('Workflows') ? item : null
      );

      setCustomDocName(extractCustomName(iniDocs));
      setCustomTempName(extractCustomName(iniTemps));
      setCustomWrkfName(extractCustomName(iniWorks));
    }
  }, [permissionArray]);

  return (
    <AppContext.Provider
      value={{
        toggleNewFileForm,
        setToggleNewFileForm,
        favoriteItems,
        setFavoriteitems,
        favoriteItemsLoaded,
        setFavoriteitemsLoaded,
        addToFavoritesState,
        removeFromFavoritesState,
        searchItems,
        setSearchItems,
        searchItemsStatus,
        updateSearchItemStatus,
        workflowTeams,
        setWorkflowTeams,

        extractTeamContent,
        selectedTeamIdGlobal,
        setSelectedTeamIdGlobal,
        rerun,
        setRerun,
        filter,
        setFilter,
        sync,
        setSync,
        isPublicUser,
        setIsPublicUser,
        publicUserConfigured,
        setPublicUserConfigured,
        isNoPointerEvents,
        setIsNoPointerEvents,
        workflowTeamsLoaded,
        rerender,
        setRerender,
        workflowSettings,
        processDisplayName,
        setProcessDisplayName,
        openNameChangeModal,
        setOpenNameChangeModal,
        nameChangeTitle,
        setNameChangeTitle,
        isDesktop,
        isMobile,
        nonDesktopStyles,
        customDocName,
        customTempName,
        customWrkfName,
        folders,
        setFolders,
        showFoldersActionModal,
        setShowFoldersActionModal,
        folderActionId,
        setFolderActionId,
        userDetail,
        isFetchingFolders,
        fetchFolders,
        demoTemplates,
        setDemoTemplates,
        demoDocuments,
        setDemoDocuments,
        demoDocStatus,
        demoTempStatus,
        fetchDemoTemplates,
        fetchDemoDocuments,
        fetchDocumentReports,
        docsCompleted,
        docsRejected,
        docsCompletedStatus,
        docsRejectedStatus,
        tempReports,
        tempReportsStatus,
        fetchTemplateReports,
        activeProcesses,
        activeProcessesStatus,
        completedProcesses,
        completedProcessesStatus,
        fetchProcessReports,
        userName,
        portfolioName,
        savedDocuments,
        draftDocuments,
        draftDocumentsStatus,
        savedDocumentsStatus,
        fetchSavedDocuments,
        fetchDraftDocuments,
        isAssignTask,
        setIsAssignTask,
        dataType,
        orgDocsCompleted,
        orgDocsRejected,
        orgDocsCompletedStatus,
        orgDocsRejectedStatus,
        fetchOrgDocumentReports
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
