import React, { useEffect, useState } from 'react';
/* import Collapse from "../../layouts/collapse/Collapse"; */
import styles from './infoBox.module.css';
import {
  InfoBoxContainer,
  InfoContentBox,
  InfoContentContainer,
  InfoContentFormText,
  InfoContentText,
  InfoSearchbar,
  InfoTitleBox,
} from './styledComponents';

import { AiOutlinePlus } from 'react-icons/ai';
import { MdOutlineRemove, MdOutlineAdd } from 'react-icons/md';
import { Collapse } from 'react-bootstrap';

import TeamModal from '../modal/TeamModal';

import { useSelector, useDispatch } from 'react-redux';
import { setTeamsInWorkflowAITeams } from '../../features/app/appSlice';

import { teamsInWorkflowAITeams } from '../workflowAiSettings/veriables';

import { v4 } from 'uuid';

const InfoBox = ({
  boxId,
  items,
  title,
  onChange,
  showSearch,
  showAddButton,
  type,
  boxType,
  handleItemClick,
  isTeams,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [team, setTeam] = useState({});
  const { teamsInWorkflowAI } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAddTeam = (team) => {
    setTeam(team);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const [searchValue, setSearchValue] = useState('');
  const [itemsToDisplay, setItemsToDisplay] = useState([]);

  useEffect(() => {
    if (items.length) {
      setItemsToDisplay(items);
    }
  }, [items]);

  useEffect(() => {
    const itemsMatchingSearchValue = items.filter((item) =>
      item.content.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );
    setItemsToDisplay(itemsMatchingSearchValue);
  }, [searchValue]);

  // *Adds new team to app
  useEffect(() => {
    if (team.name) {
      const allTeams = teamsInWorkflowAI[0].children[0].column[0].items;
      const newTeam = {
        _id: v4(),
        content: `Team ${allTeams.length + 1} (${team.name}, ${team.code}, ${
          team.spec
        }, ${team.details}, ${team.universalCode})`,
      };
      // isSelected: !teamsInWorkflowAI[0].children[0].column[0].items.length,

      dispatch(setTeamsInWorkflowAITeams(newTeam));
      setTeam({});
    }
  }, [team]);

  // useEffect(() => {
  //   if (onChange && itemsToDisplay.length) {
  //     onChange({ item: itemsToDisplay[0], title, boxId });
  //   }
  // }, [itemsToDisplay]);

  return (
    <InfoBoxContainer boxType={boxType} className='info-box-container'>
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
          <a>{title}</a>
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
            }}
          >
            {title !== 'portfolios' ? (
              showSearch && (
                <InfoSearchbar
                  placeholder='Search'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )
            ) : isTeams ? (
              showSearch && (
                <InfoSearchbar
                  placeholder='Search'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              )
            ) : (
              <span>Create and select Team</span>
            )}

            {!itemsToDisplay.length ? (
              <span style={{ textTransform: 'capitalize' }}>no {title}</span>
            ) : (
              ''
            )}

            {showAddButton && (
              <button
                style={{
                  padding: '4px 12px',
                  marginTop: 0,
                  // marginRight: '2px',
                }}
                onClick={handleShowModal}
                type='button'
              >
                <AiOutlinePlus />
              </button>
            )}
          </div>

          <TeamModal
            show={showModal}
            onHide={handleCloseModal}
            backdrop='static'
            keyboard={false}
            handleAddTeam={handleAddTeam}
          />

          {itemsToDisplay.length ? (
            type === 'list' ? (
              <InfoContentBox boxType={boxType}>
                {itemsToDisplay.map((item, index) => (
                  <InfoContentText
                    onClick={() => handleItemClick(item)}
                    key={item._id}
                  >
                    {index + 1}. {item.content}
                  </InfoContentText>
                ))}
              </InfoContentBox>
            ) : type === 'radio' ? (
              <InfoContentBox>
                {itemsToDisplay.map((item) => (
                  <InfoContentFormText key={item._id}>
                    <input
                      type='radio'
                      id={item.content}
                      name={title}
                      value={item._id}
                      onChange={() => onChange({ item, title, boxId, type })}
                    />
                    <label htmlFor='javascript'>{item.content}</label>
                  </InfoContentFormText>
                ))}
              </InfoContentBox>
            ) : (
              <InfoContentBox>
                {title !== 'portfolios'
                  ? itemsToDisplay.map((item) => (
                      <InfoContentFormText key={item._id}>
                        <input
                          onChange={() =>
                            onChange({ item, title, boxId, type })
                          }
                          /* {...register(item.content)} */
                          checked={item.isSelected ? true : false}
                          type='checkbox'
                        />
                        <span key={item._id}>{item.content}</span>
                      </InfoContentFormText>
                    ))
                  : isTeams
                  ? itemsToDisplay.map((item, ind) => (
                      <InfoContentFormText key={item._id}>
                        <input
                          onChange={() =>
                            onChange({ item, title, boxId, type })
                          }
                          /* {...register(item.content)} */
                          type={'checkbox'}
                          value={userDetail.userportfolio[ind]}
                        />
                        <span key={item._id}>{item.content}</span>
                      </InfoContentFormText>
                    ))
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
