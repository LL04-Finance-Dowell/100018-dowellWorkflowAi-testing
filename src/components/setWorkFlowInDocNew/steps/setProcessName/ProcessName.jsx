import React, { useState } from 'react'
import styles from './ProcessName.module.css'
import { useDispatch, useSelector } from 'react-redux';

import { setProcessName } from '../../../../features/app/appSlice';
const ProcessName = ({Process_title,setProcess_title}) => {
  const dispatch = useDispatch();
  const {  ProcessName } = useSelector((state) => state.app);

   


    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.h2__Doc__Title}>5. {'Process Name'}</h2>
                <div className={styles.box}>
                    <div className={styles.box__inner}>
                        <h3 className={styles.box__header}>
                            {'Provide a name for this Process'}
                        </h3>
                        <input
                            placeholder="Enter Process Name"
                            style={{
                                border: '1px solid grey',
                                width: '100%',
                                color: 'black',
                                outline: 'none',
                                padding: '10px',
                                height: '40px',
                                '::placeholder': {
                                    fontSize: '36px', // Adjust the font size as desired
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
