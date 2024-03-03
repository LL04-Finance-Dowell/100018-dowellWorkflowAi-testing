import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth_expo_url, dowellLoginUrl } from '../httpCommon/httpCommon';
import { setId, setSessionId, updateUserDetail } from '../features/auth/authSlice';
import { getUserInfoOther, getUserInfo } from '../features/auth/asyncThunks';
import { useAppContext } from '../contexts/AppContext';
import { setShowProfileSpinner } from '../features/app/appSlice';
import { AuthServices } from '../services/authServices';
import { toast } from 'react-toastify';
import { productName } from '../utils/helpers';

export default function useDowellLogin() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { session_id: localSession, id: localId } = useSelector(
    (state) => state.auth
  );
  const { setIsPublicUser, setPublicUserConfigured } = useAppContext();
  const navigate = useNavigate();

  const handleUnauthorizedVerificationAccess = (passedUserDetail, passedSessionId, passedId=null, authorizedPortfolioName=null) => {
    /**
     * Handles unauthorized access to a document verification link.
     * 
     * @param passedUserDetail An object containing user login details.
     * @param passedSessionId The session_id for the current logged-in user.
     * @param passedId The organization id for the current logged-in user.
     * 
     */
    toast.info(
      authorizedPortfolioName ? 
      `Please open this link with ${decodeURIComponent(authorizedPortfolioName)} to access this document` : 
      'You are not authorized to view this'
    );
    dispatch(setShowProfileSpinner(false));
    dispatch(updateUserDetail(passedUserDetail));
    
    if (passedId) {
      navigate(`/?session_id=${passedSessionId}&id=${passedId}`)
      // window.history.replaceState({}, document.title, "/100018-dowellWorkflowAi-testing/");
      return
    }

    navigate(`/?session_id=${passedSessionId}`);
    // window.history.replaceState({}, document.title, "/100018-dowellWorkflowAi-testing/");
  }

  const extractTokenFromURLAndNavigateToVerificationPage = (url, session_id, id=null, detailsConfigured=false) => {
    /**
     * Handles routing to a document verification link within the application.
     * 
     * @param url The document verification link.
     * @param session_id The session_id for the current logged-in user.
     * @param id The organization id for the current logged-in user.
     * @param detailsConfigured boolean specifying whether or not the user portfolio details is present.
     * 
     */

    dispatch(setShowProfileSpinner(true));

    // extracting key values from the url
    const [ token, role, userType, username, portfolio, orgName, product ] = [
      url.split('token~')[1]?.split('~')[0],
      url.split('role~')[1]?.split('~')[0],
      url.split('userType~')[1]?.split('~')[0],
      url.split('username~')[1]?.split('~')[0],
      url.split('portfolio~')[1]?.split('~')[0],
      url.split('org~')[1]?.split('~')[0],
      url.split('product~')[1]?.split('~')[0],
    ]

    if (!token) {
      dispatch(setShowProfileSpinner(false));
      navigate(`/?session_id=${session_id}`)
      // window.history.replaceState({}, document.title, "/100018-dowellWorkflowAi-testing/");
      return;
    }

    if (detailsConfigured) {
      const authServices = new AuthServices();
      
      authServices.getUserDetailOtherAsync({ session_id: session_id, product: product }).then(res => {
        const fetchedUserDetails = res.data;

        window.sessionStorage.setItem("userDetail", JSON.stringify(fetchedUserDetails));
        dispatch(updateUserDetail(fetchedUserDetails));

        const userPortfolioName = fetchedUserDetails?.portfolio_info?.length > 1 ? 
          fetchedUserDetails?.portfolio_info.find(portfolio => portfolio.product === productName)?.portfolio_name
          :
        fetchedUserDetails?.portfolio_info[0]?.portfolio_name;

        // confirming the user's portfolio matches
        if (portfolio !== userPortfolioName) {
          handleUnauthorizedVerificationAccess(fetchedUserDetails, session_id, id, portfolio);
          return
        }

        window.history.replaceState({}, document.title, "/100018-dowellWorkflowAi-testing/");
        navigate(
          `/verify/${token}/?auth_role=${role}&user_type=${userType}&portfolio=${portfolio}&username=${username}&org=${orgName}&product=${encodeURIComponent(product)}`
        )

      }).catch(error => {
        // console.log(error);
      })

      return
    }

    const authServices = new AuthServices();

    authServices.getUserDetailAsync({ session_id }).then(res => {
      const fetchedUserDetails = res.data;

      window.sessionStorage.setItem("userDetail", JSON.stringify(fetchedUserDetails));
      
      // confirming the user's username matches
      if (fetchedUserDetails?.userinfo?.username !== username) {
        handleUnauthorizedVerificationAccess(fetchedUserDetails, session_id);
        return
      }

      window.location.replace(
        `${auth_expo_url}/exportfolio?session_id=${session_id}&org=${orgName}&product=${encodeURIComponent(product)}&portfolio=${portfolio}&username=${username}&redirect_url=${window.location.origin}/100018-dowellWorkflowAi-testing/%23token~${token}~role~${role}~userType~${userType}~portfolio~${portfolio}~username~${username}~org~${orgName}~product~${product}~userDetailsConfigured~`
      )
      return

    }).catch(error => {
      // console.log(error);
    })
  }

  const extractImportProcessIdFromURLAndNavigate = (url) => {
    /**
     * Handles routing to the process import page.
     * 
     * @param url The sanitized process import link.
     * 
     */

    // extracting the process id from the url
    const [ processId ] = [
      url.split('importProcessId~')[1]?.split('~')[0],
    ]

    return navigate(`/processes/process-import/${processId}`)
  }

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    const id = searchParams.get('id');
    const userType = searchParams.get('user_type');
    const currentLocation = window.location.href;

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
        if (currentLocation.includes('token~') && currentLocation.includes('userDetailsConfigured~')) return extractTokenFromURLAndNavigateToVerificationPage(currentLocation, session_id, id, true)
        dispatch(getUserInfoOther({ session_id }));
      } else {
        if (currentLocation.includes('token~') && !currentLocation.includes('userDetailsConfigured~')) return extractTokenFromURLAndNavigateToVerificationPage(currentLocation, session_id)
        dispatch(getUserInfo({ session_id, product: 'Workflow AI' }));
      }

      // FOR PROCESS IMPORTS
      if (currentLocation.includes('importProcessId~')) {
        extractImportProcessIdFromURLAndNavigate(currentLocation);
      }
    }
    if (!localSession && !session_id) {
      window.location.replace(dowellLoginUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
