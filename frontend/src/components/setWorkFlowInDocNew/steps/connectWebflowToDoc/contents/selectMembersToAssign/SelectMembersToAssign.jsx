import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Radio from "../../../../radio/Radio";
import AssignTask from "./assignTask/AssignTask";
import styles from "./selectMembersToAssign.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromPublicMembersSelectedForProcess, removeFromTeamMembersSelectedForProcess, removeFromTeamsSelectedSelectedForProcess, removeFromUserMembersSelectedForProcess, setPublicMembersSelectedForProcess, setTeamMembersSelectedForProcess, setTeamsSelectedSelectedForProcess, setUserMembersSelectedForProcess } from "../../../../../../features/app/appSlice";
import { Tooltip } from "react-tooltip";
import useClickInside from "../../../../../../hooks/useClickInside";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../../../contexts/AppContext";

const SelectMembersToAssign = ({ currentStepIndex, stepsPopulated, currentEnabledSteps }) => {
  const [selectMembersComp, setSelectMembersComp] = useState(selectMembers);
  const [current, setCurrent] = useState(selectMembers[0]);
  const { register, watch } = useForm();
  const teamMembersRef = useRef(null);
  const selectMembersRef = useRef(null);
  const [ currentRadioOptionSelection, setCurrentRadioOptionSelection ] = useState(null);
  const { 
    selectedMembersForProcess, 
    teamsSelectedSelectedForProcess, 
    teamMembersSelectedForProcess, 
    userMembersSelectedForProcess, 
    publicMembersSelectedForProcess,
    processSteps,
    docCurrentWorkflow,
  } = useSelector((state) => state.app);
  const [ selectedMembersSet, setSelectedMembersSet ] = useState(false);
  const [ userTypeOptionsEnabled, setUserTypeOptionsEnabled ] = useState([]);
  const [ currentGroupSelectionItem, setCurrentGroupSelectionItem ] = useState(null);
  const [ enableRadioOptionsFromStepPopulation, setEnableOptionsFromStepPopulation ] = useState({
    Team: [],
    Users: [],
    Public: [],
  });
  const [ featuresUpdatedFromDraft, setFeaturesUpdatedFromDraft ] = useState(false);
  const [ radioOptionsEnabledInStep, setRadioOptionsEnabledInStep ] = useState([]);
  const { workflowTeams } = useAppContext();
  const selectTeamRef = useRef();
  
  const dispatch = useDispatch();

  const handleSetCurrent = (item) => {
    setCurrent(item);
  };

  useClickInside(teamMembersRef, () => {
    if (!currentRadioOptionSelection) return toast.info("Please check either option above")
    console.log("enabled team options")
  })

  useClickInside(selectMembersRef, () => {
    if (!currentRadioOptionSelection) return toast.info("Please check the option above")
    console.log("enabled select member options")
  })

  useEffect(() => {

    if (selectedMembersSet) return

    const copyOfCurrentSelectMembersState = selectMembers.slice();

    const extractAndFormatPortfoliosForMembers = (criteria) => {
      const membersmatchingCriteria = selectedMembersForProcess.filter(member => member.member_type === criteria && member.status === "enable");
      const memberPortfolios = membersmatchingCriteria.map(member => {
        if (Array.isArray(member.username)) {
          let membersFound = member.username.forEach(user => {
            return {
              id: uuidv4(),
              content: `${user} - (${member.portfolio_name})`,
              member: user,
              portfolio: member.portfolio_name,
            }
          })
          if (!membersFound) return null
          return Object.assign({}, ...membersFound)
        }
        return {
          id: uuidv4(),
          content: `${member.username} - (${member.portfolio_name})`,
          member: member.username,
          portfolio: member.portfolio_name
        }
      }).filter(member => member)

      return memberPortfolios;
    }

    const updatedMembersState = copyOfCurrentSelectMembersState.map(member => {
      if (member.header === "Team") {
        member.portfolios = extractAndFormatPortfoliosForMembers("team_member")
        member.teams = workflowTeams.filter(team => team.team_type === 'team')
        return member
      }
      if (member.header === "Users") {
        member.portfolios = extractAndFormatPortfoliosForMembers("to-be-decided")
        member.teams = workflowTeams.filter(team => team.team_type === 'to-be-decided')
        return member
      }

      member.portfolios = extractAndFormatPortfoliosForMembers("public")
      member.teams = workflowTeams.filter(team => team.team_type === 'public')
      return member
    });

    setSelectMembersComp(updatedMembersState);
    setSelectedMembersSet(true);

  }, [selectedMembersForProcess])

  useEffect(() => {
    
    if (!currentRadioOptionSelection) return

    selectTeamRef.current.value = '';

    if (currentRadioOptionSelection === "selectTeam") {
      if (currentGroupSelectionItem) currentGroupSelectionItem?.teams.forEach(team => updateTeamAndPortfoliosInTeamForProcess('remove', team, currentGroupSelectionItem.header))
      return
    }

    currentGroupSelectionItem?.teams.forEach(team => updateTeamAndPortfoliosInTeamForProcess('remove', team, currentGroupSelectionItem.header))

    if (currentGroupSelectionItem?.allSelected) {
      currentGroupSelectionItem?.teams.forEach(team => updateTeamAndPortfoliosInTeamForProcess('add', team, currentGroupSelectionItem.header))
      return
    }

  }, [currentRadioOptionSelection, currentGroupSelectionItem])

  useEffect(() => {
    if (!stepsPopulated || featuresUpdatedFromDraft) return

    const stepDetails = processSteps.find(
      process => process.workflow === docCurrentWorkflow?._id
    )?.steps[currentStepIndex]

    const [currentSelectedOptions, currentEnabledRadioOptionsFromStepPopulation ] = [ userTypeOptionsEnabled.slice(), { ...enableRadioOptionsFromStepPopulation } ];

    if (stepDetails?.stepTeamMembers?.length > 0) {
      if (currentSelectedOptions.find(item => item.name === 'Team' && item.stepIndex === currentStepIndex)) return

      const newUserOptionToAdd = {
        name: 'Team',
        stepIndex: currentStepIndex,
      }
      
      const newStepPopulateOptionToAdd = {
        memberOptionEnabled: true,
        stepIndex: currentStepIndex,
      }

      currentSelectedOptions.push(newUserOptionToAdd);
      setUserTypeOptionsEnabled(currentSelectedOptions);
      
      currentEnabledRadioOptionsFromStepPopulation.Team.push(newStepPopulateOptionToAdd);
      setEnableOptionsFromStepPopulation(currentEnabledRadioOptionsFromStepPopulation);
    }

    if (stepDetails?.stepPublicMembers?.length > 0) {
      if (currentSelectedOptions.find(item => item.name === 'Public' && item.stepIndex === currentStepIndex)) return

      const newUserOptionToAdd = {
        name: 'Public',
        stepIndex: currentStepIndex,
      }

      const newStepPopulateOptionToAdd = {
        memberOptionEnabled: true,
        stepIndex: currentStepIndex,
      }
  
      currentSelectedOptions.push(newUserOptionToAdd);
      setUserTypeOptionsEnabled(currentSelectedOptions);

      currentEnabledRadioOptionsFromStepPopulation.Public.push(newStepPopulateOptionToAdd);
      setEnableOptionsFromStepPopulation(currentEnabledRadioOptionsFromStepPopulation);
    }

    if (stepDetails?.stepUserMembers?.length > 0) {
      if (currentSelectedOptions.find(item => item.name === 'Users' && item.stepIndex === currentStepIndex)) return

      const newUserOptionToAdd = {
        name: 'Users',
        stepIndex: currentStepIndex,
      }

      const newStepPopulateOptionToAdd = {
        memberOptionEnabled: true,
        stepIndex: currentStepIndex,
      }
  
      currentSelectedOptions.push(newUserOptionToAdd);
      setUserTypeOptionsEnabled(currentSelectedOptions);
      
      currentEnabledRadioOptionsFromStepPopulation.User.push(newStepPopulateOptionToAdd);
      setEnableOptionsFromStepPopulation(currentEnabledRadioOptionsFromStepPopulation);
    }

    if (stepDetails?.stepPublicMembers || stepDetails?.stepTeamMembers || stepDetails?.stepUserMembers) setFeaturesUpdatedFromDraft(true);

  }, [stepsPopulated, processSteps])

  const handleSelectTeam = (parsedSelectedJsonValue) => {
    console.log("Current team selected: ", parsedSelectedJsonValue);
    console.log("Current header: ", current.header);

    const teamAddedToProcess = teamsSelectedSelectedForProcess.find(team => team._id === parsedSelectedJsonValue._id && team.stepIndex === currentStepIndex && team.selectedFor === current.header);

    if (teamAddedToProcess) return updateTeamAndPortfoliosInTeamForProcess('remove', parsedSelectedJsonValue, current.header)
    
    updateTeamAndPortfoliosInTeamForProcess('add', parsedSelectedJsonValue, current.header);
  }

  const handleAddNewMember = (e) => {
    if (!current || !current.header) return

    const parsedSelectedJsonValue = JSON.parse(e.target.value);
    
    switch (current.header) {
      case "Team":
        const teamUserAlreadyAdded = teamMembersSelectedForProcess.find(user => user.member === parsedSelectedJsonValue.member && user.portfolio === parsedSelectedJsonValue.portfolio && user.stepIndex === currentStepIndex);
        if (teamUserAlreadyAdded) {
          dispatch(removeFromTeamMembersSelectedForProcess({ member: teamUserAlreadyAdded.member, portfolio: teamUserAlreadyAdded.portfolio, stepIndex: teamUserAlreadyAdded.stepIndex }))
          return
        }
        dispatch(setTeamMembersSelectedForProcess({ member: parsedSelectedJsonValue.member, portfolio: parsedSelectedJsonValue.portfolio, stepIndex: currentStepIndex }))
        return
      case "Users":
        const userAlreadyAdded = userMembersSelectedForProcess.find(user => user.member === parsedSelectedJsonValue.member && user.portfolio === parsedSelectedJsonValue.portfolio && user.stepIndex === currentStepIndex);
        if (userAlreadyAdded) {
          dispatch(removeFromUserMembersSelectedForProcess({ member: userAlreadyAdded.member, portfolio: userAlreadyAdded.portfolio, stepIndex: userAlreadyAdded.stepIndex }))
          return
        }
        dispatch(setUserMembersSelectedForProcess({ member: parsedSelectedJsonValue.member, portfolio: parsedSelectedJsonValue.portfolio, stepIndex: currentStepIndex }))
        return
      case "Public":
        const publicUserAlreadyAdded = userMembersSelectedForProcess.find(user => user.member === parsedSelectedJsonValue.member && user.portfolio === parsedSelectedJsonValue.portfolio && user.stepIndex === currentStepIndex);
        if (publicUserAlreadyAdded) {
          dispatch(removeFromPublicMembersSelectedForProcess({ member: publicUserAlreadyAdded.member, portfolio: publicUserAlreadyAdded.portfolio, stepIndex: publicUserAlreadyAdded.stepIndex }))
          return
        }
        dispatch(setPublicMembersSelectedForProcess({ member: parsedSelectedJsonValue.member, portfolio: parsedSelectedJsonValue.portfolio, stepIndex: currentStepIndex }))
        return
      default:
        console.log("Current header item not available")
    }
  }

  const handleUserGroupSelection = (newRadioSelection, newGroupValue, currentHeader, name, radioValue) => {
    console.log('updating')
    setCurrentGroupSelectionItem(newGroupValue);
    setCurrentRadioOptionSelection(newRadioSelection);

    const currentEnabledRadioOptionsFromStepPopulation = { ...enableRadioOptionsFromStepPopulation };
    currentEnabledRadioOptionsFromStepPopulation[currentHeader] = currentEnabledRadioOptionsFromStepPopulation[currentHeader].filter(item => item.name !== currentHeader && item.stepIndex !== currentStepIndex);

    setEnableOptionsFromStepPopulation(currentEnabledRadioOptionsFromStepPopulation);
    updateRadioOptionsEnabledForStep(currentHeader, name, radioValue);
  }

  
  const handleMemberRadioChange = (value, currentHeader, name) => {
    setCurrentRadioOptionSelection(value);

    const currentEnabledRadioOptionsFromStepPopulation = { ...enableRadioOptionsFromStepPopulation };
    currentEnabledRadioOptionsFromStepPopulation[currentHeader] = currentEnabledRadioOptionsFromStepPopulation[currentHeader].filter(item => item.name !== currentHeader && item.stepIndex !== currentStepIndex);

    setEnableOptionsFromStepPopulation(currentEnabledRadioOptionsFromStepPopulation);
    updateRadioOptionsEnabledForStep(currentHeader, name, value);
  }

  const handleSelectUserOptionType = (e) => {
    const { value, checked } = e.target;
    const currentSelectedOptions = userTypeOptionsEnabled.slice();

    if (!checked) {
      const updatedSelectedOptions = currentSelectedOptions.filter(option => {
        if (option.name === value && option.stepIndex === currentStepIndex) return null
        return option
      });
      return setUserTypeOptionsEnabled(updatedSelectedOptions.filter(option => option))
    }

    const newUserOptionToAdd = {
      name: value,
      stepIndex: currentStepIndex,
    }

    currentSelectedOptions.push(newUserOptionToAdd);
    setUserTypeOptionsEnabled(currentSelectedOptions)
  }

  const handleDisabledUserOptionSelection = (e, titleOfUserOption) => {
    e.target.checked = false;
    toast.info(`Please select the checkbox titled '${titleOfUserOption}' above first.`)
  }

  const updateRadioOptionsEnabledForStep = (currentActiveHeader, radioOptionName, radioOptionValueSelected) => {
    const currentRadioOptionsEnabled = radioOptionsEnabledInStep.slice();
    const foundRadioOptionIndex = currentRadioOptionsEnabled.findIndex(
      option => option.stepIndex === currentStepIndex && 
      option.currentHeader === currentActiveHeader && 
      option.name === radioOptionName
    );
    
    if (foundRadioOptionIndex !== -1) {
      currentRadioOptionsEnabled[foundRadioOptionIndex].valueActive = radioOptionValueSelected;
      setRadioOptionsEnabledInStep(currentRadioOptionsEnabled);
      return
    }

    const newRadioOptionEnabled = {
      stepIndex: currentStepIndex,
      currentHeader: currentActiveHeader,
      name: radioOptionName,
      valueActive: radioOptionValueSelected,
    }
    currentRadioOptionsEnabled.push(newRadioOptionEnabled);
    setRadioOptionsEnabledInStep(currentRadioOptionsEnabled);
  }

  const updateTeamAndPortfoliosInTeamForProcess = (actionType, team, currentUserHeader) => {
    if (actionType === 'add') {
      dispatch(setTeamsSelectedSelectedForProcess({ ...team, stepIndex: currentStepIndex, selectedFor: currentUserHeader }));
      team?.portfolio_list.forEach(portfolio => {
        if (currentUserHeader === "Team") dispatch(setTeamMembersSelectedForProcess({ member: portfolio.username, portfolio: portfolio.portfolio_name, stepIndex: currentStepIndex }))
        if (currentUserHeader === "Users") dispatch(setUserMembersSelectedForProcess({ member: portfolio.username, portfolio: portfolio.portfolio_name, stepIndex: currentStepIndex }))
        if (currentUserHeader === "Public") dispatch(setPublicMembersSelectedForProcess({ member: portfolio.username, portfolio: portfolio.portfolio_name, stepIndex: currentStepIndex }))
      })
    }

    if (actionType === 'remove') {
      dispatch(removeFromTeamsSelectedSelectedForProcess({ _id: team._id, stepIndex: currentStepIndex, selectedFor: currentUserHeader }));
      team?.portfolio_list.forEach(portfolio => {
        if (currentUserHeader === "Team") dispatch(removeFromTeamMembersSelectedForProcess({ member: portfolio.username, portfolio: portfolio.portfolio_name, stepIndex: currentStepIndex }))
        if (currentUserHeader === "Users") dispatch(removeFromUserMembersSelectedForProcess({ member: portfolio.username, portfolio: portfolio.portfolio_name, stepIndex: currentStepIndex }))
        if (currentUserHeader === "Public") dispatch(removeFromPublicMembersSelectedForProcess({ member: portfolio.username, portfolio: portfolio.portfolio_name, stepIndex: currentStepIndex }))  
      })
    }
  }

  return (
    <div className={styles.container}>
      {
        processSteps.find(
          process => process.workflow === docCurrentWorkflow?._id
        )?.steps[currentStepIndex]?.skipStep ? <>
          <div className={styles.select__header__box}>
            {React.Children.toArray(selectMembersComp.map((item) => (
              <div
                onClick={() => toast.info('Step skipped')}
                // key={item.id}
                className={`${styles.select__header} ${
                  current.id === item.id && styles.selected
                }`}
              >
                {item.header}
              </div>
            )))}
          </div>
          <p>Step skipped</p> 
        </> :
        <>
          <div className={styles.select__container}>
            <div className={styles.select__header__box}>
              {React.Children.toArray(selectMembersComp.map((item) => (
                <div
                  onClick={() => handleSetCurrent(item)}
                  // key={item.id}
                  className={`${styles.select__header} ${
                    current.id === item.id && styles.selected
                  }`}
                >
                  {item.header}
                </div>
              )))}
            </div>
            <div className={styles.select__content__container}>
              <h3 className={styles.title}>
                <input
                  type={"checkbox"} 
                  name={current.header} 
                  style={{ marginRight: "0.5rem" }}
                  value={current.header}
                  checked={userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) ? true : false}
                  onChange={handleSelectUserOptionType}
                />
                {current.title}
              </h3>
              <div>
                <Radio
                  register={register}
                  name={"selectItemOptionForUser-" + currentStepIndex + "-" + current.header}
                  value={"all" + current.header}
                  checked={
                    userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) && 
                    currentRadioOptionSelection && 
                    radioOptionsEnabledInStep.find(
                      option => option.stepIndex === currentStepIndex && 
                      option.currentHeader === current.header && 
                      option.name === "selectItemOptionForUser-" + currentStepIndex + "-" + current.header
                    )?.valueActive === "all" + current.header ? 
                    true : false
                  }
                  onChange={
                    userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) ? 
                    () => handleUserGroupSelection(
                      current.all + " first", 
                      {...current, allSelected: true}, 
                      current.header, 
                      "selectItemOptionForUser-" + currentStepIndex + "-" + current.header, 
                      "all" + current.header
                    ) : 
                    (e) => handleDisabledUserOptionSelection(e, current.title)
                  }
                >
                  Select all {current.header}
                </Radio>
                <Radio
                  register={register}
                  name={"selectItemOptionForUser-" + currentStepIndex + "-" + current.header}
                  value={"selectIn" + current.header}
                  checked={
                    userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) && 
                    currentRadioOptionSelection && 
                    radioOptionsEnabledInStep.find(
                      option => option.stepIndex === currentStepIndex && 
                      option.currentHeader === current.header && 
                      option.name === "selectItemOptionForUser-" + currentStepIndex + "-" + current.header
                    )?.valueActive === "selectIn" + current.header ? 
                    true : false
                  }
                  onChange={
                    userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) ? 
                    () => handleUserGroupSelection(
                      current.all + " second", 
                      current, 
                      current.header, 
                      "selectItemOptionForUser-" + currentStepIndex + "-" + current.header, 
                      "selectIn" + current.header
                    ) : 
                    (e) => handleDisabledUserOptionSelection(e, current.title)
                  }
                >
                  {current.selectInTeam}
                </Radio>
              </div>
              <div ref={teamMembersRef} className={styles.team__Select__Wrapper}>
                <select
                  required
                  {...register("teams")}
                  size={current.teams.length === 1 ? current.teams.length + 1 : current.teams.length}
                  className={styles.open__select}
                  onChange={({ target }) => handleSelectTeam(JSON.parse(target.value))}
                  style={{ 
                    pointerEvents: 
                      userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) && 
                      currentRadioOptionSelection && 
                      radioOptionsEnabledInStep.find(
                        option => option.stepIndex === currentStepIndex && 
                        option.currentHeader === current.header && 
                        option.name === "selectItemOptionForUser-" + currentStepIndex + "-" + current.header
                      )?.valueActive === "selectIn" + current.header ? 
                    "all" : 
                      userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) && 
                      currentRadioOptionSelection && 
                      radioOptionsEnabledInStep.find(
                        option => option.stepIndex === currentStepIndex && 
                        option.currentHeader === current.header && 
                        option.name === "selectItemOptionForUser-" + currentStepIndex + "-" + current.header
                      )?.valueActive === "all" + current.header ?
                    "all" :
                    "none" 
                  }}
                  name="select-from-team"
                  ref={selectTeamRef}
                >
                  <option value={''} disabled hidden selected></option>
                  {React.Children.toArray(current.teams.map((item) => (
                    <option 
                      // key={item.id} 
                      value={JSON.stringify(item)}
                      className={teamsSelectedSelectedForProcess.find(team => team._id === item._id && team.stepIndex === currentStepIndex && team.selectedFor === current.header) ? styles.team__Selected : styles.team__Not__Selected}
                    >
                      {item.team_name}
                    </option>
                  )))}
                </select>
              </div>
              {
                <>
                  <Radio
                  register={register}
                  name={"selectItemOptionForUser-" + currentStepIndex + "-" + current.header}
                  value={"select" + current.header}
                  checked={
                    userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) && 
                    currentRadioOptionSelection && 
                    radioOptionsEnabledInStep.find(
                      option => option.stepIndex === currentStepIndex && 
                      option.currentHeader === current.header && 
                      option.name === "selectItemOptionForUser-" + currentStepIndex + "-" + current.header
                    )?.valueActive === "select" + current.header ?  
                    true : 
                    enableRadioOptionsFromStepPopulation[`${current.header}`].find(option => option.memberOptionEnabled && option.stepIndex === currentStepIndex) ? 
                    true : false
                  }
                  onChange={
                    userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) ? 
                    ({ target }) => handleMemberRadioChange(
                      target.value, 
                      current.header, 
                      target.name
                    ) : 
                    (e) => handleDisabledUserOptionSelection(e, current.title)
                  }
                  >
                    Select Members
                  </Radio>
                  <div className={styles.select__Members__Wrapper} ref={selectMembersRef}>
                    <select
                      required
                      {...register("members")}
                      size={current.portfolios.length}
                      className={styles.open__select}
                      onChange={handleAddNewMember}
                      style={{ 
                        pointerEvents: 
                          userTypeOptionsEnabled.find(option => option.name === current.header && option.stepIndex === currentStepIndex) && 
                          currentRadioOptionSelection && 
                          radioOptionsEnabledInStep.find(
                            option => option.stepIndex === currentStepIndex && 
                            option.currentHeader === current.header && 
                            option.name === "selectItemOptionForUser-" + currentStepIndex + "-" + current.header
                          )?.valueActive === "select" + current.header ? 
                        "all" : 
                        enableRadioOptionsFromStepPopulation[`${current.header}`].find(option => option.memberOptionEnabled && option.stepIndex === currentStepIndex) && currentEnabledSteps.find(step => step.index === currentStepIndex && step.enableStep === true) ?
                        "all" :
                        "none" 
                      }}
                    >
                      {React.Children.toArray(current.portfolios.map((item) => (
                        <option 
                          className={
                            current.header === "Team" ?
                              teamMembersSelectedForProcess.find(user => user.member === item.member && user.portfolio === item.portfolio && user.stepIndex === currentStepIndex) ? styles.user__Selected : styles.user__Not__Selected
                            :
                            current.header === "Users" ?
                              userMembersSelectedForProcess.find(user => user.member === item.member && user.portfolio === item.portfolio && user.stepIndex === currentStepIndex) ? styles.user__Selected : styles.user__Not__Selected
                            :
                            current.header === "Public" ?
                              publicMembersSelectedForProcess.find(user => user.member === item.member && user.portfolio === item.portfolio && user.stepIndex === currentStepIndex) ? styles.user__Selected : styles.user__Not__Selected
                            :
                            ""
                          }
                            // key={item.id} 
                            value={JSON.stringify(item)}
                            id={item.id + currentStepIndex}
                          >
                            {item.content}
                        </option>
                      )))}
                    </select>
                    {current.portfolios.map((item) => (
                      <Tooltip style={{ width: "max-content", zIndex: 2, whiteSpace: "pre" }} anchorId={item.id + currentStepIndex} content={`user: ${item.member} \nportfolio: ${item.portfolio}`} place="top" />
                    ))}
                  </div>
                </>
              }
            </div>
          </div>
          <AssignTask currentStepIndex={currentStepIndex} stepsPopulated={stepsPopulated} />
        </>
      }
    </div>
  );
};

export default SelectMembersToAssign;

export const teams = [
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 2",
  },
  {
    id: uuidv4(),
    content: "team 3",
  },
  {
    id: uuidv4(),
    content: "team 4",
  },
];

const teamsForTeamMembers = [
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 2",
  },
  {
    id: uuidv4(),
    content: "team 3",
  },
  {
    id: uuidv4(),
    content: "team 4",
  },
]

const teamsForUserMembers = [
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 2",
  },
  {
    id: uuidv4(),
    content: "team 3",
  },
  {
    id: uuidv4(),
    content: "team 4",
  },
]

const teamsForPublicMembers = [
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 2",
  },
  {
    id: uuidv4(),
    content: "team 3",
  },
  {
    id: uuidv4(),
    content: "team 4",
  },
]

export const members = [
  {
    id: uuidv4(),
    content: "member 1",
  },
  {
    id: uuidv4(),
    content: "member 1",
  },
  {
    id: uuidv4(),
    content: "member 1",
  },
  {
    id: uuidv4(),
    content: "member 1",
  },
];

export const selectMembers = [
  {
    id: uuidv4(),
    header: "Team",
    title: "Team Members",
    all: "Select all Team Members",
    selectInTeam: "Select Teams in Team Members",
    selectMembers: "Select Members",
    teams: [],
    portfolios: members,
  },
  {
    id: uuidv4(),
    header: "Users",
    title: "Users",
    all: "Select all Users",
    selectInTeam: "Select Teams in Users",
    selectMembers: "Select Users",
    teams: [],
    portfolios: members,
  },
  {
    id: uuidv4(),
    header: "Public",
    title: "Public",
    all: "Select all Public",
    selectInTeam: "Select Teams in Public",
    selectMembers: "Select Public",
    teams: [],
    portfolios: members,
  },
];
