import React from 'react'
import styles from './LanguageDropdown.module.css'

const LanguageDropdown = () => {
    return (
        <div className={styles.main}>
            <select name="languages" id="lang">
            <option value="">Select language</option>
                <option value={"en"}>English</option>
                <option value={"chi"}>Chinese</option>
                <option value={"fr"}>French</option>
            </select>

        </div>
    )
}

export default LanguageDropdown
