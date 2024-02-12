import { AiOutlineClose, AiOutlineSave } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import styles from './style.module.css';
import { useState } from 'react';


const SaveConfimationModal = ({ handleSaveBtnClick, handleCloseBtnClick, inputValue, handleInputChange }) => {

    const  [ pageNumber, setPageNumber ] = useState(1);

    const handleItemClick = (functionToRun) => {
        setPageNumber(1);
        if (typeof functionToRun === 'function') functionToRun();
    }

    return <div className={styles.save__Process__Modal__Overlay}>
        <div className={styles.save__Process__Modal__Container}>
            <div className={styles.save__Process__Modal__Close__Icon} onClick={() => handleItemClick(handleCloseBtnClick)}>
                <AiOutlineClose />
            </div>
            <div className={styles.save__Process__Modal__Items}>
                <AiOutlineSave className={styles.bg__Save__Icon} />
                {
                    pageNumber === 2 && <>
                        <div className={styles.go__Back__Btn} onClick={() => setPageNumber(1)}>
                            <BiArrowBack />
                            <span>Go back</span>
                        </div>
                    </>
                }
                <h4>
                    {
                        pageNumber === 1 ? "Save process" :
                        pageNumber === 2 ? "Enter a title for your process" :
                        <></>
                    }    
                </h4>
                {
                    pageNumber === 1 ? <>
                        <p>
                            This process will be saved locally on your browser. Please note the following:
                            <ul>
                                <li>You will not be able to access this saved process on another browser.</li>
                                <li>This saved process will be lost if your browser is uninstalled and reinstalled again.</li>
                                <li>This saved process will be lost if you clear the cookies or sites data for this website.</li>
                            </ul>
                        </p>
                    </> :
                    pageNumber === 2 ? <>
                        <p>
                            Please note this title will be changed when you perform other actions on this process.
                        </p>
                        <input 
                            className={styles.process__Input} 
                            type='text' 
                            placeholder='Enter process title' 
                            onChange={({ target }) => handleInputChange(target.value)} 
                            value={inputValue}
                        />
                    </> : <></>
                }
                
                <div className={styles.save__Btns__Container}>
                    <button onClick={() => handleItemClick(handleCloseBtnClick)}>Cancel</button>
                    {
                        pageNumber === 1 ?
                        <button className={styles.green__Btn} onClick={() => setPageNumber(pageNumber + 1)}>Continue</button> :
                        pageNumber === 2 ?
                        <button disabled={inputValue.length < 1 ? true : false} className={styles.green__Btn} onClick={() => handleItemClick(handleSaveBtnClick)}>Save</button> :
                        <></>
                    }
                </div>
            </div>
        </div>
    </div>
}

export default SaveConfimationModal;