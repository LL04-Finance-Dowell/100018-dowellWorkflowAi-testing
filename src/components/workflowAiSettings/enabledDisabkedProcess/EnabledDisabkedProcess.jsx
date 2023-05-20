import React, { useState, useEffect } from 'react';
import workflowAiSettingsStyles from '../workflowAiSettings.module.css';
import { useForm } from 'react-hook-form';
import SubmitButton from '../../submitButton/SubmitButton';
import InfoBox from '../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';
import {
  setColumn,
  setPermissionArray,
  setSettingProccess,
  setFetchedPermissionArray,
} from '../../../features/app/appSlice';
import { v4 as uuidv4 } from 'uuid';
import { setIsSelected } from '../../../utils/helpers';
import { WorkflowSettingServices } from '../../../services/workflowSettingServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';

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
  const { workflowSettings } = useAppContext();

  const sortData = (childId, colId, title) => {
    const selectedItems = permissionArray[0].children
      .find((child) => child._id === childId)
      .column.find((col) => col._id === colId)
      .items.filter((item) => item.isSelected);
    let finalItems = [];

    // switch (title) {
    //   case 'process':
    //     finalItems = selectedItems.map(({ content }) => {
    //       const modContent = content
    //         .split(' (')
    //         .splice(0, 1)
    //         .join('')
    //         .split(' ');
    //       return modContent[0] === 'Portfolio/Team'
    //         ? 'Portfolio_or_Team_Roles'
    //         : modContent.join(' ');
    //     });
    //     break;

    //   case 'reports':
    //     finalItems = selectedItems
    //       .map(({ content }) => content.split(' '))
    //       .map((items) => items.filter((item) => item !== '/').join(' '));
    //     break;

    //   // ! Only delete if it is utterly useless
    //   // case 'references':
    //   //   finalItems = selectedItems
    //   //     .map(({ content }) => content.split(' '))
    //   //     .map((items) => items.find((item) => item === items[4]))
    //   //     .map((item) => `Show ${item} ID`);
    //   //   break;

    //   default:
    //     finalItems = selectedItems.map(({ content }) =>
    //       content.split(' ').join(' ')
    //     );
    // }
    finalItems = selectedItems.map(({ content }) =>
      content.split(' ').join(' ')
    );
    // return finalItems.map((item) => item.replace('/', 'or'));
    return finalItems;
  };

  const onSubmit = async () => {
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
      company_id: userDetail?.portfolio_info[0].org_id,
      created_by: userDetail?.userinfo.username,
      data_type: userDetail?.portfolio_info[0].data_type,
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
      wf_setting_id: workflowSettings[0]._id,
    };

    // console.log('payload: ', data);
    try {
      setIsUpdating(true);
      await workflowSettingServices.updateWorkflowAISettings(data);
      toast.success('Updated successfully');
    } catch (e) {
      console.log(e);
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }

    // console.log('cplımnnnnnnnnn', column);
    // dispatch(setSettingProccess({ _id: uuidv4(), column }));
  };

  const handleOnChange = ({ item, title, boxId, type }) => {
    const isSelectedItems = setIsSelected({
      items: permissionArray[0].children,
      item,
      title,
      boxId,
      type,
    });

    // console.log('selected Items: ', isSelectedItems);
    // console.log('item: ', item);
    // console.log('title: ', title);
    // console.log('bId: ', boxId);

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
    if (workflowSettings) {
      let tempItems = [];
      for (let key in workflowSettings[0]) {
        if (
          typeof workflowSettings[0][key] !== 'string' &&
          workflowSettings[0][key].length
        ) {
          tempItems.push({
            title: key.replace('_', ' '),
            content: workflowSettings[0][key],
          });
        } else if (key === 'theme_color') {
          tempItems.push({ title: key, content: workflowSettings[0][key] });
        }
      }
      setFetchedItems(tempItems);
    }
  }, [workflowSettings]);

  useEffect(() => {
    if (fetchedItems.length) {
      let rawItems = [];
      permissionArray[0].children.forEach((child) => {
        child.column.forEach((col) => {
          fetchedItems.forEach(({ title, content }) => {
            if (
              title === col.proccess_title ||
              (title === 'Process' && col.proccess_title === 'Processes') ||
              (title === 'Portfolio Choice' &&
                col.proccess_title === 'Portfolio/Team Roles')
            ) {
              col.items.forEach((item) => {
                content.forEach((fItem) => {
                  if (fItem === item.content)
                    rawItems.push({
                      _id: item._id,
                      content: item.content,
                      title:
                        title === 'Process'
                          ? 'Processes'
                          : title === 'Portfolio Choice'
                          ? 'Portfolio/Team Roles'
                          : title,
                      boxId: child._id,
                    });
                });
              });
            }
          });
        });
      });

      // console.log('rawItems: ', rawItems);

      dispatch(setFetchedPermissionArray(rawItems));
    }
  }, [fetchedItems]);

  // useEffect(
  //   () => {
  //     console.log('perm arr: ', permissionArray);
  //     console.log('wrkf settings: ', workflowSettings);
  //   }
  // );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={workflowAiSettingsStyles.form__cont}
    >
      {permissionArray.map((item) => (
        <div key={item._id} className={workflowAiSettingsStyles.box}>
          <h2
            className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
          >
            {t(item.title)}
          </h2>
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
                  />
                ))}
              </div>
            ))}
          </div>
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
