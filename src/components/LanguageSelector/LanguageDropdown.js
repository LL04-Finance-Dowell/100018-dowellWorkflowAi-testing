import React, { useState, useEffect } from 'react';
import styles from './LanguageDropdown.module.css';

import i18next from 'i18next';

const LanguageDropdown = (props) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('i18nextLng') || i18next.language
  );

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
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
    <div className={styles.container}>
      <div className={styles.main}>
        <div
          className={styles.LanguageFlx}
          onClick={() => handleLanguageChange('en')}
        >
          <div className={styles.FlagDiv}>
            <img
              height='15px'
              width='20px'
              src='data:image/png;base64,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'
              alt='flg'
            />
          </div>
          <div className={styles.languageDiv}>English</div>
        </div>
        <div
          className={styles.LanguageFlx}
          onClick={() => handleLanguageChange('chi')}
        >
          <div className={styles.FlagDiv}>
            <img
              height='15px'
              width='20px'
              src='data:image/png;base64,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'
              alt='flg'
            />
          </div>
          <div className={styles.languageDiv}>Chinese</div>
        </div>
        <div
          className={styles.LanguageFlx}
          onClick={() => handleLanguageChange('fr')}
        >
          <div className={styles.FlagDiv}>
            <img
              height='15px'
              width='20px'
              src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAARVBMVEX///8AJlPOEScAJlQAFFEAKE0BJVZ2hpjOEiXPAB3TgYTQDyno6OjQECf//f/q6OoGK1gAG1ZsfZDq8O/r7ujPd3vNEyqjTlYkAAABTUlEQVR4nO3TSQ7CMBREQeMwJCTEme9/VCBrtl/IUr0jlLrTNF0iau63eVnLEFPZ9q49ckx9ChE5Ta6PFNWYnl2OMjnqNWmDSHKu2MR3fpi8gqrYpA8iqXQn6TTxHSZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyZMmDBhwoQJEyb/NWkCTcYgkfFjko8gk5ymEJKvybysZYipbHvXRpn0bznrALRzpDS4AAAAAElFTkSuQmCC'
              alt='flg'
            />
          </div>
          <div className={styles.languageDiv}>French</div>
        </div>
        <div
          className={styles.LanguageFlx}
          onClick={() => handleLanguageChange('gr')}
        >
          <div className={styles.FlagDiv}>
            <img
              height='15px'
              width='20px'
              src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAAAElBMVEUAAAD/zgDdAADnAADaAAD/2AAtsSEoAAAA+ElEQVR4nO3QMQGAMAAEsYeCf8tIuI0pkZANAAAAAAAAAAAAAAAAAAAAgB8dwm6CoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKewh7CbsIipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUofMGTNC8HkSxoAAAAASUVORK5CYII='
              alt='flg'
            />
          </div>
          <div className={styles.languageDiv}>German</div>
        </div>
        <div
          className={styles.LanguageFlx}
          onClick={() => handleLanguageChange('sp')}
        >
          <div className={styles.FlagDiv}>
            <img
              height='15px'
              width='20px'
              src='data:image/png;base64,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'
              alt='flg'
            />
          </div>
          <div className={styles.languageDiv}>Spanish</div>
        </div>
      </div>
    </div>
  );
};
export default LanguageDropdown;
