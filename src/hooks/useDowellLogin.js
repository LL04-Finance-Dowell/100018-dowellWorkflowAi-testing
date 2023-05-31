import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { dowellLoginUrl } from '../httpCommon/httpCommon';
import { setId, setSessionId } from '../features/auth/authSlice';
import { getUserInfoOther, getUserInfo } from '../features/auth/asyncThunks';
import { useAppContext } from '../contexts/AppContext';
import { setShowProfileSpinner } from '../features/app/appSlice';

export default function useDowellLogin() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { session_id: localSession, id: localId } = useSelector(
    (state) => state.auth
  );
  const { setIsPublicUser, setPublicUserConfigured } = useAppContext();
  const navigate = useNavigate();

  const extractTokenFromURLAndNavigateToVerificationPage = (url) => {
    dispatch(setShowProfileSpinner(true));

    const [ token, role, userType, username, portfolio, orgName ] = [
      url.split('token~')[1]?.split('~')[0],
      url.split('role~')[1]?.split('~')[0],
      url.split('userType~')[1]?.split('~')[0],
      url.split('username~')[1]?.split('~')[0],
      url.split('portfolio~')[1]?.split('~')[0],
      url.split('org~')[1]?.split('~')[0],
    ]

    if (!token) {
      navigate('/100018-dowellWorkflowAi-testing/');
      dispatch(setShowProfileSpinner(false));
      return;
    }

    window.history.replaceState({}, document.title, "/100018-dowellWorkflowAi-testing/");
    navigate(
      `/verify/${token}/?auth_role=${role}&user_type=${userType}&portfolio=${portfolio}&username=${username}&org=${orgName}`
    )
  }

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    const id = searchParams.get('id');
    const userType = searchParams.get('user_type');

    if (userType && userType === 'public') {
      setIsPublicUser(true);
      return setPublicUserConfigured(true);
    }
    setPublicUserConfigured(true);

    dispatch(setShowProfileSpinner(false));

    if (session_id) {
      // remove session_id and/or id from url
      // window.history.replaceState({}, document.title, "/100018-dowellWorkflowAi-testing/");

      sessionStorage.clear();

      sessionStorage.setItem('session_id', session_id);
      dispatch(setSessionId(session_id));
      if (id || localId) {
        dispatch(setId(id));
        dispatch(getUserInfoOther({ session_id }));
        if (window.location.href.includes('token~')) extractTokenFromURLAndNavigateToVerificationPage(window.location.href);
      } else {
        dispatch(getUserInfo({ session_id }));
        if (window.location.href.includes('token~')) extractTokenFromURLAndNavigateToVerificationPage(window.location.href)
      }
    }
    if (!localSession && !session_id) {
      window.location.replace(dowellLoginUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
