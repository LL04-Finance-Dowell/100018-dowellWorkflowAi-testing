import React, { useState } from 'react';

import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useAppContext } from '../../../contexts/AppContext';
import { detailTemplate } from '../../../features/template/asyncThunks';
import { setAllTemplates } from '../../../features/template/templateSlice';
import { moveItemToArchive } from '../../../services/archiveServices';
import {
  addNewFavoriteForUser,
  deleteFavoriteForUser,
} from '../../../services/favoritesServices';
import HoverCard from '../HoverCard';
import { Button } from '../styledComponents';
import { useTranslation } from 'react-i18next';
import { MdOutlineFiberNew } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { IoIosRefresh } from 'react-icons/io';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import { TemplateServices } from '../../../services/templateServices';
import AddRemoveBtn from '../AddRemoveBtn';

const TemplateCard = ({ cardItem, isFolder, folderId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { favoriteItems, addToFavoritesState, removeFromFavoritesState } =
    useAppContext();
  const { userDetail } = useSelector((state) => state.auth);
  const { allTemplates } = useSelector((state) => state.template);
  const [templateLoading, setTemplateLoading] = useState(false);

  const handleTemplateDetail = (item) => {
    const data = {
      template_id: item._id,
      template_name: item.template_name,
    };

    dispatch(detailTemplate(data.template_id));
  };

  const handleFavoritess = async (item, actionType) => {
    if (actionType === 'add') {
      addToFavoritesState('templates', {
        ...item,
        favourited_by: userDetail?.userinfo?.username,
      });
      try {
        const data = {
          item: {
            _id: item._id,
            company_id: item.company_id,
            template_name: item.template_name,
          },
          item_type: 'template',
          username: userDetail?.userinfo?.username,
        };
        const response = await (await addNewFavoriteForUser(data)).data;
        toast.success(response);
      } catch (error) {
        toast.info('Failed to add template to bookmarks');
        removeFromFavoritesState('templates', item._id);
      }
    }

    if (actionType === 'remove') {
      removeFromFavoritesState('templates', item._id);
      try {
        await (
          await deleteFavoriteForUser(
            item._id,
            'template',
            userDetail?.userinfo?.username
          )
        ).data;
        toast.success('Item removed from bookmarks');
      } catch (error) {
        toast.info('Failed to remove template from bookmarks');
        addToFavoritesState('templates', {
          ...item,
          favourited_by: userDetail?.userinfo?.username,
        });
      }
    }
  };

  const handleTrashTemplate = async (cardItem) => {
    const copyOfAllTemplates = [...allTemplates];
    const foundTemplateIndex = copyOfAllTemplates.findIndex(
      (item) => item._id === cardItem._id
    );
    if (foundTemplateIndex === -1) return;

    const copyOfTemplateToUpdate = {
      ...copyOfAllTemplates[foundTemplateIndex],
    };
    copyOfTemplateToUpdate.data_type = 'Archive_Data';
    copyOfAllTemplates[foundTemplateIndex] = copyOfTemplateToUpdate;
    dispatch(setAllTemplates(copyOfAllTemplates));

    try {
      const response = await (
        await moveItemToArchive(cardItem._id, 'template')
      ).data;
      toast.success(response);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.info(error.response ? error.response.data : error.message);
      copyOfTemplateToUpdate.data_type = 'Real_Data';
      copyOfAllTemplates[foundTemplateIndex] = copyOfTemplateToUpdate;
      dispatch(setAllTemplates(copyOfAllTemplates));
    }
  };

  const handleFetchNewTemplateDetail = async (templateId) => {
    if (templateLoading) return;

    const copyOfAllTemplates = [...allTemplates];
    const foundTemplateIndex = copyOfAllTemplates.findIndex(
      (item) => item._id === templateId
    );

    if (foundTemplateIndex === -1) return;

    setTemplateLoading(true);

    try {
      const templateService = new TemplateServices();
      const response = (await templateService.singleTemplateDetail(templateId))
        .data;

      copyOfAllTemplates[foundTemplateIndex] = response;
      dispatch(setAllTemplates(copyOfAllTemplates));

      setTemplateLoading(false);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.info('Refresh for template failed');
      setTemplateLoading(false);
    }
  };

  const FrontSide = () => {
    return (
      <div>
        {cardItem.newly_created && (
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '0',
              fontSize: '1.5rem',
              color: '#ff0000',
            }}
          >
            <MdOutlineFiberNew />
          </div>
        )}
        {cardItem.template_name ? cardItem.template_name : 'no item'}
      </div>
    );
  };

  const BackSide = () => {
    return (
      <div>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '0',
            top: '0',
          }}
          onClick={() =>
            handleFavoritess(
              cardItem,
              favoriteItems.templates.find((item) => item._id === cardItem._id)
                ? 'remove'
                : 'add'
            )
          }
        >
          {favoriteItems.templates.find((item) => item._id === cardItem._id) ? (
            <BsFillBookmarkFill />
          ) : (
            <BsBookmark />
          )}
        </div>
        {cardItem.template_name ? (
          <Button onClick={() => handleTemplateDetail(cardItem)}>
            {t('Open Template')}
          </Button>
        ) : (
          'no item'
        )}
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '0',
            bottom: '0',
          }}
          onClick={() => handleTrashTemplate(cardItem)}
        >
          <RiDeleteBin6Line color='red' />
        </div>
        {cardItem.newly_created && (
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              id={cardItem._id}
              style={{
                color: '#ff0000',
                fontSize: '1.5rem',
              }}
            >
              <MdOutlineFiberNew />
              <Tooltip
                anchorId={cardItem._id}
                content={
                  'This is a new template. Refresh right here to see its actual title'
                }
                style={{
                  fontStyle: 'normal',
                  fontSize: '0.7rem',
                  width: '8rem',
                  wordWrap: 'break-word',
                }}
              />
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
              onClick={() => handleFetchNewTemplateDetail(cardItem._id)}
            >
              {!templateLoading ? (
                <IoIosRefresh />
              ) : (
                <LoadingSpinner
                  color={'#000'}
                  width={'0.7rem'}
                  height={'0.7rem'}
                />
              )}
            </div>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AddRemoveBtn type={'add'} item={{ ...cardItem, type: 'template' }} />
          {isFolder && (
            <AddRemoveBtn type={'remove'} item={cardItem} folderId={folderId} />
          )}
        </div>
      </div>
    );
  };
  return (
    <HoverCard Front={FrontSide} Back={BackSide} loading={templateLoading} />
  );
};

export default TemplateCard;
