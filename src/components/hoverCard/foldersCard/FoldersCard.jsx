import React, { useState, useEffect } from 'react';
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
  const targetTime = new Date();
  const createdTime = new Date();
  const [isFolderNew, setIsFolderNew] = useState(true);

  const handleDelete = (e) => {
    setShowFoldersActionModal({ state: true, action: 'delete' });
    setFolderActionId(cardItem._id);
  };

  const handleEdit = (e) => {
    setShowFoldersActionModal({ state: true, action: 'edit' });
    setFolderActionId(cardItem._id);
  };

  useEffect(() => {
    const [hh, mm, ss] = cardItem.created_on.split(',')[1].split(':');
    createdTime.setHours(Number(hh));
    createdTime.setMinutes(Number(mm));
    createdTime.setSeconds(Number(ss));
    targetTime.setTime(createdTime.getTime() + 3600000 * 5);
  }, [cardItem]);

  useEffect(() => {
    const durationInterval = setInterval(() => {
      targetTime.getTime < new Date().getTime() && setIsFolderNew(false);
    }, 1000);

    return () => clearInterval(durationInterval);
  }, [targetTime]);

  const FrontSide = () => {
    return (
      <div>
        {cardItem.folder_name ? cardItem.folder_name : 'no item'}
        {isFolderNew && (
          <span
            style={{
              position: 'absolute',
              fontWeight: 'bold',
              bottom: '10px',
              left: '10px',
              color: 'green',
              fontSize: '0.8rem',
            }}
          >
            new
          </span>
        )}
      </div>
    );
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

        {isFolderNew && (
          <span
            style={{
              position: 'absolute',
              fontWeight: 'bold',
              bottom: '10px',
              left: '10px',
              color: 'green',
              fontSize: '0.8rem',
            }}
          >
            new
          </span>
        )}

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
