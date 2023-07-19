import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WorkflowSettingServices } from '../services/workflowSettingServices';
import { useMediaQuery } from 'react-responsive';
import { productName } from '../utils/helpers';
import {
  setFetchedPermissionArray,
  setThemeColor,
} from '../features/app/appSlice';
import { v4 } from 'uuid';
import { FolderServices } from '../services/folderServices';
import { TemplateServices } from '../services/templateServices';

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
  const [rerender, setRerender] = useState('rand');
  const [processDisplayName, setProcessDisplayName] = useState('');
  const [openNameChangeModal, setOpenNameChangeModal] = useState(false);
  const [nameChangeTitle, setNameChangeTitle] = useState('');
  const [customDocName, setCustomDocName] = useState('');
  const [customTempName, setCustomTempName] = useState('');
  const [customWrkfName, setCustomWrkfName] = useState('');
  const { permissionArray } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const [folders, setFolders] = useState([]);
  const [folderActionId, setFolderActionId] = useState('');
  const [isFetchingFolders, setIsFetchingFolders] = useState(false);

  const [showFoldersActionModal, setShowFoldersActionModal] = useState({
    state: false,
    action: '',
  });
  const [dowellReasearchTemplates, setDowellResearchTemplates] = useState([]);

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
      const res = await folderServices.getAllFolders(userCompanyId);
      setFolders(res.data ? res.data.reverse() : []);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetchingFolders(false);
    }
  };

  const extractCustomName = (str) =>
    str ? str.slice(str.indexOf('(') + 1, str.indexOf(')')) : str;

  // useEffect(() => {
  //   console.log('folders: ', folders);
  // }, [folders]);

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
          .getAllTeams(userCompanyId)
          .then((res) => {
            setWorkflowTeams(Array.isArray(res.data) ? res.data : []);
            setWorkflowTeamsLoaded(true);
          })
          .catch((err) => {
            console.log(
              'Failed to fetch teams: ',
              err.response ? err.response.data : err.message
            );
            setWorkflowTeamsLoaded(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail, isPublicUser, publicUserConfigured]);

  // ?useEffect(() => {
  //   new TemplateServices()
  //     .allTemplatesDRC('6385c0f38eca0fb652c9457e')
  //     .then((res) => {
  //       console.log('done fetching: ', res.data, res);
  //       setDowellResearchTemplates(res.data).catch((err) => {
  //         console.log('Failed to fetch Dowell Research Templates: ', err);
  //       });
  //     });
  // ?}, []);

  useEffect(() => {
    console.log('DRT: ', dowellReasearchTemplates);
  }, [dowellReasearchTemplates]);

  useEffect(() => {
    if (userDetail && userDetail.portfolio_info) {
      fetchFolders();
      fetchSettings();
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
