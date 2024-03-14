import React, { useState, useEffect } from 'react';
import workflowAiSettingsStyles from '../workflowAiSettings.module.css';
import { useForm } from 'react-hook-form';
import SubmitButton from '../../submitButton/SubmitButton';
import InfoBox from '../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';
import { productName, setIsSelected } from '../../../utils/helpers';
import { WorkflowSettingServices } from '../../../services/workflowSettingServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';
import { setPermissionArray, setThemeColor } from '../../../features/app/appSlice';
import { setColumn, setSettingProccess } from '../../../features/processes/processesSlice';

const EnabledDisabkedProcess = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [fetchedItems, setFetchedItems] = useState([]);

  const { column, permissionArray, themeColor } = useSelector(
    (state) => state.app
  );
  const { handleSubmit, register } = useForm();
  const { userDetail } = useSelector((state) => state.auth);
  const workflowSettingServices = new WorkflowSettingServices();
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    workflowSettings,
    processDisplayName,
    setOpenNameChangeModal,
    setNameChangeTitle,
    setProcessDisplayName,
    isDesktop,
    nonDesktopStyles,
  } = useAppContext();
  const [itemId, setItemId] = useState('');
  const [childId, setChildId] = useState('');
  const [colTitle, setColTitle] = useState('');

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

  const onSubmit = async () => {
 
    console.log("userDetail", userDetail)
 
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

    const data = {
      _id: workflowSettings?._id || "6447a3449224dc414b404ec5",
      company_id:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
          : userDetail?.portfolio_info[0].org_id,
      created_by: userDetail?.userinfo.username,
      data_type:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.data_type
          : userDetail?.portfolio_info[0].data_type,
      eventId: workflowSettings?.eventId || "FB1010000000000000000000003004",
      created_on: workflowSettings?.created_on || "25:04:2023,09:47:22",
      created_at: workflowSettings?.created_at || "12:09:2023,11:26:17",
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
      theme_color: themeColor
    };

    try {
      // console.log(data)
      setIsUpdating(true);
      await workflowSettingServices.updateWorkflowAISettings(data);
      setThemeColor(data.theme_color);
      toast.success('Updated successfully');
    } catch (e) {
      // console.log(e);
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOnChange = ({ item, title, boxId, type, checker }) => {
    const isSelectedItems = setIsSelected({
      items: permissionArray[0].children,
      item,
      title,
      boxId,
      type,
    });

    if (checker && !item.isSelected) {
      setItemId(item._id);
      setChildId(boxId);
      setColTitle(title);
      setOpenNameChangeModal(true);
      setNameChangeTitle(item.content.split('(')[0].trim());
    }

    dispatch(setPermissionArray(isSelectedItems));

    const ccb = column.find((c) => c.proccess_title === title);

    if (ccb) {
      dispatch(
        setColumn(
          column.map((col) =>
            col.proccess_title === title
              ? {
                  ...col,
                  items: col.items.find(
                    (childItem) => childItem._id === item._id
                  )
                    ? col.items.filter(
                        (childItem) => childItem._id !== item._id
                      )
                    : [
                        ...col.items,
                        {
                          _id: item._id,
                          content: item.content,
                          isSelected: false,
                        },
                      ],
                }
              : col
          )
        )
      );
    } else {
      dispatch(
        setColumn([
          ...column,
          {
            _id: uuidv4(),
            items: [
              { _id: item._id, content: item.content, isSelected: false },
            ],
            proccess_title: title,
            order: item.order,
          },
        ])
      );
    }
  };

  useEffect(() => {
    if (processDisplayName && itemId && childId && colTitle) {
      const modPermArr = permissionArray[0].children.map((child) =>
        childId === child._id
          ? {
              ...child,
              column: child.column.map((col) =>
                col.proccess_title === colTitle
                  ? {
                      ...col,
                      items: col.items.map((colItem) =>
                        colItem._id === itemId
                          ? {
                              ...colItem,
                              content: colItem.content.replace(
                                colItem.content.split(' (')[1].slice(0, -1),
                                processDisplayName
                              ),
                            }
                          : colItem
                      ),
                    }
                  : col
              ),
            }
          : child
      );
      dispatch(setPermissionArray(modPermArr));
      setProcessDisplayName('');
      setItemId('');
      setChildId('');
      setColTitle('');
    }
  }, [processDisplayName, itemId, childId, colTitle]);

  useEffect(() => {
    dispatch(
      setSettingProccess({
        payload: permissionArray[0].children[0].column[0].items,
        type: 'p_title',
      })
    );

    dispatch(
      setSettingProccess({
        type: 'docs',
        payload: permissionArray[0].children[1].column[0].items.filter(
          (item) => item.isSelected
        ),
      })
    );

    dispatch(
      setSettingProccess({
        type: 'temps',
        payload: permissionArray[0].children[1].column[1].items.filter(
          (item) => item.isSelected
        ),
      })
    );

    dispatch(
      setSettingProccess({
        type: 'wrkfs',
        payload: permissionArray[0].children[1].column[2].items.filter(
          (item) => item.isSelected
        ),
      })
    );

    dispatch(
      setSettingProccess({
        type: 'nota',
        payload: permissionArray[0].children[2].column[0].items.filter(
          (item) => item.isSelected
        ),
      })
    );

    dispatch(
      setSettingProccess({
        type: 'recs',
        payload: permissionArray[0].children[2].column[2].items.filter(
          (item) => item.isSelected
        ),
      })
    );

    dispatch(
      setSettingProccess({
        type: 'app',
        payload: permissionArray[0].children[4].column[0].items.filter(
          (item) => item.isSelected
        ),
      })
    );

    dispatch(
      setSettingProccess({
        type: 'eval',
        payload: permissionArray[0].children[5].column[0].items.filter(
          (item) => item.isSelected
        ),
      })
    );

    dispatch(
      setSettingProccess({
        type: 'reps',
        payload: permissionArray[0].children[5].column[1].items.filter(
          (item) => item.isSelected
        ),
      })
    );
  }, [permissionArray]);


  // useEffect(() => {
  //   // console.log('perm Arr: ', permissionArray);
  // }, [permissionArray]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={workflowAiSettingsStyles.form__cont}
    >
      {permissionArray.map((item, ind) => (
        <div key={item._id} className={workflowAiSettingsStyles.box}>
          <h2
            className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
          >
            {t(item.title)}
          </h2>
          {isDesktop ? (
            <div className={workflowAiSettingsStyles.section__container}>
              {item.children?.map((childItem) => (
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
                      checker={colItem.proccess_title === 'Processes'}
                      specials='edp'
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={workflowAiSettingsStyles.section__container}
              style={!isDesktop ? nonDesktopStyles : {}}
            >
              {item.children?.map((childItem) => (
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
                        type='checkbox'
                        checker={colItem.proccess_title === 'Processes'}
                        specials='edp'
                      />
                    </div>
                  ))}
                </>
              ))}
            </div>
          )}
        </div>
      ))}

      <SubmitButton
        className={workflowAiSettingsStyles.submit__button}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating' : 'Update Enable/Disable Processes'}
      </SubmitButton>
    </form>
  );
};

export default EnabledDisabkedProcess;
