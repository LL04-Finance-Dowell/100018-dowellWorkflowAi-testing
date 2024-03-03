// ? Ln 160, 170, 230, 240, used <span> instead of <button> (style conflicts) and <a> (ESLint prompts)
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToggleManageFileForm } from '../../../features/app/appSlice';
import { detailWorkflow } from '../../../features/workflow/asyncTHunks';
import HoverCard from '../HoverCard';

import styles from './workflowCard.module.css';
import { RxUpdate } from 'react-icons/rx';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useAppContext } from '../../../contexts/AppContext';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import {
  addNewFavoriteForUser,
  deleteFavoriteForUser,
} from '../../../services/favoritesServices';

import { moveItemToArchive } from '../../../services/archiveServices';
import { setAllWorkflows } from '../../../features/workflow/workflowsSlice';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../../LoadingScreen/loadingScreen';

const WorkflowCard = ({ cardItem }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { favoriteItems, addToFavoritesState, removeFromFavoritesState } =
    useAppContext();
  const { userDetail } = useSelector((state) => state.auth);
  const { allWorkflows } = useSelector((state) => state.workflow);

  const handleUpdateWorkflow = (item) => {
    dispatch(setToggleManageFileForm(true));

    const data = { workflow_id: item._id };
    dispatch(detailWorkflow(data.workflow_id));
  };

  const handleTrashWorkflow = async (cardItem) => {

    const copyOfAllWorkflows = [...allWorkflows];
    const foundWorkflowIndex = copyOfAllWorkflows.findIndex(
      (item) => item._id === cardItem._id
    );
    if (foundWorkflowIndex === -1) return;

    const copyOfWorkflowToUpdate = {
      ...copyOfAllWorkflows[foundWorkflowIndex],
    };
    const copyOfWorkflowsObj = { ...copyOfWorkflowToUpdate.workflows };
    copyOfWorkflowsObj.data_type = 'Archive_Data';
    copyOfWorkflowToUpdate.workflows = copyOfWorkflowsObj;
    copyOfAllWorkflows[foundWorkflowIndex] = copyOfWorkflowToUpdate;
    dispatch(setAllWorkflows(copyOfAllWorkflows));

    try {
      await removeFromFavoritesState('workflows', cardItem._id);
          await deleteFavoriteForUser(
            cardItem._id,
            'workflow',
            userDetail?.userinfo?.username
          )

      const response = await (
        await moveItemToArchive(cardItem._id, 'workflow')
      ).data;
      toast.success(response);
    } catch (error) {
      // console.log(error.response ? error.response.data : error.message);
      toast.info(
        error.response
          ? error.response.status === 500
            ? 'Workflow archiving failed'
            : error.response.data
          : 'Workflow archiving failed'
      );
      copyOfWorkflowsObj.data_type = 'Real_Data';
      copyOfWorkflowToUpdate.workflows = copyOfWorkflowsObj;
      copyOfAllWorkflows[foundWorkflowIndex] = copyOfWorkflowToUpdate;
      dispatch(setAllWorkflows(copyOfAllWorkflows));
    }
  };

  const handleFavoritess = async (item, actionType) => {
    if (actionType === 'add') {
      addToFavoritesState('workflows', {
        ...item,
        favourited_by: userDetail?.userinfo?.username,
      });
      try {
        const data = {
          item: {
            _id: item._id,
            company_id: item.company_id,
            workflows: item.workflows,
            collection_id: item.collection_id
          },
          item_type: 'workflow',
          username: userDetail?.userinfo?.username,
        };
        const response = await (await addNewFavoriteForUser(data)).data;
        toast.success(response);
      } catch (error) {
        toast.info('Failed to add workflow to bookmarks');
        removeFromFavoritesState('workflows', item._id);
      }
    }

    if (actionType === 'remove') {
      removeFromFavoritesState('workflows', item._id);
      try {
        await (
          await deleteFavoriteForUser(
            item._id,
            'workflow',
            userDetail?.userinfo?.username
          )
        ).data;
        toast.success('Item removed from bookmarks');
      } catch (error) {
        toast.info('Failed to remove workflow from bookmarks');
        addToFavoritesState(
          'workflows',
          JSON.stringify({
            ...item,
            favourited_by: userDetail?.userinfo?.username,
          })
        );
      }
    }
  };

  const FrontSide = () => {
    return (
      <div>
        {typeof cardItem.workflows === 'string'
          ? JSON.parse(cardItem.workflows)?.workflow_title
            ? JSON.parse(cardItem.workflows)?.workflow_title
            : 'no item'
          : cardItem.workflows?.workflow_title
            ? cardItem.workflows?.workflow_title
            : 'no item'}
      </div>
    );
  };

  const BackSide = () => {
    return (
      <div className={styles.back__container}>
        {cardItem.workflows?.workflow_title ? (
          <>
            <>
              <div className={styles.test}>
                <table>
                  <thead>
                    <tr>
                      <th>{t('Step Name')}</th>
                      <th>{t('Role')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardItem.workflows?.steps.map((item) => (
                      <tr key={item._id}>
                        <th>{t(item.step_name)}</th>
                        <th>{item.role}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
            <div className={styles.button__group}>
              <Tooltip id={`delete-${cardItem._id}`} content="Delete Workflow" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
              <span
                anchorId={cardItem._id}
                data-tooltip-id={`delete-${cardItem._id}`}
                style={{ cursor: 'pointer' }}
                className={styles.delete}
                onClick={() => {
                  handleTrashWorkflow(cardItem);
                }}
              >
                <RiDeleteBin6Line color='red' />
              </span>

              <Tooltip id={`update-${cardItem._id}`} content="Update Workflow" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
              <span
                anchorId={cardItem._id}
                data-tooltip-id={`update-${cardItem._id}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleUpdateWorkflow(cardItem);
                }}
                className={styles.update}
              >
                <i>
                  <RxUpdate color='green' />
                </i>
              </span>

              <Tooltip id={`bookmark-${cardItem._id}`} content="Bookmark Workflow" direction="up" arrowSize={10}  style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
              <div
                anchorId={cardItem._id}
                data-tooltip-id={`bookmark-${cardItem._id}`}
                style={{
                  cursor: 'pointer',
                }}
                onClick={() =>
                  handleFavoritess(
                    cardItem,
                    favoriteItems.workflows.find(
                      (item) => item._id === cardItem._id
                    )
                      ? 'remove'
                      : 'add'
                  )
                }
              >
                {favoriteItems.workflows.find(
                  (item) => item._id === cardItem._id
                ) ? (
                  <BsFillBookmarkFill />
                ) : (
                  <BsBookmark />
                )}
              </div>
            </div>
          </>
        ) : typeof cardItem.workflows === 'string' ? (
          <>
            <>
              <div className={styles.test}>
                <table>
                  <thead>
                    <tr>
                      <th>Step Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(cardItem.workflows)?.steps.map((item) => (
                      <tr key={item._id}>
                        <th>{item.step_name}</th>
                        <th>{item.role}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
            <div className={styles.button__group}>
              <span
                style={{ cursor: 'pointer' }}
                className={styles.delete}
                onClick={() => {
                  handleTrashWorkflow(cardItem);
                }}
              >
                <RiDeleteBin6Line color='red' />
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleUpdateWorkflow(cardItem);
                }}
                className={styles.update}
              >
                <i>
                  <RxUpdate color='green' />
                </i>
              </span>
              <div
                style={{
                  cursor: 'pointer',
                }}
                onClick={() =>
                  handleFavoritess(
                    cardItem,
                    favoriteItems.workflows.find(
                      (item) => item._id === cardItem._id
                    )
                      ? 'remove'
                      : 'add'
                  )
                }
              >
                {favoriteItems.workflows.find(
                  (item) => item._id === cardItem._id
                ) ? (
                  <BsFillBookmarkFill />
                ) : (
                  <BsBookmark />
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ margin: 'auto' }}>no item</div>
        )}
      </div>
    );
  };
  return  <HoverCard Front={FrontSide} Back={BackSide} />
};

export default WorkflowCard;
