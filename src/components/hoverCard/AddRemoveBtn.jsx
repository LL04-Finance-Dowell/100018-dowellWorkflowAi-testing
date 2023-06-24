import React from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useAppContext } from '../../contexts/AppContext';

const AddRemoveBtn = ({ type, item }) => {
  const { setShowFoldersActionModal } = useAppContext();
  const handleClick = () => {
    if (type === 'add') {
      setShowFoldersActionModal({
        state: true,
        action: 'add',
        item,
      });
    } else if (type === 'remove') {
      console.log('REMOVE FILE FROM FOLDER');
    }
  };

  return (
    <button
      style={{ background: 'transparent', padding: '5px' }}
      onClick={handleClick}
    >
      {type === 'add' ? (
        <AiOutlinePlus />
      ) : type === 'remove' ? (
        <AiOutlineMinus />
      ) : (
        ''
      )}
    </button>
  );
};

export default AddRemoveBtn;
