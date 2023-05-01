import React, { useContext, useState, useEffect } from 'react'
import styles from './LanguageDropdown.module.css'
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const LanguageDropdown = (props) => {
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || i18next.language);

  useEffect(() => {
    i18next.on("languageChanged", lng => {
      setLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    });
  }, []);

  useEffect(() => {
    i18next.changeLanguage(language);
  }, []);  

  const handleLanguageChange = (lang) => {
    if (lang !== language) {
      i18next.changeLanguage(lang);
    }
  };

  return (
    <div  className={styles.container}>
    <div className={styles.main}>
      <div 
        className={styles.languageDiv}
        onClick={() => handleLanguageChange('en')}
      >
        English
      </div>
      <div 
        className={styles.languageDiv}
        onClick={() => handleLanguageChange('chi')}
      >
        Chinese
      </div>  
      <div 
        className={styles.languageDiv}
        onClick={() => handleLanguageChange('fr')}
      >
        French
      </div>
      <div 
        className={styles.languageDiv}
        onClick={() => handleLanguageChange('gr')}
      >
        German
      </div>
      <div 
        className={styles.languageDiv}
        onClick={() => handleLanguageChange('sp')}
      >
        Spanish
      </div>
    </div>
    </div>
  );
}
export default LanguageDropdown