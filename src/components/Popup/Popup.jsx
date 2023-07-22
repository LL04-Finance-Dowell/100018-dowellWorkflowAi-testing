import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import { setPopupIsOpen, setCurrentMessage } from '../../features/app/appSlice'
import { useDispatch, useSelector } from 'react-redux';

const Popup = ({ isOpen, message }) => {
    const dispatch = useDispatch();
    const { popupIsOpen, currentMessage } = useSelector((state) => state.app);


    const onClose = () => {
        dispatch(setPopupIsOpen(false));
    }
    console.log(currentMessage)

    return (
        <div style={{
            background: 'rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(5px)',
            height: '100%',
            width: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            animation: 'fadeIn 0.2s ease-in-out',
            zIndex: 100002,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            <div style={{
                backgroundColor: 'var(--white)',
                width: '50%',
                borderRadius: '10px',
                padding: '5% 2%',
                maxHeight: '30rem',
                position: 'relative'
            }}>

                <div
                    style={{
                        position: 'absolute',
                        top: '1%',
                        right: '2%',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        dispatch(setPopupIsOpen(false));

                    }}
                >

                    <AiOutlineClose />
                </div>

                <h5 style={{ textAlign: "center" }}>{currentMessage}</h5>
            </div>
        </div>

    );
};

export default Popup;
