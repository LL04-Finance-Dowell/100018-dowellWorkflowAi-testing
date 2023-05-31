import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HoverCard from '../HoverCard';
import { Button } from '../styledComponents';
import { detailDocument } from '../../../features/document/asyncThunks';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import {
  verifyProcessForUser,
  getVerifiedProcessLink,
} from '../../../services/processServices';
import { setEditorLink } from '../../../features/app/appSlice';

import { useAppContext } from '../../../contexts/AppContext';

import {
  addNewFavoriteForUser,
  deleteFavoriteForUser,
} from '../../../services/favoritesServices';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { moveItemToArchive } from '../../../services/archiveServices';
import { setAllDocuments } from '../../../features/document/documentSlice';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import { extractTokenFromVerificationURL, updateVerificationDataWithTimezone } from '../../../utils/helpers';
import { useTranslation } from 'react-i18next';

const DocumentCard = ({
  cardItem,
  title,
  hideFavoriteIcon,
  hideDeleteIcon,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [dataLoading, setDataLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);

  const {
    favoriteItems,
    addToFavoritesState,
    removeFromFavoritesState,
    setIsNoPointerEvents,
  } = useAppContext();
  const { allDocuments } = useSelector((state) => state.document);

  const handleFavoritess = async (item, actionType) => {
    /*  const data = {
      id,
      type: "document",
    };
    dispatch(handleFavorites(data)); */

    if (actionType === 'add') {
      addToFavoritesState('documents', {
        ...item,
        favourited_by: userDetail?.userinfo?.username,
      });
      try {
        const data = {
          item: {
            _id: item._id,
            company_id: item.company_id,
            document_name: item.document_name,
          },
          item_type: 'document',
          username: userDetail?.userinfo?.username,
        };
        const response = await (await addNewFavoriteForUser(data)).data;
        toast.success(response);
      } catch (error) {
        toast.info('Failed to add document to bookmarks');
        removeFromFavoritesState('documents', item._id);
      }
    }

    if (actionType === 'remove') {
      removeFromFavoritesState('documents', item._id);
      try {
        await (
          await deleteFavoriteForUser(
            item._id,
            'document',
            userDetail?.userinfo?.username
          )
        ).data;
        toast.success('Item removed from bookmarks');
      } catch (error) {
        toast.info('Failed to remove document from bookmarks');
        addToFavoritesState('documents', {
          ...item,
          favourited_by: userDetail?.userinfo?.username,
        });
      }
    }
    // console.log(favoriteItems)
  };

  const handleTrashDocument = async (cardItem) => {
    const copyOfAllDocuments = [...allDocuments];
    const foundDocumentIndex = copyOfAllDocuments.findIndex(
      (item) => item._id === cardItem._id
    );
    if (foundDocumentIndex === -1) return;

    const copyOfDocumentToUpdate = {
      ...copyOfAllDocuments[foundDocumentIndex],
    };
    copyOfDocumentToUpdate.data_type = 'Archive_Data';
    copyOfAllDocuments[foundDocumentIndex] = copyOfDocumentToUpdate;
    dispatch(setAllDocuments(copyOfAllDocuments));

    try {
      const response = await (
        await moveItemToArchive(cardItem._id, 'document')
      ).data;
      toast.success(response);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      copyOfDocumentToUpdate.data_type = 'Real_Data';
      copyOfAllDocuments[foundDocumentIndex] = copyOfDocumentToUpdate;
      dispatch(setAllDocuments(copyOfAllDocuments));
    }
  };

  const handleDetailDocumnet = async (item) => {
    if (dataLoading) return;
    if (item.type === 'sign-document') {
      setDataLoading(true);
      try {
        setIsNoPointerEvents(true);
        const dataToPost = {
          user_name: userDetail?.userinfo?.username,
          // process_id: item.process_id,
        };
        const response = await (
          await getVerifiedProcessLink(item.process_id, dataToPost)
        ).data;

        /*  dispatch(setEditorLink(response)); */
        console.log('responseee', response);
        // setDataLoading(false);
        handleGoToEditor(response);
      } catch (error) {
        console.log(error.response ? error.response.data : error.message);
        setDataLoading(false);
        toast.info(
          error.response.status !== 500
            ? error.response
              ? error.response.data
              : error.message
            : 'Could not get notification link'
        );
      } finally {
        setIsNoPointerEvents(false);
      }
      return;
    }

    const data = {
      document_name: item.document_name,
      document_id: item._id,
    };
    dispatch(detailDocument(data.document_id));
  };

  const handleGoToEditor = async (link) => {
    if (!link) return;
    const token = extractTokenFromVerificationURL(link);
    if (!token) return;

    const dataToPost = {
      token: token,
      user_name: userDetail?.userinfo?.username,
      portfolio: userDetail?.portfolio_info[0]?.portfolio_name,
      city: userDetail?.userinfo?.city,
      country: userDetail?.userinfo?.country,
      continent: userDetail?.userinfo?.timezone?.split('/')[0],
    };

    const sanitizedDataToPost = updateVerificationDataWithTimezone(dataToPost);

    // NEWER VERIFICATION LINKS
    if (link.includes('?') && link.includes('=')) {
      const shortenedLinkToExtractParamsFrom =
        new URL(link).origin + '/' + link.split('verify/')[1]?.split('/')[1];
      const paramsPassed = new URL(shortenedLinkToExtractParamsFrom)
        .searchParams;

      // console.log(paramsPassed);

      const auth_username = paramsPassed.get('username');
      const auth_portfolio = paramsPassed.get('portfolio');
      const auth_role = paramsPassed.get('auth_role');
      const user_type = paramsPassed.get('user_type');
      const org_name = paramsPassed.get('org');

      if (
        auth_username !== userDetail?.userinfo?.username ||
        auth_portfolio !== userDetail?.portfolio_info[0]?.portfolio_name
      ) {
        toast.info('You are not authorized to view this');
        return setDataLoading(false);
      }

      sanitizedDataToPost.auth_username = auth_username;
      sanitizedDataToPost.auth_portfolio = auth_portfolio;
      sanitizedDataToPost.auth_role = auth_role;
      sanitizedDataToPost.user_type = user_type;
      sanitizedDataToPost.org_name = org_name;

      delete sanitizedDataToPost.user_name;
      delete sanitizedDataToPost.portfolio;

      // console.log(sanitizedDataToPost)
      // return setDataLoading(false);
    }

    try {
      const response = await (
        await verifyProcessForUser(sanitizedDataToPost)
      ).data;
      setDataLoading(false);
      dispatch(setEditorLink(response));
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
      setDataLoading(false);
      toast.info(
        err.response
          ? err.response.status === 500
            ? 'Process verification failed'
            : err.response.data
          : 'Process verification failed'
      );
    }
  };

  const FrontSide = () => {
    return (
      <div>{cardItem.document_name ? cardItem.document_name : 'no item'}</div>
    );
  };

  const BackSide = () => {
    return (
      <div>
        {!hideFavoriteIcon && (
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
                favoriteItems.documents.find(
                  (item) => item._id === cardItem._id
                )
                  ? 'remove'
                  : 'add'
              )
            }
          >
            {favoriteItems.documents.find(
              (item) => item._id === cardItem._id
            ) ? (
              <BsFillBookmarkFill />
            ) : (
              <BsBookmark />
            )}
          </div>
        )}
        {cardItem._id ? (
          <Button onClick={() => handleDetailDocumnet(cardItem)}>
            {dataLoading ? (
              <LoadingSpinner />
            ) : cardItem.type === 'sign-document' ? (
              'Sign Here'
            ) : (
              t('Open Document')
            )}
          </Button>
        ) : (
          'no item'
        )}
        {!hideDeleteIcon && (
          <div
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '0',
              bottom: '0',
            }}
            onClick={() => handleTrashDocument(cardItem)}
          >
            <RiDeleteBin6Line color='red' />
          </div>
        )}
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} loading={dataLoading} />;
};

export default DocumentCard;
