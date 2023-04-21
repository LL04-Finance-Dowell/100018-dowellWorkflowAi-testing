import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { WorkflowSettingServices } from '../services/workflowSettingServices';

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
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
  const [workflowTeamsLoaded, setWorkflowTeamsLoaded] = useState(false);
  const [rerun, setRerun] = useState(false);
  const [sync, setSync] = useState(true);
  const [isPublicUser, setIsPublicUser] = useState(false);
  const [publicUserConfigured, setPublicUserConfigured] = useState(false);

  const [filter, setFilter] = useState('team_member');

  const { userDetail } = useSelector((state) => state.auth);

  // const [createdNewTeam, setCreatedNewTeam] = useState();

  const addToFavoritesState = (category, value) => {
    const currentFavorites = { ...favoriteItems };

    currentFavorites[category] = [...currentFavorites[`${category}`], value];

    setFavoriteitems(currentFavorites);
  };

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

  useEffect(() => {
    if (!publicUserConfigured) return
    if (userDetail && !isPublicUser) {
      if (!workflowTeamsLoaded) {
        //* Fetching workflow teams
        const settingService = new WorkflowSettingServices();
        settingService
          .getAllTeams(userDetail?.portfolio_info[0]?.org_id)
          .then((res) => {
            setWorkflowTeams(res.data);
            setWorkflowTeamsLoaded(true);
            console.log('teams fetched');
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
  }, [userDetail, isPublicUser, publicUserConfigured]);

  // useEffect(() => {
  //   console.log('context: ', workflowTeams);
  //   console.log('context: ', workflowTeamsLoaded);
  // }, [workflowTeams, workflowTeamsLoaded]);

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
        workflowTeamsLoaded,
        setWorkflowTeamsLoaded,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
