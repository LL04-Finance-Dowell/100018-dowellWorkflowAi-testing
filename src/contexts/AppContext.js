import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { WorkflowSettingServices } from '../services/workflowSettingServices';
import { useMediaQuery } from 'react-responsive';

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const isDesktop = useMediaQuery({
    query: '(min-width: 1050px)',
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
  const [workflowSettings, setWorkflowSettings] = useState();

  const { userDetail } = useSelector((state) => state.auth);
  const [rerender, setRerender] = useState('rand');
  const [processDisplayName, setProcessDisplayName] = useState('');
  const [openNameChangeModal, setOpenNameChangeModal] = useState(false);
  const [nameChangeTitle, setNameChangeTitle] = useState('');
  const [customDocName, setCustomDocName] = useState('');
  const [customTempName, setCustomTempName] = useState('');
  const [customWrkfName, setCustomWrkfName] = useState('');

  // const [createdNewTeam, setCreatedNewTeam] = useState();

  const addToFavoritesState = (category, value) => {
    const currentFavorites = { ...favoriteItems };

    currentFavorites[category] = [...currentFavorites[`${category}`], value];

    setFavoriteitems(currentFavorites);
  };
  // const handleDropdownChange = () => {
  //   console.log('language changed!');
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
    const res = await new WorkflowSettingServices().fetchWorkflowSettings(
      userDetail?.portfolio_info[0]?.org_id
    );

    setWorkflowSettings(res.data);
  };

  useEffect(() => {
    if (!publicUserConfigured) return;
    if (userDetail && userDetail.portfolio_info && !isPublicUser) {
      if (!workflowTeamsLoaded) {
        //* Fetching workflow teams
        const settingService = new WorkflowSettingServices();
        settingService
          .getAllTeams(userDetail?.portfolio_info[0]?.org_id)
          .then((res) => {
            setWorkflowTeams(res.data);
            setWorkflowTeamsLoaded(true);
            // console.log('teams fetched');
          })
          .catch((err) => {
            // console.log(
            //   'Failed to fetch teams: ',
            //   err.response ? err.response.data : err.message
            // );
            setWorkflowTeamsLoaded(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail, isPublicUser, publicUserConfigured]);

  useEffect(() => {
    if (userDetail && userDetail.portfolio_info) fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail]);

  // useEffect(() => {
  //   console.log('wrkf settings: ', workflowSettings);
  // }, [workflowSettings]);

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
        nonDesktopStyles,
        customDocName,
        customTempName,
        customWrkfName,
        setCustomDocName,
        setCustomTempName,
        setCustomWrkfName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
