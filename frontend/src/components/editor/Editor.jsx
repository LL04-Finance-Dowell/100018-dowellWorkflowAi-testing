import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorLink } from '../../features/app/appSlice';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './editor.module.css';
import Spinner from '../spinner/Spinner';
import { TiTick } from 'react-icons/ti';
import { MdClose } from 'react-icons/md';

const Editor = () => {
  const dispatch = useDispatch();
  const { editorLink } = useSelector((state) => state.app);
  const { editorStatus: docStatus } = useSelector((state) => state.document);
  const { editorStatus: tempStatus } = useSelector((state) => state.template);
  const [toggleDecision, setToggleDecision] = useState(false);

  const handleFrameClose = () => {
    setToggleDecision(true);
  };

  const handleDecision = (status) => {
    if (status === 'ok') {
      dispatch(setEditorLink(null));
      /*  window.location.reload(); */
    }
    setToggleDecision(false);
  };

  return (
    <>
      {(editorLink || docStatus === 'pending' || tempStatus === 'pending') && (
        <div className={styles.framer__container}>
          {docStatus === 'pending' || tempStatus === 'pending' ? (
            <Spinner />
          ) : (
            editorLink && (
              <div className={styles.framer__box}>
                <iframe src={editorLink}>inside editoerr</iframe>
                <i onClick={handleFrameClose}>
                  <AiOutlineClose size={30} />
                </i>
              </div>
            )
          )}
          {toggleDecision && (
            <div className={styles.decision__container}>
              <div className={styles.decision__box}>
                <h2>
                  Do you want to close?
                  <br />
                  <span className={styles.decision__mini__text}>
                    Save your work before closing
                  </span>
                </h2>
                <div className={styles.button__container}>
                  <button
                    className={styles.ok__button}
                    onClick={() => handleDecision('ok')}
                  >
                    <TiTick size={25} />
                  </button>
                  <button
                    className={styles.cancel__button}
                    onClick={() => handleDecision('cancel')}
                  >
                    <MdClose size={25} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Editor;

{
  /* <div>
<iframe
  className={styles.framer__box}
  src="https://ll04-finance-dowell.github.io/100058-dowelleditor/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9kdWN0X25hbWUiOiJ3b3JrZmxvd2FpIiwiZGV0YWlscyI6eyJfaWQiOiI2MzhjZDQyMzBjOWM1ZDYwZDA4Y2RmYTUiLCJhY3Rpb24iOiJkb2N1bWVudCIsImZpZWxkIjoiZG9jdW1lbnRfbmFtZSIsImNsdXN0ZXIiOiJEb2N1bWVudHMiLCJkYXRhYmFzZSI6IkRvY3VtZW50YXRpb24iLCJjb2xsZWN0aW9uIjoiZWRpdG9yIiwiZG9jdW1lbnQiOiJlZGl0b3IiLCJ0ZWFtX21lbWJlcl9JRCI6IjEwMDA4NDAwNiIsImZ1bmN0aW9uX0lEIjoiQUJDREUiLCJjb21tYW5kIjoidXBkYXRlIiwidXBkYXRlX2ZpZWxkIjp7ImRvY3VtZW50X25hbWUiOiIiLCJjb250ZW50IjoiIn19fQ.WgllCRep9Mo02-2t2zjtktyYNKciOHCeVyOf9tji-vk"
>
  inside editoerr
</iframe>
<i onClick={handleFrameClose}>
  <AiOutlineClose size={30} />
</i>
</div> */
}
