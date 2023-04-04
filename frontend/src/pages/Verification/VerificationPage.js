import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/spinner/Spinner";
import { verifyProcessForUser } from "../../services/processServices";
import "./style.css";
import { timeZoneToCountryObj } from "../../utils/timezonesObj";
import dowellLogo from "../../assets/dowell.png";
import { updateVerificationDataWithTimezone } from "../../utils/helpers";

const VerificationPage = () => {
    const { token } = useParams();
    const [ loading, setLoading ] = useState(true);
    const { userDetail } = useSelector(state => state.auth);
    const [ verificationFailed, setVerificationFailed ] = useState(false);

    useEffect(() => {
        const dataToPost = {
            token: token,
            user_name: userDetail?.userinfo?.username,
            portfolio: userDetail?.portfolio_info[0]?.portfolio_name,
            city: userDetail?.userinfo?.city,
            country: userDetail?.userinfo?.country,
            continent: userDetail?.userinfo?.timezone?.split("/")[0],
        }

        const sanitizedDataToPost = updateVerificationDataWithTimezone(dataToPost);

        // NEWER VERIFICATION LINKS
        if (window.location.href.includes('?') && window.location.href.includes('=')) {
            const shortenedLinkToExtractParamsFrom = new URL(window.location.href).origin + "/" + window.location.href.split("verify/")[1]?.split("/")[1];
            const paramsPassed = new URL(shortenedLinkToExtractParamsFrom).searchParams;
            
            // console.log(paramsPassed);
    
            const auth_username = paramsPassed.get('auth_user');
            const auth_portfolio = paramsPassed.get('auth_portfolio');
            const auth_role = paramsPassed.get('auth_role');
    
            if (auth_username !== userDetail?.userinfo?.username || auth_portfolio !== userDetail?.portfolio_info[0]?.portfolio_name) {
                toast.info("You are not authorized to view this");
                setLoading(false);
                setVerificationFailed(true);
                return;
            }
    
            sanitizedDataToPost.auth_username = auth_username;
            sanitizedDataToPost.auth_portfolio = auth_portfolio;      
            sanitizedDataToPost.auth_role = auth_role;
            
            delete sanitizedDataToPost.user_name;
            delete sanitizedDataToPost.portfolio;
    
            // console.log(sanitizedDataToPost)
            // return setDataLoading(false);
        }
  
        verifyProcessForUser(sanitizedDataToPost).then(res => {
            setLoading(false);
            window.location = res.data;
        }).catch(err => {
            console.log(err.response ? err.response.data : err.message);
            setLoading(false);
            setVerificationFailed(true);
            console.log(err)
            toast.info(err.response ? err.response.status === 500 ? "Process verification failed" : err.response.data : "Process verification failed")
        })
        
    }, [token])

    if (loading) return <div className="workflow__Verification__Page__Container__Spinner">
        <div className="verification__Spinner__Item">
            <Spinner />
        </div>
    </div>

    return <>
        <div className="workflow__Verification__Page__Container" style={{ marginTop: "1rem" }}>
            {
                verificationFailed && <>
                    <img src={dowellLogo} alt={"workflow logo"} />
                    <Link to={"/"}>Go back home</Link>
                </>
            }
        </div>
        
    </>
}

export default VerificationPage;
