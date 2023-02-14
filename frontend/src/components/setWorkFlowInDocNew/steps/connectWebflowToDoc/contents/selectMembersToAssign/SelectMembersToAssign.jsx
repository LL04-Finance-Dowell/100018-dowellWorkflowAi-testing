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

const SelectMembersToAssign = ({ currentStepIndex }) => {
  const [selectMembersComp, setSelectMembersComp] = useState(selectMembers);
  const [current, setCurrent] = useState(selectMembers[0]);
  const { register, watch } = useForm();
  const teamMembersRef = useRef(null);
  const selectMembersRef = useRef(null);
  const [ selectTeamItem, setSelectTeamitem ] = useState(null);
  const [ selectMembersItem, setSelectMembersItem ] = useState(null);
  const { selectedMembersForProcess, teamsSelectedSelectedForProcess, teamMembersSelectedForProcess, userMembersSelectedForProcess, publicMembersSelectedForProcess } = useSelector((state) => state.app);
  const [ selectedMembersSet, setSelectedMembersSet ] = useState(false);
  const [ currentSelectedTeam, setCurrentSelectedTeam ] = useState(null);
  const [ currentSelectedTeams, setCurrentSelectedTeams ] = useState(null);
  
  const dispatch = useDispatch();

  const handleSetCurrent = (item) => {
    setCurrent(item);
  };

  useClickInside(teamMembersRef, () => {
    if (!selectTeamItem) return toast.info("Please check either option above")
    console.log("enabled team options")
  })

  useClickInside(selectMembersRef, () => {
    if (!selectMembersItem) return toast.info("Please check the option above")
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
          return Object.assign({}, ...membersFound)
        }
        return {
          id: uuidv4(),
          content: `${member.username} - (${member.portfolio_name})`,
          member: member.username,
          portfolio: member.portfolio_name
        }
      })

      return memberPortfolios;
    }

    const updatedMembersState = copyOfCurrentSelectMembersState.map(member => {
      if (member.header === "Team") {
        member.portfolios = extractAndFormatPortfoliosForMembers("team_member")
        return member
      }
      if (member.header === "Users") {
        member.portfolios = extractAndFormatPortfoliosForMembers("public")
        return member
      }

      member.portfolios = extractAndFormatPortfoliosForMembers("to-be-decided")
      return member
    });

    setSelectMembersComp(updatedMembersState);
    setSelectedMembersSet(true);

  }, [selectedMembersForProcess])

  useEffect(() => {
    
    if (!selectTeamItem) return

    selectTeamItem?.teams.forEach(team => dispatch(removeFromTeamsSelectedSelectedForProcess({ id: team.id, stepIndex: currentStepIndex })))

    if (selectTeamItem.allSelected) {
      selectTeamItem?.teams.forEach(team => dispatch(setTeamsSelectedSelectedForProcess({ ...team, stepIndex: currentStepIndex })))
      return
    }

  }, [selectTeamItem])

  const handleSelectTeam = (e) => {
    const parsedSelectedJsonValue = JSON.parse(e.target.value);
    const teamSelected = parsedSelectedJsonValue.content;

    const teamAddedToProcess = teamsSelectedSelectedForProcess.find(team => team.id === parsedSelectedJsonValue.id);
    
    if (teamAddedToProcess) {
      dispatch(removeFromTeamsSelectedSelectedForProcess({ id: parsedSelectedJsonValue.id, stepIndex: currentStepIndex }));
    } else {
      dispatch(setTeamsSelectedSelectedForProcess({ ...parsedSelectedJsonValue, stepIndex: currentStepIndex }));
    }
    
    console.log("Current team selected: ", teamSelected);
    console.log("Current header: ", current.header);
    
    if (!currentSelectedTeams) {
      const [ newItem, newSelectedTeams ] = [{
        headerSelected: current.header,
        teamSelected: teamSelected,
      }, []]
      newSelectedTeams.push(newItem);
      setCurrentSelectedTeam(teamSelected);
      setCurrentSelectedTeams(newSelectedTeams);
      return
    }
    
    const copyOfCurrentSelectedTeams = currentSelectedTeams.slice();
    const teamAlreadyAdded = copyOfCurrentSelectedTeams.find(team => team.teamSelected === teamSelected && team.headerSelected === current.header)
    
    if (teamAlreadyAdded) return setCurrentSelectedTeam(teamSelected);
    
    copyOfCurrentSelectedTeams.push({
      headerSelected: current.header,
      teamSelected: teamSelected,
    })

    setCurrentSelectedTeam(teamSelected);
    setCurrentSelectedTeams(copyOfCurrentSelectedTeams);
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

  return (
    <div className={styles.container}>
      <div className={styles.select__container}>
        <div className={styles.select__header__box}>
          {selectMembersComp.map((item) => (
            <div
              onClick={() => handleSetCurrent(item)}
              key={item.id}
              className={`${styles.select__header} ${
                current.id === item.id && styles.selected
              }`}
            >
              {item.header}
            </div>
          ))}
        </div>
        <div className={styles.select__content__container}>
          <h3 className={styles.title}>{current.title}</h3>
          <div>
            <Radio
              register={register}
              name={"selectItemOptionForUser" + currentStepIndex + current.title}
              value={"all" + current.header}
              onChange={() => setSelectTeamitem({...current, allSelected: true})}
            >
              Select all {current.header}
            </Radio>
            <Radio
              register={register}
              name={"selectItemOptionForUser" + currentStepIndex + current.title}
              value={"selectIn" + current.header}
              onChange={() => setSelectTeamitem(current)}
            >
              Select Teams in {current.header}
            </Radio>
          </div>
          <div ref={teamMembersRef}>
            <select
              required
              {...register("teams")}
              size={current.teams.length}
              className={styles.open__select}
              onChange={handleSelectTeam}
              style={{ pointerEvents: selectTeamItem ? "all" : "none" }}
            >
              {current.teams.map((item) => (
                <option 
                  key={item.id} 
                  value={JSON.stringify(item)}
                  className={teamsSelectedSelectedForProcess.find(team => team.id === item.id && team.stepIndex === currentStepIndex) ? styles.team__Selected : ""}
                >
                  {item.content}
                </option>
              ))}
            </select>
          </div>
          {
            !currentSelectedTeam ? <>
              <p className={styles.no__Team__Selected__Text}><b>Please select a team to see its members</b></p>
            </> :
            currentSelectedTeams && currentSelectedTeams.find(team => team.teamSelected === currentSelectedTeam && team.headerSelected === current.header) ?
            <>
              <Radio
              register={register}
              name={"selectAllMembers" + currentStepIndex + current.title}
              value={"select" + current.header}
              onChange={(e) => setSelectMembersItem(e.target.value)}
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
                  style={{ pointerEvents: selectMembersItem ? "all" : "none" }}
                >
                  {current.portfolios.map((item) => (
                    <option 
                      className={
                        current.header === "Team" ?
                          teamMembersSelectedForProcess.find(user => user.member === item.member && user.portfolio === item.portfolio && user.stepIndex === currentStepIndex) ? styles.user__Selected : ""
                        :
                        current.header === "Users" ?
                          userMembersSelectedForProcess.find(user => user.member === item.member && user.portfolio === item.portfolio && user.stepIndex === currentStepIndex) ? styles.user__Selected : ""
                        :
                        current.header === "Public" ?
                          publicMembersSelectedForProcess.find(user => user.member === item.member && user.portfolio === item.portfolio && user.stepIndex === currentStepIndex) ? styles.user__Selected : ""
                        :
                        ""
                      }
                        key={item.id} 
                        value={JSON.stringify(item)}
                        id={item.id + currentStepIndex}
                      >
                        {item.content}
                    </option>
                  ))}
                </select>
                {current.portfolios.map((item) => (
                  <Tooltip style={{ width: "max-content", zIndex: 2, whiteSpace: "pre" }} anchorId={item.id + currentStepIndex} content={`user: ${item.member} \nportfolio: ${item.portfolio}`} place="top" />
                ))}
              </div>
            </> :
            <></>
          }
        </div>
      </div>
      <AssignTask currentStepIndex={currentStepIndex} />
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
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 1",
  },
];

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
    teams: teams,
    portfolios: members,
  },
  {
    id: uuidv4(),
    header: "Users",
    title: "Users",
    all: "Select all Users",
    selectInTeam: "Select Teams in Users",
    selectMembers: "Select Users",
    teams: teams,
    portfolios: members,
  },
  {
    id: uuidv4(),
    header: "Public",
    title: "Public",
    all: "Select all Public",
    selectInTeam: "Select Teams in Public",
    selectMembers: "Select Public",
    teams: teams,
    portfolios: members,
  },
];
