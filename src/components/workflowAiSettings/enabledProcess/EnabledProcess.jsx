import React, { useState, useEffect } from 'react';
import workflowAiSettingsStyles from '../workflowAiSettings.module.css';
import { useForm } from 'react-hook-form';
import { processesInWorkflowAIArray } from '../veriables';
import SubmitButton from '../../submitButton/SubmitButton';
import InfoBox from '../../infoBox/InfoBox';
import { v4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSettingProccess,
  setSettingProccessTeams,
  setSettingProccessPortfolios,
  setUpdateProccess,
} from '../../../features/app/appSlice';
import { setIsSelected } from '../../../utils/helpers';
import { createWorkflowSettings } from '../../../features/settings/asyncThunks';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';

const EnabledProcess = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { settingProccess, proccess } = useSelector((state) => state.app);
  const { createWorkflowSettings: createWorkflowSettingsItems, createStatus } =
    useSelector((state) => state.settings);
  const { userDetail } = useSelector((state) => state.auth);
  const { teamsInWorkflowAI } = useSelector((state) => state.app);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const { workflowTeams } = useAppContext();
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

  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    /* dispatch(setPro) */
    const filteredData = settingProccess[0].children.filter(
      (item, index) => index !== 0
    );

    const payload = filteredData.map((item) => ({
      ...item,
      column: item.column.map((col) =>
        col.type === 'hardcode'
          ? col
          : { ...col, items: col.items.filter((colItem) => colItem.isSelected) }
      ),
    }));

    const purePayload = payload.map((item) => ({
      ...item,
      column: item.column.filter((col) => col.items.length !== 0),
    }));

    console.log('payload', JSON.stringify(purePayload));

    const createData = {
      company_id: userDetail?.portfolio_info[0]?.org_id,
      owner_name: userDetail?.portfolio_info[0]?.owner_name,
      username: userDetail?.portfolio_info[0]?.username,
      portfolio_name: 'the portfolio name second',
      proccess: purePayload,
    };

    dispatch(createWorkflowSettings(createData));
  };

  console.log(
    'createWorkflowSettingsItems?.workflow_setting.processes.process',
    createWorkflowSettingsItems?.workflow_setting.processes[0].process,
    settingProccess
  );

  const handleOnChange = ({ item, title, boxId, type }) => {
    const isSelectedItems = setIsSelected({
      items: settingProccess[0].children,
      item,
      boxId,
      title,
      type,
    });
    dispatch(setUpdateProccess(isSelectedItems));

    // const lowerCaseTitle = title.toLowerCase();
    // if (lowerCaseTitle === 'portfolios') {
    //   console.log('item', title, item);
    //   setCurrentPortfolio(item._id);
    // } else if (lowerCaseTitle === 'teams') {
    //   console.log('teams', title);
    // } else {
    //   const isSelectedItems = setIsSelected({
    //     items: settingProccess[0].children,
    //     item,
    //     boxId,
    //     title,
    //     type,
    //   });
    //   dispatch(setUpdateProccess(isSelectedItems));
    // }
  };

  createWorkflowSettingsItems &&
    createWorkflowSettingsItems.length > 0 &&
    console.log('createWorkflowSettingsItems', [
      settingProccess[0].children[0],
      ...createWorkflowSettingsItems,
    ]);
  console.log('createWorkflowSettingsItemsstatus', createStatus);

  useEffect(() => {
    if (
      workflowTeams.length &&
      teamsInWorkflowAI[0].children[0].column[0].items.length
    ) {
      dispatch(
        setSettingProccessTeams(
          teamsInWorkflowAI[0].children[0].column[0].items
        )
      );
    }
  }, [workflowTeams, teamsInWorkflowAI]);

  useEffect(() => {
    dispatch(setSettingProccessPortfolios(userPortfolios));
  }, [userPortfolios]);

  useEffect(() => {
    console.log('teams: ', teamsInWorkflowAI);
    console.log('settingPr: ', settingProccess);
  });

  return (
    <>
      <form
        className={workflowAiSettingsStyles.form__cont}
        onSubmit={handleSubmit(onSubmit)}
      >
        {settingProccess?.map((item) => (
          <div key={item._id} className={workflowAiSettingsStyles.box}>
            <h2
              className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
            >
              {t(item.title)}
            </h2>
            <div className={workflowAiSettingsStyles.section__container}>
              {item.children && (
                <>
                  <div className={workflowAiSettingsStyles.section__box}>
                    {item.children[0].column.map((colItem) => (
                      <InfoBox
                        key={colItem._id}
                        type='radio'
                        boxId={item.children[0]._id}
                        register={register}
                        items={colItem.items}
                        title={colItem.proccess_title}
                        onChange={handleOnChange}
                        modPort={true}
                      />
                    ))}
                  </div>

                  {item.children?.slice(1, 4)?.map((childItem) => (
                    <div
                      key={childItem._id}
                      className={workflowAiSettingsStyles.section__box}
                    >
                      {childItem.column.map((colItem) => (
                        <InfoBox
                          key={colItem._id}
                          boxId={childItem._id}
                          register={register}
                          items={colItem.items}
                          title={colItem.proccess_title}
                          onChange={handleOnChange}
                          type='checkbox'
                        />
                      ))}
                    </div>
                  ))}

                  <div className='container'>
                    <h5>Enabled Processes</h5>

                    {item.children?.slice(4)?.map((childItem) => (
                      <div
                        key={childItem._id}
                        className={workflowAiSettingsStyles.section__box}
                      >
                        {childItem.column.map((colItem) => (
                          <InfoBox
                            key={colItem._id}
                            boxId={childItem._id}
                            register={register}
                            items={colItem.items}
                            title={colItem.proccess_title}
                            onChange={handleOnChange}
                            type='checkbox'
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <button
          type='submit'
          /*  status={createStatus} */
          className={workflowAiSettingsStyles.submit__button}
        >
          {t('Update Assigned Rights for Processes')}
        </button>
      </form>
    </>
  );
};

export default EnabledProcess;
