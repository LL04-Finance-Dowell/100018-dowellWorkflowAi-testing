import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

const VerificationPage = () => {
    const { token } = useParams();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        
        console.log("Current token: ", token)

        setTimeout(() => setLoading(false), 1500)
        
    }, [token])

    if (loading) return <LoadingSpinner />

    return <>
        Verification page
    </>
}

export default VerificationPage;
