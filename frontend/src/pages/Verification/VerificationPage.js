import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/spinner/Spinner";
import { verifyProcess } from "../../services/processServices";
import "./style.css";

const VerificationPage = () => {
    const { token } = useParams();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        
        verifyProcess(token).then(res => {
            setLoading(false);
            window.location = res.data;
        }).catch(err => {
            console.log(err.response ? err.response.data : err.message);
            setLoading(false);
            toast.info("Process verification failed.")
        })
        
    }, [token])

    if (loading) return <div className="workflow__Verification__Page__Container">
        <div className="verification__Spinner__Item">
            <Spinner />
        </div>
    </div>

    return <></>
}

export default VerificationPage;
