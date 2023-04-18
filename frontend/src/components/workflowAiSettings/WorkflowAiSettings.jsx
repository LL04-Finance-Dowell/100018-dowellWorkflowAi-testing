import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import InfoBox from '../infoBox/InfoBox';
import SubmitButton from '../submitButton/SubmitButton';
import EnabledDisabkedProcess from './enabledDisabkedProcess/EnabledDisabkedProcess';
import EnabledProcess from './enabledProcess/EnabledProcess';
import TeamsInWorkflowAi from './teamInWorkflowAi/TeamsInWorkflowAi';
import Themes from './themes/Themes';
import {
  permissionArray,
  processesInWorkflowAIArray,
  workflowAiSettingsArray,
} from './veriables';
import styles from './workflowAiSettings.module.css';
import { ImHome3 } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const Container = styled.div`
  & button:not(.edit_modal_sect button) {
    background-color: ${(props) => props.bgColor} !important;
  }
`;

const WorkflowAiSettings = () => {
  const { themeColor } = useSelector((state) => state.app);

  const { handleSubmit, register } = useForm();
  const { userDetail } = useSelector((state) => state.auth);
  // console.log(userDetail);

  const onSubmit = (data) => {
    console.log('dataaaaaaaaaa', data);
  };

  // #7a7a7a
  // --e-global-color-text;
  const { workflowTeams } = useAppContext();
  const [
    workflowAiSettingsArrayToDisplay,
    setWorkflowAiSettingsArrayToDisplay,
  ] = useState(workflowAiSettingsArray);

  useEffect(() => {
    setWorkflowAiSettingsArrayToDisplay(
      workflowAiSettingsArray.map((setting) => {
        setting.children.forEach((child) => {
          if (child.proccess_title === 'teams') {
            child.items = workflowTeams.map((team) => {
              return {
                _id: team._id,
                content: team.team_name,
              };
            });
          }
          if (child.proccess_title === 'portfolios') {
            child.items =
              userDetail?.portfolio_info?.find(
                (item) => item.product === 'Workflow AI'
              )?.member_type === 'owner'
                ? userDetail?.userportfolio.map((portfolio) => ({
                    _id: crypto.randomUUID(),
                    content: portfolio.portfolio_name,
                  }))
                : userDetail?.selected_product?.userportfolio.map(
                    (portfolio) => {
                      return {
                        _id: crypto.randomUUID(),
                        content: portfolio.portfolio_name,
                      };
                    }
                  );
          }
        });
        return setting;
      })
    );
  }, [userDetail, workflowTeams]);

  return (
    <Container bgColor={themeColor} className={styles.container}>
      {workflowAiSettingsArrayToDisplay.map((item) => (
        <div key={item._id} className={styles.box}>
          <h2
            className={`${styles.title} ${styles.title__l}`}
            style={{
              position: 'relative',
            }}
          >
            <Link to='/' className={`${styles.home__btn}`}>
              <ImHome3 />
            </Link>
            {item.title}
          </h2>
          <div className={styles.section__container}>
            {item.children.map((childItem) => (
              <div key={childItem._id} className={styles.section__box}>
                <InfoBox
                  type='list'
                  items={childItem.items}
                  title={childItem.proccess_title}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.bottom__line}></div>
      <EnabledProcess />
      <div className={styles.bottom__line}></div>
      <TeamsInWorkflowAi />
      <div className={styles.bottom__line}></div>
      <EnabledDisabkedProcess />
      <div className={styles.bottom__line}></div>
      <Themes />
    </Container>
  );
};

export default WorkflowAiSettings;
