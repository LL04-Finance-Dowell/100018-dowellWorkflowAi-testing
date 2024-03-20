import React, { useState, useEffect } from 'react';
import workflowAiSettingsStyles from '../workflowAiSettings.module.css';
import { useForm } from 'react-hook-form';

import InfoBox from '../../infoBox/InfoBox';
import { v4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { productName, setIsSelected } from '../../../utils/helpers';
import { createWorkflowSettings } from '../../../features/settings/asyncThunks';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';
import { setSettingProccess, setSettingProccessPortfolios, setSettingProccessTeams, setUpdateProccess } from '../../../features/processes/processesSlice';

const EnabledProcess = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { column, permissionArray, themeColor } = useSelector(
    (state) => state.app
  );

  const { settingProccess } = useSelector((state) => state.processes);
  const { createWorkflowSettings: createWorkflowSettingsItems, createStatus } =
    useSelector((state) => state.settings);
  const { userDetail } = useSelector((state) => state.auth);
  const { teamsInWorkflowAI } = useSelector((state) => state.processes);

  const { workflowTeams, isDesktop, nonDesktopStyles } = useAppContext();
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

  const [portfolios] = useState(
    () => {
        // console.log("userDetail:", userDetail);
        // console.log("userportfolio:", userDetail?.userportfolio);
        // console.log("selected_product:", userDetail?.selected_product);
        return (
            userDetail?.portfolio_info?.find((item) => item.product === 'Workflow AI' && item.member_type === 'owner')
              ? [...userDetail?.userportfolio]
              : [...userDetail?.selected_product?.userportfolio]
        );
    }
);


  const [portfolioRights, setPortfolioRights] = useState('');

  const { handleSubmit, register } = useForm();

  // const onSubmit = (data) => {
  //   /* dispatch(setPro) */
  //   const filteredData = settingProccess[0].children.filter(
  //     (item, index) => index !== 0
  //   );

  //   const payload = filteredData.map((item) => ({
  //     ...item,
  //     column: item.column.map((col) =>
  //       col.type === 'hardcode'
  //         ? col
  //         : { ...col, items: col.items.filter((colItem) => colItem.isSelected) }
  //     ),
  //   }));

  //   const purePayload = payload.map((item) => ({
  //     ...item,
  //     column: item.column.filter((col) => col.items.length !== 0),
  //   }));

    

  //   const createData = {
  //     company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0]?.org_id,
  //     owner_name: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.owner_name : userDetail?.portfolio_info[0]?.owner_name,
  //     username: userDetail?.userinfo?.username,
  //     portfolio_name: 'the portfolio name second',
  //     proccess: purePayload,
  //     created_by: userDetail?.userinfo?.username,
  //     data_type:
  //       userDetail?.portfolio_info?.length > 1
  //         ? userDetail?.portfolio_info.find(
  //             (portfolio) => portfolio.product === productName
  //           )?.data_type
  //         : userDetail?.portfolio_info[0].data_type, 
  //   };

  //   dispatch(createWorkflowSettings(createData));
  // };

  const sortData = (childId, colId, title) => {
    const selectedItems = permissionArray[0].children
      .find((child) => child._id === childId)
      .column.find((col) => col._id === colId)
      .items.filter((item) => item.isSelected);
    let finalItems = [];

    finalItems = selectedItems.map(({ content }) =>
      content.split(' ').join(' ')
    );
    return finalItems;
  };

  const onSubmit = async (isUpdate) => {

  
    const Process = sortData(
      permissionArray[0].children[0]._id,
      permissionArray[0].children[0].column[0]._id,
      'process'
    );
  
    const Documents = sortData(
      permissionArray[0].children[1]._id,
      permissionArray[0].children[1].column[0]._id,
      'documents'
    );
  
    const Templates = sortData(
      permissionArray[0].children[1]._id,
      permissionArray[0].children[1].column[1]._id,
      'templates'
    );
  
    const Workflows = sortData(
      permissionArray[0].children[1]._id,
      permissionArray[0].children[1].column[2]._id,
      'workflows'
    );
  
    const Notarisation = sortData(
      permissionArray[0].children[2]._id,
      permissionArray[0].children[2].column[0]._id,
      'notarisation'
    );
  
    const Folders = sortData(
      permissionArray[0].children[2]._id,
      permissionArray[0].children[2].column[1]._id,
      'folders'
    );
  
    const Records = sortData(
      permissionArray[0].children[2]._id,
      permissionArray[0].children[2].column[2]._id,
      'records'
    );
  
    const References = sortData(
      permissionArray[0].children[3]._id,
      permissionArray[0].children[3].column[0]._id,
      'references'
    );
  
    const Approval_Process = sortData(
      permissionArray[0].children[4]._id,
      permissionArray[0].children[4].column[0]._id,
      'approval_process'
    );
  
    const Evaluation_Process = sortData(
      permissionArray[0].children[5]._id,
      permissionArray[0].children[5].column[0]._id,
      'evaluation_process'
    );
  
    const Reports = sortData(
      permissionArray[0].children[5]._id,
      permissionArray[0].children[5].column[1]._id,
      'reports'
    );
  
    const Management = sortData(
      permissionArray[0].children[6]._id,
      permissionArray[0].children[6].column[0]._id,
      'management'
    );
  
    const Portfolio_Choice = sortData(
      permissionArray[0].children[6]._id,
      permissionArray[0].children[6].column[1]._id,
      'portfolio_choice'
    );

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

    const createData = {
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0]?.org_id,
      owner_name: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.owner_name : userDetail?.portfolio_info[0]?.owner_name,
      username: userDetail?.userinfo?.username,
      portfolio_name: 'the portfolio name second',
      proccess: purePayload,
      created_by: userDetail?.userinfo?.username,
      Process,
      Documents,
      Templates,
      Workflows,
      Notarisation,
      Folders,
      Records,
      References,
      Approval_Process,
      Evaluation_Process,
      Reports,
      Management,
      Portfolio_Choice,
      theme_color: themeColor,
      data_type:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.data_type
          : userDetail?.portfolio_info[0].data_type, 
    };
    dispatch(createWorkflowSettings(createData));
  };

  const handleOnChange = ({ item, title, boxId, type }, e, checkFunc) => {
    const isSelectedItems = setIsSelected({
      items: settingProccess[0].children,
      item,
      boxId,
      title,
      type,
    });
    dispatch(setUpdateProccess(isSelectedItems));

    // if (checkFunc) {
    //   const selectedPort = settingProccess[0].children[0].column[1].items.find(
    //     (item) => item.isSelected
    //   );
    
    // }

    // const lowerCaseTitle = title.toLowerCase();
    // if (lowerCaseTitle === 'portfolios') {   
    //   setCurrentPortfolio(item._id);
    // } else if (lowerCaseTitle === 'teams') {
    
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

  // createWorkflowSettingsItems &&
  //   createWorkflowSettingsItems.length > 0 &&
  //   // console.log('createWorkflowSettingsItems', [
  //     settingProccess[0].children[0],
  //     ...createWorkflowSettingsItems,
  //   ]);


  useEffect(() => {
    const selectedPort = settingProccess[0].children[0].column[1].items.find(
      (item) => item.isSelected
    );
    if (selectedPort)
      setPortfolioRights(
        portfolios.find((port) => port.portfolio_name === selectedPort.content)
          .operations_right
      );
  }, [settingProccess]);

  useEffect(() => {
    if (portfolioRights)
      dispatch(
        setSettingProccess({ 
          payload: !portfolioRights || !Array.isArray(portfolioRights) ? 
            [] 
            : 
          portfolioRights, 
          type: 'rights'
        })
      );
  }, [portfolioRights]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowTeams, teamsInWorkflowAI]);

  useEffect(() => {
    console.log(userPortfolios);
    dispatch(setSettingProccessPortfolios(userPortfolios));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPortfolios]);

  // useEffect(() => {
  
  // });

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
            {isDesktop ? (
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
                          specials={'ep_port'}
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

                    {/* {item.children?.slice(0, 4)?.map((childItem, ind) => (
                    <>
                      {childItem.column.map((colItem) => (
                        <div
                          key={childItem._id}
                          className={workflowAiSettingsStyles.section__box}
                        >
                          <InfoBox
                            key={colItem._id}
                            boxId={childItem._id}
                            register={register}
                            items={colItem.items}
                            title={colItem.proccess_title}
                            onChange={handleOnChange}
                            type={ind === 0 ? 'radio' : 'checkbox'}
                            modPort={ind === 0}
                            specials={ind === 0 ? 'ep_port' : ''}
                          />
                        </div>
                      ))}
                    </>
                  ))} */}

                    {!!item.children
                      .slice(4)[0]
                      .column.find((col) => col.items.length) && (
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
                                specials='ep'
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div
                className={workflowAiSettingsStyles.section__container}
                style={nonDesktopStyles}
              >
                {item.children && (
                  <>
                    {item.children?.slice(0, 4)?.map((childItem, ind) => (
                      <>
                        {childItem.column.map((colItem) => (
                          <div
                            key={colItem._id}
                            className={workflowAiSettingsStyles.section__box}
                          >
                            <InfoBox
                              key={colItem._id}
                              boxId={childItem._id}
                              register={register}
                              items={colItem.items}
                              title={colItem.proccess_title}
                              onChange={handleOnChange}
                              type={ind === 0 ? 'radio' : 'checkbox'}
                              modPort={ind === 0}
                              specials={ind === 0 ? 'ep_port' : ''}
                            />
                          </div>
                        ))}
                      </>
                    ))}
                  </>
                )}
              </div>
            )}

            {!isDesktop && (
              <>
                {!!item.children
                  .slice(4)[0]
                  .column.find((col) => col.items.length) && (
                  <div className='super_container'>
                    <h5>Enabled Processes</h5>

                    <div
                      className={workflowAiSettingsStyles.section__container}
                      style={nonDesktopStyles}
                    >
                      {item.children?.slice(4)?.map((childItem) => (
                        <>
                          {childItem.column.map((colItem) => (
                            <div
                              key={childItem._id}
                              className={workflowAiSettingsStyles.section__box}
                            >
                              <InfoBox
                                key={colItem._id}
                                boxId={childItem._id}
                                register={register}
                                items={colItem.items}
                                title={colItem.proccess_title}
                                onChange={handleOnChange}
                                type='checkbox'
                                specials='ep'
                              />
                            </div>
                          ))}
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
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
