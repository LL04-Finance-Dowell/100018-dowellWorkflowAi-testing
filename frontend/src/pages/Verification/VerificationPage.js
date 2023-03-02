import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/spinner/Spinner";
import { verifyProcess } from "../../services/processServices";
import "./style.css";
import { timeZoneToCountryObj } from "../../utils/timezonesObj";
import dowellLogo from "../../assets/dowell.png";

const VerificationPage = () => {
    const { token } = useParams();
    const [ loading, setLoading ] = useState(true);
    const { userDetail } = useSelector(state => state.auth);
    const [ verificationFailed, setVerificationFailed ] = useState(false);
    const [ newLocationNeeded, setNewLocationNeeded ] = useState(false);
    const [ newLocationObject, setNewLocationObject ] = useState(null);

    useEffect(() => {
        const dataToPost = {
            token: token,
            user_name: userDetail?.userinfo?.username,
            portfolio: userDetail?.portfolio_info[0]?.portfolio_name,
            city: newLocationNeeded ? newLocationObject?.city : userDetail?.userinfo?.city,
            country: newLocationNeeded ? newLocationObject?.country : userDetail?.userinfo?.country,
            continent: newLocationNeeded ? newLocationObject?.continent : userDetail?.userinfo?.timezone?.split("/")[0],
        }

        if (!dataToPost.continent || !dataToPost.continent?.length < 1 || !dataToPost.city || dataToPost.city?.length < 1 || !dataToPost.country || dataToPost.country?.length < 1) {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setNewLocationObject({
                city: userTimezone.split("/")[1],
                country: timeZoneToCountryObj[userTimezone] ? timeZoneToCountryObj[userTimezone] : "Not available",
                continent: userTimezone.split("/")[0]
            })
            return setNewLocationNeeded(true)
        }

        verifyProcess(dataToPost).then(res => {
            setLoading(false);
            window.location = res.data;
        }).catch(err => {
            console.log(err.response ? err.response.data : err.message);
            setLoading(false);
            setVerificationFailed(true);
            console.log(err)
            toast.info(err.response ? err.response.status === 500 ? "Process verification failed" : err.response.data : "Process verification failed")
        })
        
    }, [token, newLocationNeeded])

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
