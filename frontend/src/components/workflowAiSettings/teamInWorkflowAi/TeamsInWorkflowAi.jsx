import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { productName, setIsSelected } from '../../../utils/helpers';
import InfoBox from '../../infoBox/InfoBox';

// import { teamsInWorkflowAI } from '../veriables';
import workflowAiSettingsStyles from '../workflowAiSettings.module.css';
import { v4 } from 'uuid';
import { WorkflowSettingServices } from '../../../services/workflowSettingServices';
import { toast } from 'react-toastify';
import { useAppContext } from '../../../contexts/AppContext';
import Spinner from '../../spinner/Spinner';
import { useTranslation } from 'react-i18next';
import { setPortfoliosInWorkflowAITeams, setTeamsInWorkflowAI, setUpdateInWorkflowAITeams } from '../../../features/processes/processesSlice';

// TODO FIX ADDITION OF NEW TEAM TO 'workflowTeams' 132.
const TeamsInWorkflowAi = () => {
  // *Populating of 'teamsInWorkflowAITeams' with fetched teams is done in 'infoBox.jsx'
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { register } = useForm();

  const workflowSettingServices = new WorkflowSettingServices();

  const { selectedPortfolioTypeForWorkflowSettings } =
    useSelector((state) => state.app);
    const { teamsInWorkflowAI } =
    useSelector((state) => state.processes);
  const { userDetail } = useSelector((state) => state.auth);
  const [userPortfolios] = useState(
    userDetail?.portfolio_info?.find((item) => item.product === 'Workflow AI' && item.member_type === 'owner')
      ? userDetail?.userportfolio.map((port) => ({
          _id: v4(),
          content: port.portfolio_name,
          isShow: false,
        }))
      : userDetail?.selected_product?.userportfolio.map((portfolio) => {
          return {
            _id: crypto.randomUUID(),
            content: portfolio.portfolio_name,
            isShow: true,
          };
        })
  );
  const [isValidCreateTeamData, setIsValidCreateTeamData] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isValidUpdateTeam, setIsValidUpdateTeam] = useState(false);
  const [isUpdatingTeam, setIsUpdatingTeam] = useState(false);
  const {
    workflowTeams,
    setWorkflowTeams,
    extractTeamContent,
    setSelectedTeamIdGlobal,
    rerun,
    setRerun,
    setSync,
    isFetchingTeams,
    isDesktop,
    nonDesktopStyles,
  } = useAppContext();
  const [handleChangeParams, setHandleChangeParams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const [unselectAllPortfolios, setUnselectAllPortfolios] = useState(false);
  const [updateData, setUpdateData] = useState({});

  const dispatchSelectedItems = ({ item, boxId, title, type }) => {
    const selectedItems = setIsSelected({
      items: teamsInWorkflowAI[0].children,
      item,
      boxId,
      title,
      type,
    });
    dispatch(setTeamsInWorkflowAI(selectedItems));
  };

  const handleOnChange = ({ item, title, boxId, type }, e) => {
    if (e.target.name === 'teams') {
      setSelectedTeamId(e.target.value);
      setSelectedTeamIdGlobal(e.target.value);
    }
    setHandleChangeParams([{ item, title, boxId, type }, e]);
  };

  const handleCreateNewTeam = async (e) => {
    let data = {};
    const selectedTeam = teamsInWorkflowAI[0].children[0].column[0].items.find(
      (item) => item.isSelected
    );
    const selectedPortfolios =
      teamsInWorkflowAI[0].children[1].column[0].items.filter(
        (item) => item.isSelected
      );

    if (isValidCreateTeamData) {
      const [team_name, team_code, team_spec, details, universal_code] =
        extractTeamContent(selectedTeam);

      const portfolio_list =
        userDetail?.portfolio_info?.find(
          (item) => item.product === 'Workflow AI' && item.member_type === 'owner'
        )
          ? userDetail.userportfolio.filter((port) => {
              return selectedPortfolios.find(
                (sPort) => sPort.content === port.portfolio_name
              );
            })
          : userDetail?.selected_product?.userportfolio.filter((port) => {
              return selectedPortfolios.find(
                (sPort) => sPort.content === port.portfolio_name
              );
            });

      if (!selectedPortfolioTypeForWorkflowSettings)
        return toast.info('Please select a portfolio type');

      data = {
        team_name,
        team_code,
        team_spec,
        universal_code,
        details,
        portfolio_list,
        company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail.portfolio_info[0].org_id,
        created_by: userDetail.userinfo.username,
        data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail.portfolio_info[0].data_type,
        team_type:
          selectedPortfolioTypeForWorkflowSettings === 'team_member'
            ? 'team'
            : selectedPortfolioTypeForWorkflowSettings,
      };
      try {
        setIsCreatingTeam(true);
        await workflowSettingServices.createWorkflowTeam(data);
        toast.success('Team created');
        setIsCreatingTeam(false);
        setWorkflowTeams((prevTeams) => {
          return [
            ...prevTeams,
            { ...data, _id: crypto.randomUUID(), newly_created: true },
          ];
        });
      } catch (err) {
        // console.log(err);
        toast.error('Team not created');
        setIsCreatingTeam(false);
      }
    }
  };

  const selectPortfolios = () => {
    workflowTeams.forEach((team) => {
      if (selectedTeamId === team._id) {
        const portfolioItems =
          teamsInWorkflowAI[0].children[1].column[0].items.map((item) => {
            if (
              team.portfolio_list.find(
                (port) => port.portfolio_name === item.content
              )
            )
              return item;
            return null;
          });

        portfolioItems.forEach((pItem) => {
          dispatch(
            setPortfoliosInWorkflowAITeams({
              type: 'single',
              payload: portfolioItems.filter((item) => item),
            })
          );
        });
      }
    });
  };

  // * This confirms if there was any change to team info or portfolios
  const checkForChanges = (
    portfolio_list,
    team_name,
    team_code,
    team_spec,
    universal_code,
    details
  ) => {
    let teamDetailsChanged = false;
    let portfoliosChanged = false;
    const initialTeam = workflowTeams.find(
      (team) => team._id === selectedTeamId
    );

    if (
      initialTeam.team_name !== team_name ||
      initialTeam.team_code !== team_code ||
      initialTeam.team_spec !== team_spec ||
      initialTeam.universal_code !== universal_code ||
      initialTeam.details !== details
    )
      teamDetailsChanged = true;

    if (initialTeam.portfolio_list.length !== portfolio_list.length)
      portfoliosChanged = true;
    else {
      for (let i = 0; i < portfolio_list.length; i++) {
        if (
          portfolio_list[i].portfolio_name !==
          initialTeam.portfolio_list[i].portfolio_name
        ) {
          portfoliosChanged = true;
          break;
        }
      }
    }

    setUpdateData({
      team_id: selectedTeamId,
      team_name,
      team_code,
      team_spec,
      universal_code,
      details,
      portfolio_list,
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail.portfolio_info[0].org_id,
      created_by: userDetail.userinfo.username,
      data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail.portfolio_info[0].data_type,
      team_type:
        selectedPortfolioTypeForWorkflowSettings === 'team_member'
          ? 'team'
          : selectedPortfolioTypeForWorkflowSettings,
    });

    setIsValidUpdateTeam(
      portfoliosChanged || teamDetailsChanged ? true : false
    );
  };

  const handleUpdateTeam = (teamInfo) => {
    const selectedPortfolios =
      teamsInWorkflowAI[0].children[1].column[0].items.filter(
        (item) => item.isSelected
      );
    const {
      name: team_name,
      code: team_code,
      spec: team_spec,
      universalCode: universal_code,
      details,
    } = teamInfo;

    const portfolio_list =
      userDetail?.portfolio_info?.find((item) => item.product === 'Workflow AI' && item.member_type === 'owner')
        ? userDetail.userportfolio.filter((port) => {
            return selectedPortfolios.find(
              (sPort) => sPort.content === port.portfolio_name
            );
          })
        : userDetail?.selected_product?.userportfolio.filter((port) => {
            return selectedPortfolios.find(
              (sPort) => sPort.content === port.portfolio_name
            );
          });

    const initialItem = teamsInWorkflowAI[0].children[0].column[0].items
      .map((item, ind) => (item.isSelected ? { item, ind } : ''))
      .find((item) => item);

    const item = {
      ...initialItem.item,
      content: `Team ${
        initialItem.ind + 1
      } (${team_name}, ${team_code}, ${team_spec}, ${details}, ${universal_code})`,
    };

    dispatch(setUpdateInWorkflowAITeams({ item, extractTeamContent }));
    checkForChanges(
      portfolio_list,
      team_name,
      team_code,
      team_spec,
      universal_code,
      details
    );
  };

  const handleUpdateTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingTeam(true);
      await workflowSettingServices.updateWorkflowTeam(updateData);
      toast.success('Team updated');
      updateWorkflowTeam(true, updateData);
      setIsUpdatingTeam(false);
      setIsValidUpdateTeam(false);
    } catch (error) {
      setIsUpdatingTeam(false);
      toast.error('Updating failed!');
      // console.log(error);
    }
  };

  // *This updates teams in workflowTeams
  const updateWorkflowTeam = (replace, teamData) => {
    if (replace) {
      const clone = [...workflowTeams];
      const _id = teamData.team_id;
      delete teamData.team_id;
      for (let i = 0; i < clone.length; i++) {
        if (_id === clone[i]._id) clone.splice(i, 1, { ...teamData, _id });
      }
      setWorkflowTeams(clone);
    }
    // else {
    //   const clone = [...workflowTeams];
    // }
  };

  // *Populate teamsInWorkflowAIPortfolios
  useEffect(() => {
    dispatch(
      setPortfoliosInWorkflowAITeams({
        type: 'normal',
        payload: userPortfolios,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPortfolios]);

  useEffect(() => {
    const selectedTeam = teamsInWorkflowAI[0].children[0].column[0].items.find(
      (item) => item.isSelected
    );
    const selectedPortfolios =
      teamsInWorkflowAI[0].children[1].column[0].items.filter(
        (item) => item.isSelected
      );

    if (
      selectedTeam &&
      selectedPortfolios.length &&
      !workflowTeams.find((team) => team._id === selectedTeam._id)
    )
      setIsValidCreateTeamData(true);
    else setIsValidCreateTeamData(false);
  }, [teamsInWorkflowAI, workflowTeams]);

  useEffect(() => {
    if (handleChangeParams.length) {
      const [{ item, title, boxId, type }, e] = handleChangeParams;

      if (e.target.name === 'teams') {
        // * Actions for when teams' options are clicked
        //* If selected team is in fetched teams, only select; else, select team and unselect all portfolio options
        if (workflowTeams.find((team) => team._id === selectedTeamId)) {
          setUnselectAllPortfolios(false);
          dispatchSelectedItems({ item, title, boxId, type });
          dispatch(setUpdateInWorkflowAITeams({ item, extractTeamContent }));
          setSync(true);
        } else {
          dispatchSelectedItems({ item, title, boxId, type });
          setUnselectAllPortfolios(true);
          dispatch(setUpdateInWorkflowAITeams());
        }
      } else if (
        e.target.name === 'portfolios' &&
        !workflowTeams.find((team) => team._id === selectedTeamId)
      ) {
        // * Actions for when portfolio options are clicked
        //  * If selected team is not in fetched teams, enable check option for portfolio
        dispatchSelectedItems({ item, title, boxId, type });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeamId, handleChangeParams, workflowTeams]);

  useEffect(() => {
    if (selectedTeamId) {
      selectPortfolios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeamId]);

  // *This returns portfolios to what it was if editting is canceled
  useEffect(() => {
    if (rerun) {
      selectPortfolios();
      setRerun(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerun]);

  // *This unselects all portfolios after selecting the new team radio option
  useEffect(() => {
    if (unselectAllPortfolios) {
      dispatchSelectedItems({
        item: null,
        title: '',
        boxId: teamsInWorkflowAI[0].children[1]._id,
        type: 'unselect_all',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unselectAllPortfolios]);

  // useEffect(() => {
  // }, [teamsInWorkflowAI, workflowTeams]);

  return (
    <div className={workflowAiSettingsStyles.box}>
      {isFetchingTeams ? (
        <div
          className='loading_sect'
          style={{
            position: 'fixed',
            width: '100%',
            height: '100vh',
            backgroundColor: '#26363294',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
            left: 0,
            zIndex: '10',
          }}
        >
          <Spinner />
        </div>
      ) : (
        ''
      )}
      <h2
        className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
      >
        {t(teamsInWorkflowAI[0].title)}
      </h2>
      <div
        className={workflowAiSettingsStyles.section__container}
        style={!isDesktop ? nonDesktopStyles : {}}
      >
        <form style={{ width: '100%' }}>
          <div className={workflowAiSettingsStyles.section__box}>
            {teamsInWorkflowAI[0].children[0].column.map((colItem, ind) => (
              <InfoBox
                boxId={teamsInWorkflowAI[0].children[0]._id}
                register={register}
                items={colItem.items}
                title={colItem.proccess_title}
                onChange={handleOnChange}
                showSearch={colItem.items.length ? true : false}
                showAddButton={true}
                type='radio'
                key={ind}
              />
            ))}
          </div>
          <button
            className={workflowAiSettingsStyles.submit__button}
            onClick={handleCreateNewTeam}
            type='button'
            disabled={!isValidCreateTeamData}
            style={
              !isValidCreateTeamData || isCreatingTeam
                ? { filter: 'grayscale(0.5)', cursor: 'not-allowed' }
                : {}
            }
          >
            {!isCreatingTeam ? t('create new team') : t('creating...')}
          </button>
        </form>
        <div className={workflowAiSettingsStyles.section__box}>
          {teamsInWorkflowAI[0].children[1].column.map((colItem, ind) => (
            <InfoBox
              boxId={teamsInWorkflowAI[0].children[1]._id}
              register={register}
              items={colItem.items}
              title={colItem.proccess_title}
              onChange={handleOnChange}
              showSearch={colItem.items.length ? true : false}
              isTeams={
                teamsInWorkflowAI[0].children[0].column[0].items.length &&
                teamsInWorkflowAI[0].children[0].column[0].items.find(
                  (item) => item.isSelected
                )
                  ? true
                  : false
              }
              type='checkbox'
              key={ind}
            />
          ))}
        </div>
        <form>
          <div className={workflowAiSettingsStyles.section__box}>
            {teamsInWorkflowAI[0].children[2].column.map((colItem, ind) => (
              <InfoBox
                boxId={teamsInWorkflowAI[0].children[2]._id}
                register={register}
                items={colItem.items}
                title={colItem.proccess_title}
                onChange={handleOnChange}
                key={ind}
                type='list'
                showSearch={false}
                showEditButton={colItem.items.length ? true : false}
                handleUpdateTeam={handleUpdateTeam}
              />
            ))}
          </div>
          <button
            className={workflowAiSettingsStyles.submit__button}
            onClick={handleUpdateTeamSubmit}
            disabled={!isValidUpdateTeam}
            style={
              !isValidUpdateTeam || isUpdatingTeam
                ? { filter: 'grayscale(0.5)', cursor: 'not-allowed' }
                : {}
            }
          >
            {!isUpdatingTeam ? t('Update team details') : t('Updating...')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamsInWorkflowAi;
