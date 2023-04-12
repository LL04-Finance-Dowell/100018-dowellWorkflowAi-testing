import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTeamsInWorkflowAI,
  setPortfoliosInWorkflowAITeams,
} from '../../../features/app/appSlice';
import { setIsSelected } from '../../../utils/helpers';
import InfoBox from '../../infoBox/InfoBox';
import SubmitButton from '../../submitButton/SubmitButton';
// import { teamsInWorkflowAI } from '../veriables';
import workflowAiSettingsStyles from '../workflowAiSettings.module.css';
import { v4 } from 'uuid';
import { WorkflowSettingServices } from '../../../services/workflowSettingServices';
import { toast } from 'react-toastify';
import { useAppContext } from '../../../contexts/AppContext';

const TeamsInWorkflowAi = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const workflowSettingServices = new WorkflowSettingServices();

  const { teamsInWorkflowAI, selectedPortfolioTypeForWorkflowSettings } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);
  const [userPortfolios, setUserPortfolios] = useState(
    userDetail?.portfolio_info?.find((item) => item.product === 'Workflow AI')
      ?.member_type === 'owner'
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
  const { workflowTeams, setWorkflowTeams } = useAppContext();
  const [handleChangeParams, setHandleChangeParams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [items, setItems] = useState([]);

  const dispatchSelectedItems = ({ item, boxId, title, type }) => {
    console.log(teamsInWorkflowAI[0].children);
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
    if (e.target.name === 'teams') setSelectedTeamId(e.target.value);
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
        selectedTeam.content
          .slice(0, selectedTeam.content.length - 1)
          .split('(')
          .slice(1)
          .join('')
          .split(', ');

      const portfolio_list =
        userDetail?.portfolio_info?.find(
          (item) => item.product === 'Workflow AI'
        )?.member_type === 'owner'
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

      if (!selectedPortfolioTypeForWorkflowSettings) return toast.info('Please select a portfolio type');
      
      data = {
        team_name,
        team_code,
        team_spec,
        universal_code,
        details,
        portfolio_list,
        company_id: userDetail.portfolio_info[0].org_id,
        created_by: userDetail.userinfo.username,
        data_type: userDetail.portfolio_info[0].data_type,
        team_type: selectedPortfolioTypeForWorkflowSettings === 'team_member' ? 'team' : selectedPortfolioTypeForWorkflowSettings
      };
      try {
        setIsCreatingTeam(true);
        const res = await workflowSettingServices.createWorkflowTeam(data);
        toast.success('Team created');
        setIsCreatingTeam(false);
        setWorkflowTeams((prevTeams) => { return [ ...prevTeams, {...data, _id: crypto.randomUUID() }] })
      } catch (err) {
        console.log(err);
        toast.error('Team not created');
        setIsCreatingTeam(false);
      }
    }
  };

  // *Populate teamsInWorkflowAIPortfolios
  useEffect(() => {
    dispatch(
      setPortfoliosInWorkflowAITeams({
        type: 'normal',
        payload: userPortfolios,
      })
    );
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
  }, [teamsInWorkflowAI]);

  useEffect(() => {
    if (handleChangeParams.length) {
      const [{ item, title, boxId, type }, e] = handleChangeParams;

      if (e.target.name === 'teams') {
        dispatchSelectedItems({ item, title, boxId, type });
      } else if (
        e.target.name === 'portfolios' &&
        !workflowTeams.find((team) => team._id === selectedTeamId)
      ) {
        dispatchSelectedItems({ item, title, boxId, type });
      }
      // console.log(selectedTeamId);
      // console.log(workflowTeams);
      // console.log(handleChangeParams);
    }
  }, [selectedTeamId, handleChangeParams, workflowTeams]);

  useEffect(() => {
    if (selectedTeamId) {
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
    }
  }, [selectedTeamId]);

  // useEffect(() => {
  //   // console.log('teamin: ', teamsInWorkflowAI);
  // }, [teamsInWorkflowAI]);

  return (
    <div className={workflowAiSettingsStyles.box}>
      <h2
        className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
      >
        {teamsInWorkflowAI[0].title}
      </h2>
      <div className={workflowAiSettingsStyles.section__container}>
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
            {!isCreatingTeam ? 'create new team' : 'creating...'}
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
              />
            ))}
          </div>
          <SubmitButton className={workflowAiSettingsStyles.submit__button}>
            Update team details
          </SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default TeamsInWorkflowAi;
