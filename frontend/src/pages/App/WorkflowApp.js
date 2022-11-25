import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout"
import { dowellLoginUrl, dowellLogoutUrl } from "../../services/axios";
import { clearLocalStorageItems, handleAuthenticationBtnClick } from "../../services/common";
import "./style.css";

const WorkflowApp = () => {

    const { currentUser } = useUserContext();

    return <>
        <WorkflowLayout>
            <>
                <h1>Hello {currentUser.username}</h1>
                <div>
                    { 
                        currentUser ? 
                        <button><Link to={dowellLogoutUrl} onClick={(e) => handleAuthenticationBtnClick(e, dowellLogoutUrl, clearLocalStorageItems())}>Logout</Link></button> : 
                        <button><Link to={dowellLoginUrl} onClick={(e) => handleAuthenticationBtnClick(e, dowellLoginUrl)}>Login</Link></button> 
                    }
                </div>
            </>
        </WorkflowLayout>
    </>
}

export default WorkflowApp;