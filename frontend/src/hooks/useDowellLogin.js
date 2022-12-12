import { useEffect } from "react";
import { authAxiosInstance } from "../services/axios";
import { routes } from "../services/routes";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getUserInfo } from "../features/app/asyncThunks";
import { dowellLoginUrl } from "../httpCommon/httpCommon";
import { setSessionId } from "../features/auth/authSlice";
import { getUserInfoOther } from "../features/auth/asyncThunks";
import axios from "axios";

export default function useDowellLogin(/* updateState, updatePageWhenDone */) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { session_id: localSession } = useSelector((state) => state.auth);

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const id = searchParams.get("id");

    console.log("wwwwwwwwwwwwwwwwwwwwwwwwww", session_id);

    if (session_id) {
      localStorage.setItem("session_id", session_id);
      dispatch(setSessionId(session_id));
      dispatch(getCurrentUser({ key: session_id }));
      if (id) {
        dispatch(getUserInfoOther({ session_id }));
      } else {
        dispatch(getUserInfo({ session_id }));
      }
    }

    if (!localSession) {
      window.location.replace(dowellLoginUrl);
    }

    /* authAxiosInstance
      .post(routes.userProfile, { key: session_id })
      .then((res) => {
        updateState(res.data);
        dispatch(getUserInfo({ session_id }));
        localStorage.setItem("workFlowUser", JSON.stringify(res.data));
        localStorage.setItem("session_id", session_id);
        updatePageWhenDone(false);
      })
      .catch((err) => {
        localStorage.clear("workFlowUser");
        localStorage.clear("session_id");
        updatePageWhenDone(false);
        return Promise.reject(err);
      }); */
  }, [localSession]);
}
