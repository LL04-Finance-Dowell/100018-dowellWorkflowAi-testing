import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { FaTimes } from 'react-icons/fa';
import './nameChangeModal.css';
import { toast } from 'react-toastify';

const NameChangeModal = () => {
  const { setOpenNameChangeModal, setProcessDisplayName, nameChangeTitle } =
    useAppContext();
  const [name, setName] = useState('');

  const handleSetName = (e) => {
    e.preventDefault();
    if (name) {
      toast.success('Name set successfully');
      setProcessDisplayName(name);
      setOpenNameChangeModal(false);
    } else toast.warn('Name field is empty!');
  };
  return (
    <section className='name_change_sect'>
      <div className='wrapper'>
        <h3 className='heading'>
          Custom {nameChangeTitle}' Name{' '}
          <button
            className='close_btn'
            onClick={(e) => setOpenNameChangeModal(false)}
          >
            <FaTimes />
          </button>
        </h3>

        <form className='input_wrapper'>
          <input
            type='text'
            placeholder='Enter custom name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className='done_btn' type='submit' onClick={handleSetName}>
            Set Name
          </button>
        </form>
      </div>
    </section>
  );
};

export default NameChangeModal;
