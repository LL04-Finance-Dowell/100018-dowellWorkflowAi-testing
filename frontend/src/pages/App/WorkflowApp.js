import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout"
import { dowellLoginUrl, dowellLogoutUrl } from "../../services/axios";
import "./style.css";

const WorkflowApp = () => {

    const { currentUser } = useUserContext();

    const handleClick = (e, linkToGoTo, runExtraFunction) => {
        e.preventDefault();
        if (runExtraFunction) runExtraFunction();
        window.location.href = linkToGoTo;
    }

    return <>
        <WorkflowLayout>
            <>
                <h1>Hello {currentUser.username}</h1>
                { 
                    currentUser ? 
                    <button><Link to={dowellLogoutUrl} onClick={(e) => handleClick(e, dowellLogoutUrl, () => localStorage.clear("workFlowUser"))}>Logout</Link></button> : 
                    <button><Link to={dowellLoginUrl} onClick={(e) => handleClick(e, dowellLoginUrl)}>Login</Link></button> 
                }    
            </>
        </WorkflowLayout>
    </>
}

export default WorkflowApp;