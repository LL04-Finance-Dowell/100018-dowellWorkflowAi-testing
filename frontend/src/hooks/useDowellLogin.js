import { useEffect } from "react";
import { authAxiosInstance } from "../services/axios";
import { routes } from "../services/routes";
import { useSearchParams } from "react-router-dom";

export default function useDowellLogin ( updateState , updatePageWhenDone ) {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        
        const session_id = searchParams.get("session_id");

        const savedUser = localStorage.getItem("workFlowUser");

        if ((!session_id) && (!savedUser)) return updatePageWhenDone(false);
        
        if ((savedUser) && (!session_id)) {
            updateState(JSON.parse(savedUser));
            return updatePageWhenDone(false);
        }

        authAxiosInstance.post(routes.userProfile, { key: session_id }).then(res => {

            updateState(res.data);
            localStorage.setItem("workFlowUser", JSON.stringify(res.data))
            localStorage.setItem("session_id", session_id)
            updatePageWhenDone(false);

        }).catch(err => {

            localStorage.clear("workFlowUser")
            localStorage.clear("session_id")
            updatePageWhenDone(false);
            return Promise.reject(err);

        })

    }, [])

}