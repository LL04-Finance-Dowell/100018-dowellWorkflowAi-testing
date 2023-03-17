import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dowellLoginUrl } from "../httpCommon/httpCommon";
import { setId, setSessionId } from "../features/auth/authSlice";
import { getUserInfoOther, getUserInfo } from "../features/auth/asyncThunks";

export default function useDowellLogin() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { session_id: localSession, id: localId } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const id = searchParams.get("id");

    if (session_id) {
      // remove session_id and/or id from url
      window.history.replaceState({}, document.title, "/100018-dowellWorkflowAi-testing/");

      sessionStorage.clear();
      
      sessionStorage.setItem("session_id", session_id);
      dispatch(setSessionId(session_id));
      if (id || localId) {
        dispatch(setId(id));
        dispatch(getUserInfoOther({ session_id }));
      } else {
        dispatch(getUserInfo({ session_id }));
      }
    }
    if (!localSession && !session_id) {
      window.location.replace(dowellLoginUrl);
    }
  }, []);
}
