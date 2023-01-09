import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/spinner/Spinner";
import { verifyProcess } from "../../services/processServices";
import "./style.css";

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
        
    }, [token])

    if (loading) return <div className="workflow__Verification__Page__Container">
        <div className="verification__Spinner__Item">
            <Spinner />
        </div>
    </div>

    return <>
        <div className="workflow__Verification__Page__Container" style={{ marginTop: "1rem", marginLeft: "1rem" }}>
            {
                verificationFailed && <>
                    <Link to={"/"}>Go back home</Link>
                </>
            }
        </div>
        
    </>
}

export default VerificationPage;
