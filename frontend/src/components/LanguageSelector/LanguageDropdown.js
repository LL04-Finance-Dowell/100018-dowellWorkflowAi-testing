import React, { useContext, useState, useEffect } from 'react'
import styles from './LanguageDropdown.module.css'
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const LanguageDropdown = (props) => {
    const [language, setLanguage] = useState(i18next.language);

    useEffect(() => {
        i18next.on("languageChanged", lng => {
            setLanguage(lng);
        });
    }, []);

    const handleLanguageChange = (e) => {
        if (e.target.value !== language) {
            i18next.changeLanguage(e.target.value);
        }
    };

    return (
        <div className={styles.main}>
            <select style={{width:"150px"}} onChange={handleLanguageChange} value={language}>
            <option>Select a language</option>

                <option value="en">English</option>
                <option value="chi">Chinese</option>
                <option value="fr">French</option>
            </select>
        </div>
    );
}
export default LanguageDropdown
