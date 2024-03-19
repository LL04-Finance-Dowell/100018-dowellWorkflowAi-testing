import React, { useState } from 'react'
import styles from './ProcessName.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
const ProcessName = ({ Process_title, setProcess_title }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { ProcessName } = useSelector((state) => state.processes);

//     // console.log('Language:', i18n.language);
//     const translationKey = 'Process Name';
// // console.log(t(translationKey));

    // const [, forceUpdate] = useState();
    // React.useEffect(() => {
    //     forceUpdate(prevState => !prevState);
    //   }, [i18n.language]);

    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.h2__Doc__Title}>5. {t("Process Name")}</h2>
                <div className={styles.box}>
                    <div className={styles.box__inner}>
                        <h3 className={styles.box__header}>
                            {t('Provide a name for this Process')}
                        </h3>
                        <input
                            required={true}
                            placeholder="Enter Process Name"
                            style={{
                                border: '1px solid grey',
                                width: '100%',
                                color: 'black',
                                outline: 'none',
                                padding: '10px',
                                height: '40px',
                                '::placeholder': {
                                    fontSize: '36px', 
                                    color: 'grey',

                                },
                            }}
                            value={Process_title}
                            onChange={(e) => setProcess_title(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProcessName
