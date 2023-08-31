import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorLink } from '../../features/app/appSlice';

import { AiOutlineClose } from 'react-icons/ai';
import styles from './editor.module.css';
import Spinner from '../spinner/Spinner';
import { TiTick } from 'react-icons/ti';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const Editor = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
                <iframe title='uni_iframe' src={editorLink}>
                  {t('inside editoerr')}
                </iframe>
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
                  {t('Do you want to close?')}
                  <br />
                  <span className={styles.decision__mini__text}>
                    {t('Save your work before closing')}
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
