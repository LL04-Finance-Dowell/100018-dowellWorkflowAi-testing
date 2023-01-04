import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { verifyProcess } from "../../services/processServices";

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

    if (loading) return <LoadingSpinner width={"3rem"} height={"3rem"} />

    return <></>
}

export default VerificationPage;
