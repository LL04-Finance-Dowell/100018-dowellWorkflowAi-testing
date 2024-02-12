import React from 'react';
import styles from './themes.module.css';
import workflowAiSettingsStyles from '../workflowAiSettings.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { setThemeColor } from '../../../features/app/appSlice';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';

const Themes = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isDesktop, nonDesktopStyles } = useAppContext();

  const handleSetTheme = (color) => {
    dispatch(setThemeColor(color));
  };

  return (
    <div className={workflowAiSettingsStyles.box}>
      <h2
        className={`${workflowAiSettingsStyles.title} ${workflowAiSettingsStyles.title__m}`}
      >
        {t('Set Colour Theme for Workflow AI')}
      </h2>
      <div
        className={workflowAiSettingsStyles.section__container}
        style={!isDesktop ? nonDesktopStyles : {}}
      >
        {buttons.map((item) => (
          <div key={item.id} className={workflowAiSettingsStyles.section__box}>
            <div
              onClick={() => handleSetTheme(item.color)}
              className={styles.button}
              style={{ backgroundColor: item.color }}
            >
              {t('Select')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Themes;

export const buttons = [
  {
    id: uuidv4(),
    color: '#000',
  },
  {
    id: uuidv4(),
    color: '#7A7A7A',
  },
  {
    id: uuidv4(),
    color: '#003f1b',
  },
  {
    id: uuidv4(),
    color: '#69727d',
  },
  {
    id: uuidv4(),
    color: '#69727d',
  },
  {
    id: uuidv4(),
    color: '#20d3e8',
  },
  {
    id: uuidv4(),
    color: '#fdf144',
  },
  {
    id: uuidv4(),
    color: '#752A2A',
  },
];
