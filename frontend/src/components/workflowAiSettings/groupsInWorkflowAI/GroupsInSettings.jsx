import React, { useEffect, useMemo, useState } from "react";
import InfoBox from "../../infoBox/InfoBox";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import workflowAiSettingsStyles from "../workflowAiSettings.module.css";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../contexts/AppContext";
import {
  createGroupInsertId,
  selectAllGroups,
  updateGroupFlag,
  updateGroupsStatus,
} from "../../../features/groups/groupsSlice";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../../features/groups/groupThunk";

const selectedteams = [
  {
    _id: uuidv4(),
    _mId: uuidv4(),
    content: {
      content: "Testing new team",
      title: "Name",
    },
  },
  {
    _id: uuidv4(),
    _mId: uuidv4(),
    content: {
      content: "123566",
      title: "code",
    },
  },
];

const GroupsInSettings = () => {
  const dispatch = useDispatch();

  const { workflowTeams, workflowTeamsLoaded, isAssignTask } = useAppContext();

  const { teamsInWorkflowAI, permissionArray } = useSelector(
    (state) => state.app
  );
  const { isDesktop, nonDesktopStyles } = useAppContext();

  const { t } = useTranslation();

  const { register } = useForm();

  const AllGroups = useSelector(selectAllGroups);

  const insertID = useSelector(createGroupInsertId);

  const updatedFlag = useSelector(updateGroupFlag);

  const { userDetail } = useSelector((state) => state.auth);

  const [groupData, setGroupData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [publicData, setTPublicData] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedGroupEdit, setSelectedGroupEdit] = useState();
  const [selectedGroup, setSelectedgroup] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [handleChangeParams, setHandleChangeParams] = useState([]);

  const [groupsInWorkflowAI, setGroupsInWorkflowAI] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const company_id = userDetail?.portfolio_info[0]?.org_id;
      await dispatch(
        getGroups({ company_id: company_id, data_type: "Real_Data" })
      );
    };

    fetchData();
  }, [insertID, updatedFlag, userDetail]);

  const extractPortfoliosForPublicMembers = (workflowTeams, criteria) => {
    const publicMembers = workflowTeams.filter(
      (team) => team.team_type === criteria
    );
    const publicPortfolios = publicMembers
      .map((pub) => {
        if (Array.isArray(pub.portfolio_list)) {
          return pub.portfolio_list.map((inner) => {
            return inner;
          });
        } else {
          return pub.portfolio_list;
        }
      })
      ?.flat();
    const memberPortfolios = publicPortfolios.map((member) => {
      if (Array.isArray(member.username)) {
        let membersFound = member.username.map((user) => {
          return {
            id: uuidv4(),
            content: `${user} - (${member.portfolio_name})`,
            member: user,
            portfolio: member.portfolio_name,
          };
        });

        if (!membersFound) return null;
        return membersFound;
      } else {
        return {
          id: uuidv4(),
          content: `${member.username} - (${member.portfolio_name})`,
          member: member.username,
          portfolio: member.portfolio_name,
        };
      }
    });
    const allPublic = memberPortfolios.flat();

    const uniquePublicUser = [
      ...new Map(allPublic.map((d) => [d.member, d])).values(),
    ];
    return uniquePublicUser;
  };

  useEffect(() => {
    if (AllGroups?.length <= 0) return;

    const Reformat = AllGroups?.map((data) => {
      return {
        _id: data._id,
        content: data.group_name,
      };
    })?.reverse();
    setGroupData([...Reformat]);
  }, [AllGroups]);

  useEffect(() => {
    if (workflowTeams?.length <= 0 || !workflowTeamsLoaded) return;

    const publicMembersData = extractPortfoliosForPublicMembers(
      workflowTeams,
      "public"
    );
    const teamMembersData = extractPortfoliosForPublicMembers(
      workflowTeams,
      "team"
    );

    setTPublicData(publicMembersData);

    setTeamData([{ header: "Team", portfolios: teamMembersData }]);
  }, [workflowTeams, workflowTeamsLoaded]);

  const handleOnChange = ({ item, title, boxId, type }, e) => {
    // console.log("e.target.name",e.target.value);
    if (e.target.name === "Groups") {
      setIsOpen(true);

      const selectedGroup = groupData.find(
        (item) => item._id === e.target.value
      );
      const selectedGroupRawData = AllGroups.find(
        (item) => item._id === e.target.value
      );
      setSelectedGroupEdit(selectedGroupRawData);
      setSelectedgroup([
        {
          _id: selectedGroup._id,
          _mId: uuidv4(),
          content: {
            content: selectedGroup.content,
            title: "Name",
          },
        },
      ]);

      setSelectedTeamId(e.target.value);
    }
    setHandleChangeParams([{ item, title, boxId, type }, e]);
  };

  const handleUpdateTeam = (teamInfo) => {
    console.log("teamInfo", teamInfo);
  };

  const groupsInWo = useMemo(() => {
    return [
      {
        _id: uuidv4(),
        title: "Create/Edit Groups in Workflow AI",
        children: [
          {
            _id: uuidv4(),
            column: [
              {
                _id: uuidv4(),
                items: groupData,
                proccess_title: "Groups",
              },
            ],
          },
          {
            _id: uuidv4(),
            column: [
              {
                _id: uuidv4(),
                items: selectedGroup,
                proccess_title: "Group details",
              },
            ],
          },
        ],
      },
    ];
  }, [groupData, selectedGroup]);
 
  useEffect(() => {
    setGroupsInWorkflowAI(groupsInWo);
  }, [groupsInWo, updatedFlag]);
  return (
    <>
      {groupsInWorkflowAI && (
        <div className={workflowAiSettingsStyles.box}>
          <h2
            className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
          >
            {t(groupsInWorkflowAI[0].title)}
          </h2>
          <div
            className={workflowAiSettingsStyles.section__container}
            style={!isDesktop ? nonDesktopStyles : {}}
          >
            <form style={{ width: "100%" }}>
              <div className={workflowAiSettingsStyles.section__box}>
                {groupsInWorkflowAI[0].children[0].column.map(
                  (colItem, ind) => (
                    <InfoBox
                      boxId={groupsInWorkflowAI[0].children[0]._id}
                      register={register}
                      items={colItem.items}
                      title={colItem.proccess_title}
                      onChange={handleOnChange}
                      showSearch={colItem.items.length ? true : false}
                      showAddGroupButton={true}
                      teamData={teamData}
                      totalPublicVal={publicData.length}
                      type="radio"
                      key={ind}
                    />
                  )
                )}
              </div>
            </form>
            <div className={workflowAiSettingsStyles.section__box}>
              {groupsInWorkflowAI[0].children[1].column.map((colItem, ind) => (
                <InfoBox
                  boxId={groupsInWorkflowAI[0].children[0]._id}
                  register={register}
                  items={colItem.items}
                  title={colItem.proccess_title}
                  onChange={handleOnChange}
                  key={ind}
                  type="list"
                  teamData={teamData}
                  showSearch={false}
                  showGroupEditButton={true}
                  selectedGroupForEdit={selectedGroupEdit}
                  handleUpdateTeam={handleUpdateTeam}
                  externalToggleVal={isOpen}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupsInSettings;
