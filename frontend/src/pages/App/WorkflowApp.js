import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout"
import { dowellLoginUrl, dowellLogoutUrl } from "../../services/axios";
import { handleAuthenticationBtnClick } from "../../services/common";
import "./style.css";

const WorkflowApp = () => {

    const { currentUser } = useUserContext();

    return <>
        <WorkflowLayout>
            <>
                <h1>Hello {currentUser.username}</h1>
                { 
                    currentUser ? 
                    <button><Link to={dowellLogoutUrl} onClick={(e) => handleAuthenticationBtnClick(e, dowellLogoutUrl, () => localStorage.clear("workFlowUser"))}>Logout</Link></button> : 
                    <button><Link to={dowellLoginUrl} onClick={(e) => handleAuthenticationBtnClick(e, dowellLoginUrl)}>Login</Link></button> 
                }    
            </>
        </WorkflowLayout>
    </>
}

export default WorkflowApp;