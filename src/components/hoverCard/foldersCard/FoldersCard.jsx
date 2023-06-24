import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Button } from '../styledComponents';
import { useTranslation } from 'react-i18next';
import { RiDeleteBin6Line } from 'react-icons/ri';
import HoverCard from '../HoverCard';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';

const FoldersCard = ({ cardItem }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setShowFoldersActionModal, setFolderActionId } = useAppContext();

  const handleDelete = (e) => {
    // console.log('DELETE THIS FOLDER!!!: ');
  };

  const handleEdit = (e) => {
    setShowFoldersActionModal({ state: true, action: 'edit' });
    setFolderActionId(cardItem._id);
  };

  const FrontSide = () => {
    return <div>{cardItem.folder_name ? cardItem.folder_name : 'no item'}</div>;
  };

  const BackSide = () => {
    return (
      <div>
        <button
          style={{
            background: 'transparent',
            position: 'absolute',
            left: '5px',
            top: '0',
            color: 'var(--e-global-color-text)',
          }}
          onClick={handleEdit}
        >
          <FaEdit />
        </button>

        {cardItem._id ? (
          <Button onClick={() => navigate(`/folders/${cardItem._id}`)}>
            {t('Open')}
          </Button>
        ) : (
          'no item'
        )}

        <button
          style={{
            position: 'absolute',
            right: '5px',
            bottom: '5px',
            background: 'transparent',
          }}
          onClick={handleDelete}
        >
          <RiDeleteBin6Line color='red' />
        </button>
      </div>
    );
  };

  return <HoverCard Front={FrontSide} Back={BackSide} isFolder={true} />;
};

export default FoldersCard;
