import { useDispatch, useSelector } from "react-redux";
import { setShowApiKeyFetchFailureModal } from "../../features/app/appSlice";
import styles from './styles.module.css';
import { AiOutlineClose } from "react-icons/ai";


const ApiKeyFailureModal = () => {
    const { 
        apiKeyFetchFailureMessage,
    } = useSelector((state) => state.app);
    const dispatch = useDispatch();

    return <>
        <div className={styles.content__Container}>
            <div
                className={styles.content__Container__Close__Icon}
                onClick={() => dispatch(setShowApiKeyFetchFailureModal(false))}
            >
                <AiOutlineClose />
            </div>
              <h3>{'Please note'}</h3>
              <p className={styles.message}>{apiKeyFetchFailureMessage}</p>
        </div>
    </>
}

export default ApiKeyFailureModal;