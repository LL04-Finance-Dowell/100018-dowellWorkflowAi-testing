// ? Ln 188, used <span> instead of <button> (style conflicts) and <a> (ESLints prompts)
import React, { useEffect, useState } from 'react';
/* import Collapse from "../../layouts/collapse/Collapse"; */

import {
  InfoBoxContainer,
  InfoContentBox,
  InfoContentContainer,
  InfoContentFormText,
  InfoContentText,
  InfoSearchbar,
  InfoTitleBox,
} from './styledComponents';
import TypeFilter from './TypeFilter';

import { AiOutlinePlus, AiTwotoneEdit } from 'react-icons/ai';
import { MdOutlineRemove, MdOutlineAdd } from 'react-icons/md';
import { Collapse } from 'react-bootstrap';

import TeamModal from '../modal/TeamModal';
import EditTeamModal from '../modal/EditTeamModal';

import { useSelector, useDispatch } from 'react-redux';


// import { teamsInWorkflowAITeams } from '../workflowAiSettings/veriables';

import { v4 } from 'uuid';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { setTeamInWorkflowAITeams, setTeamsInWorkflowAITeams } from '../../features/processes/processesSlice';
import CreateGroup from '../../features/groups/CreateGroup/CreateGroup';
import { setSelectedGroupForEdit, setUpdatedGroupFlag, updateGroupFlag } from '../../features/groups/groupsSlice';

const InfoBox = ({
  boxId,
  items,
  title,
  onChange,
  showSearch,
  showAddButton,
  showAddGroupButton,
  type,
  showEditButton,
  boxType,
  handleItemClick,
  isTeams,
  handleUpdateTeam,
  modPort,
  checker,
  specials,
  teamData,
  totalPublicVal,
  externalToggleVal,
  showGroupEditButton,
  selectedGroupForEdit
}) => {


  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [team, setTeam] = useState({});
  const {  permissionArray } = useSelector(
    (state) => state.app
  );
  const { teamsInWorkflowAI,  } = useSelector(
    (state) => state.processes
  );
  const { userDetail } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const updatedFlag = useSelector(updateGroupFlag);
  const { workflowTeams } = useAppContext();
  const [searchValue, setSearchValue] = useState('');
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [modTitle, setModTitle] = useState('');
  const [openGroupsOverlayModal, setOpenGroupsOverlayModal] = useState(false);

  const handleAddTeam = (team) => {
    setTeam(team);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleGroupsModal = () => {
    
    if(showGroupEditButton && selectedGroupForEdit ){
      dispatch(setUpdatedGroupFlag())
      dispatch(setSelectedGroupForEdit(selectedGroupForEdit))
    }
    setOpenGroupsOverlayModal(true);
  };
  const closeGroupsModal = () => {
    setOpenGroupsOverlayModal(false);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };
useEffect(() => {
  if(externalToggleVal===undefined) return
if(externalToggleVal && !isOpen){
  setIsOpen(true)
}
if(!externalToggleVal && isOpen){
  setIsOpen(false)
}
}, [externalToggleVal])

  const setupTeamInfo = (
    name,
    code,
    spec,
    details,
    universalCode,
    _id,
    ind
  ) => {
    const allTeams = teamsInWorkflowAI[0].children[0].column[0].items;
    const count = ind !== null ? ind + 1 : allTeams.length + 1;
    return {
      _id: _id || v4(),
      content: `Team ${count} (${name}, ${code}, ${spec}, ${details}, ${universalCode})`,
    };
  };

  useEffect(() => {
    setItemsToDisplay(items);
  }, [items,updatedFlag]);

  useEffect(() => {
    if (showSearch) {
      const itemsMatchingSearchValue = items.filter((item) =>
        item?.content
          ?.toLocaleLowerCase()?.includes(searchValue?.toLocaleLowerCase())
      );
      setItemsToDisplay(itemsMatchingSearchValue);
    }
  }, [searchValue, showSearch,updatedFlag, items]);

  // *Adds new team to app
  useEffect(() => {
    if (team.name) {
      const newTeam = setupTeamInfo(
        team.name,
        team.code,
        team.spec,
        team.details,
        team.universalCode,
        null,
        null
      );

      dispatch(setTeamInWorkflowAITeams(newTeam));
      setTeam({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team,updatedFlag]);

  // *Populate teamsInWorkflowAITeams with fetched teams
  useEffect(() => {
    if (workflowTeams.length) {
      let teams = [];
      workflowTeams.forEach((team, ind) => {
        const {
          team_name,
          team_code,
          team_spec,
          details,
          universal_code,
          _id,
        } = team;
        const setTeam = setupTeamInfo(
          team_name,
          team_code,
          team_spec,
          details,
          universal_code,
          _id,
          ind
        );
        teams.push(setTeam);
      });
      dispatch(setTeamsInWorkflowAITeams(teams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowTeams]);

  useEffect(() => {
    if (specials === 'edp') {
      if (title !== 'Processes') {
        let mod = permissionArray[0].children[0].column[0].items.find((item) =>
          item?.content.includes(title)
        )?.content;

        if (mod.includes('set display name')) {
          mod = title;
        } else {
          mod = mod.split(' (')[1];
          mod = mod.slice(0, mod.length - 1);
        }

        setModTitle(mod);
      }
    }
  }, [specials,updatedFlag, permissionArray]);

  return specials === 'ep' ? (
    !!itemsToDisplay.length && (
      <InfoBoxContainer
        boxType={boxType}
        className='info-box-container'
        style={{ overflow: 'unset' }}
      >
        <div className='flex'>
          <InfoTitleBox
            boxType={boxType}
            className='info-title-box'
            onClick={handleToggle}
          >
            <div
              style={{
                marginRight: '8px',
                fontSize: '14px',
              }}
            >
              {type === 'list' ? (
                isOpen ? (
                  <MdOutlineRemove />
                ) : (
                  <MdOutlineAdd />
                )
              ) : (
                <input type='checkbox' checked={isOpen} onChange={(e) => {}} />
              )}
            </div>{' '}
            <span
              style={{ cursor: 'pointer' }}
              onClick={(e) => e.preventDefault()}
            >
              {t(
                specials === 'edp'
                  ? title !== 'Processes'
                    ? modTitle
                    : title
                  : title
              )}
            </span>
          </InfoTitleBox>
        </div>
        <Collapse in={isOpen}>
          <InfoContentContainer boxType={boxType} className='info-content-cont'>
            {itemsToDisplay.length ? (
              type === 'list' ? (
                <InfoContentBox boxType={boxType}>
                  {itemsToDisplay.map((item, index) => (
                    <InfoContentText
                      onClick={() => handleItemClick(item)}
                      key={item._id}
                    >
                      {/* {index + 1}. {item?.content} */}
                      {item.contentDisplay ? (
                        <>
                          <>
                            {!item.displayNoContent &&
                            item.contentsToDisplay &&
                            Array.isArray(item.contentsToDisplay) ? (
                              React.Children.toArray(
                                item.contentsToDisplay.map(
                                  (itemContent, itemIndex) => {
                                    return (
                                      <>
                                        <span>
                                          {itemIndex + 1}. {itemContent.header}{' '}
                                          - {itemContent?.content}
                                        </span>
                                        <br />
                                      </>
                                    );
                                  }
                                )
                              )
                            ) : (
                              <></>
                            )}
                          </>
                        </>
                      ) : (
                        <>
                          <span style={{ fontWeight: 'bold' }}>
                            {item?.content?.title ? `${item?.content?.title}:` : ''}
                          </span>{' '}
                          <span>
                            {item?.content?.content
                              ? item?.content?.content
                              : `${index + 1}. ${item?.content}`}
                          </span>
                        </>
                      )}
                    </InfoContentText>
                  ))}
                </InfoContentBox>
              ) : type === 'radio' ? (
                <InfoContentBox>
                  {itemsToDisplay.map((item) => (
                    <InfoContentFormText key={item._id}>
                      <input
                        type='radio'
                        id={item?.content}
                        name={title}
                        value={item._id}
                        onChange={(e) =>
                          onChange({ item, title, boxId, type }, e)
                        }
                      />
                      <label htmlFor='javascript'>{t(item?.content)}</label>
                    </InfoContentFormText>
                  ))}
                </InfoContentBox>
              ) : (
                <InfoContentBox>
                  {itemsToDisplay.map((item) => (
                    <InfoContentFormText key={item._id}>
                      <input
                        onChange={(e) =>
                          onChange({ item, title, boxId, type, checker }, e)
                        }
                        /* {...register(item?.content)} */
                        checked={item.isSelected ? true : false}
                        type='checkbox'
                        name={title}
                      />
                      <span key={item._id}>{t(item?.content)}</span>
                    </InfoContentFormText>
                  ))}
                </InfoContentBox>
              )
            ) : (
              ''
            )}
          </InfoContentContainer>
        </Collapse>
      </InfoBoxContainer>
    )
  ) : (
    <InfoBoxContainer
      boxType={boxType}
      className='info-box-container'
      style={{ overflow: 'unset' }}
    >
      <div className='flex'>
        <InfoTitleBox
          boxType={boxType}
          className='info-title-box'
          onClick={handleToggle}
        >
          <div
            style={{
              marginRight: '8px',
              fontSize: '14px',
            }}
          >
            {type === 'list' ? (
              isOpen ? (
                <MdOutlineRemove />
              ) : (
                <MdOutlineAdd />
              )
            ) : (
              <input type='checkbox' checked={isOpen} onChange={(e) => {}} />
            )}
          </div>{' '}
          <span
            style={{ cursor: 'pointer' }}
            onClick={(e) => e.preventDefault()}
          >
            {t(
              specials === 'edp'
                ? title !== 'Processes'
                  ? modTitle
                  : title
                : title
            )}
          </span>
        </InfoTitleBox>
      </div>
      <Collapse in={isOpen}>
        <InfoContentContainer boxType={boxType} className='info-content-cont'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 20px',
              position: 'relative',
            }}
          >
            {title !== 'portfolios'
              ? showSearch && (
                  <InfoSearchbar
                    placeholder='Search'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                )
              : isTeams
              ? showSearch && (
                  <>
                    <InfoSearchbar
                      placeholder='Search'
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <TypeFilter />
                  </>
                )
              : !modPort && <span>{t('Create and select Team')}</span>}

            {!itemsToDisplay.length ? (
              <span style={{ textTransform: 'capitalize' }}>
                {title === 'rights'
                  ? t('select portfolio to see rights')
                  : t(`no ${title}`)}
              </span>
            ) : (
              ''
            )}

            {showAddButton && (
              <button
                style={{
                  padding: '4px 12px',
                  marginTop: 0,
                  color: 'var(--e-global-color-cd6593d)',
                }}
                onClick={handleShowModal}
                type='button'
              >
                <AiOutlinePlus />
              </button>
            )}
                {showAddGroupButton && (
              <button
                style={{
                  padding: '4px 12px',
                  marginTop: 0,
                  color: 'var(--e-global-color-cd6593d)',
                }}
                onClick={handleGroupsModal}
                type='button'
              >
                <AiOutlinePlus />
              </button>
            )}
          </div>

          {showEditButton && (
            <button
              style={{
                padding: '4px 12px',
                marginTop: 0,
                position: 'absolute',
                right: '5px',
                top: '5px',
                color: 'var(--e-global-color-cd6593d)',
                fontSize: '1rem',
              }}
              onClick={() => setShowEditModal(true)}
              type='button'
            >
              <AiTwotoneEdit />
            </button>
          )}
   {showGroupEditButton && (
            <button
              style={{
                padding: '4px 12px',
                marginTop: 0,
                position: 'absolute',
                right: '5px',
                top: '5px',
                color: 'var(--e-global-color-cd6593d)',
                fontSize: '1rem',
              }}
              onClick={handleGroupsModal}
              type='button'
            >
              <AiTwotoneEdit />
            </button>
          )}
          <TeamModal
            show={showModal}
            onHide={handleCloseModal}
            backdrop='static'
            keyboard={false}
            handleAddTeam={handleAddTeam}
          />
              {    openGroupsOverlayModal && (<div style={{position:'relative', marginLeft:'20%', background:'none'}}>
                    <CreateGroup editGroupsFlag={selectedGroupForEdit} fromSettings={true} totalPublicMembersVal={totalPublicVal} dropdownData={teamData} handleOverlay={closeGroupsModal}/>
                  </div>)}
                  
          <EditTeamModal
            show={showEditModal}
            setShow={setShowEditModal}
            handlePortfolioChange={onChange}
            handleUpdateTeam={handleUpdateTeam}
            items={itemsToDisplay}
          />

          {itemsToDisplay.length ? (
            type === 'list' ? (
              <InfoContentBox boxType={boxType}>
                {itemsToDisplay.map((item, index) => (
                  <InfoContentText
                    // onClick={() => handleItemClick(item)}
                    key={item._id}
                  >
                    {/* {index + 1}. {item?.content} */}
                    {item.contentDisplay ? (
                      <>
                        <>
                          {!item.displayNoContent &&
                          item.contentsToDisplay &&
                          Array.isArray(item.contentsToDisplay) ? (
                            React.Children.toArray(
                              item.contentsToDisplay.map(
                                (itemContent, itemIndex) => {
                                  return (
                                    <>
                                      <span>
                                        {itemIndex + 1}. {itemContent.header} -{' '}
                                        {itemContent?.content}
                                      </span>
                                      <br />
                                    </>
                                  );
                                }
                              )
                            )
                          ) : (
                            <></>
                          )}
                        </>
                      </>
                    ) : (
                      <>
                        <span style={{ fontWeight: 'bold' }}>
                          {item?.content?.title ? `${item?.content?.title}:` : ''}
                        </span>{' '}
                        <span>
                          {item?.content?.content
                            ? item?.content?.content
                            : `${index + 1}. ${item?.content}`}
                        </span>
                      </>
                    )}
                  </InfoContentText>
                ))}
              </InfoContentBox>
            ) : type === 'radio' ? (
              <InfoContentBox>
                {itemsToDisplay.map((item) => (
                  <InfoContentFormText key={item._id}>
                    <input
                      type='radio'
                      id={item?.content}
                      name={title}
                      value={item._id}
                      onChange={(e) =>
                        onChange(
                          { item, title, boxId, type },
                          e,
                          specials === 'ep_port' && title === 'portfolios'
                        )
                      }
                    />
                    <label htmlFor='javascript'>{t(item?.content)}</label>
                  </InfoContentFormText>
                ))}
              </InfoContentBox>
            ) : (
              <InfoContentBox>
                {title !== 'portfolios'
                  ? itemsToDisplay.map((item) => (
                      <InfoContentFormText key={item._id}>
                        <input
                          onChange={(e) =>
                            onChange({ item, title, boxId, type, checker }, e)
                          }
                          /* {...register(item?.content)} */
                          checked={item.isSelected ? true : false}
                          type='checkbox'
                          name={title}
                        />
                        <span key={item._id}>{t(item?.content)}</span>
                      </InfoContentFormText>
                    ))
                  : isTeams
                  ? itemsToDisplay.map((item, ind) =>
                      item.isShow ? (
                        <InfoContentFormText key={item._id}>
                          <input
                            onChange={(e) =>
                              onChange({ item, title, boxId, type }, e)
                            }
                            /* {...register(item?.content)} */
                            type={'checkbox'}
                            value={
                              userDetail?.portfolio_info?.find(
                                (item) => item.product === 'Workflow AI' && item.member_type === 'owner'
                              )
                                ? userDetail?.userportfolio[ind]
                                : userDetail?.selected_product?.userportfolio[
                                    ind
                                  ]
                            }
                            name={title}
                            checked={item.isSelected ? true : false}
                          />
                          <span key={item._id}>{item?.content}</span>
                        </InfoContentFormText>
                      ) : (
                        ''
                      )
                    )
                  : ''}
              </InfoContentBox>
            )
          ) : (
            ''
          )}
        </InfoContentContainer>
      </Collapse>
    </InfoBoxContainer>
  );
};

export default InfoBox;
