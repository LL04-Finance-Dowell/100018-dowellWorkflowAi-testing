import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/spinner/Spinner';
import { verifyProcessForUser } from '../../services/processServices';
import './style.css';
import dowellLogo from '../../assets/dowell.png';
import { productName, updateVerificationDataWithTimezone } from '../../utils/helpers';
import { useAppContext } from '../../contexts/AppContext';
import { dowellLoginUrl } from '../../httpCommon/httpCommon';
import { setShowProfileSpinner } from '../../features/app/appSlice';
import { resetUserDetail } from '../../features/auth/authSlice';

const VerificationPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const { userDetail } = useSelector((state) => state.auth);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const { isPublicUser, publicUserConfigured } = useAppContext();
  const [ dataIsPosting, setDataIsPosting ] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(setShowProfileSpinner(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!publicUserConfigured || verificationFailed || (!isPublicUser && !userDetail)) return;
    const dataToPost = {
      token: token,
      user_name: userDetail?.userinfo?.username,
      portfolio: userDetail?.portfolio_info[0]?.portfolio_name,
      city: userDetail?.userinfo?.city,
      country: userDetail?.userinfo?.country,
      continent: userDetail?.userinfo?.timezone?.split('/')[0],
    };

    const sanitizedDataToPost = updateVerificationDataWithTimezone(dataToPost);
    let link_id;

    // NEWER VERIFICATION LINKS
    if (
      window.location.href.includes('?') &&
      window.location.href.includes('=')
    ) {
      const shortenedLinkToExtractParamsFrom =
        new URL(window.location.href).origin +
        '/' +
        window.location.href.split('verify/')[1]?.split('/')[1];
      const paramsPassed = new URL(shortenedLinkToExtractParamsFrom)
        .searchParams;

      

      const auth_username = paramsPassed.get('username');
      const auth_portfolio = paramsPassed.get('portfolio');
      const auth_role = paramsPassed.get('auth_role');
      const user_type = paramsPassed.get('user_type');
      const org_name = paramsPassed.get('org');
      link_id = paramsPassed.get('link_id');

      const currentUserPortfolioName = userDetail?.portfolio_info?.length > 1 ? 
        userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.portfolio_name
        :
      userDetail?.portfolio_info[0]?.portfolio_name;
      let auth_users;

      try {
        auth_users = JSON.parse(paramsPassed.getAll('username')[0].replaceAll("'", '"'));        
      } catch (error) {
        auth_users = [auth_username]
      }

      if (
        !isPublicUser &&
        userDetail &&
        (auth_username !== userDetail?.userinfo?.username)
      ) {
        toast.info('You are not authorized to view this');
        setLoading(false);
        setVerificationFailed(true);
        return;
      }

      if ((auth_username === userDetail?.userinfo?.username) && (auth_portfolio !== currentUserPortfolioName)) {
        toast.info(`Please open this link with ${decodeURIComponent(auth_portfolio)} to access this document`);
        setLoading(false);
        setVerificationFailed(true);
        return;
      }

      sanitizedDataToPost.auth_username = isPublicUser
        ? auth_users
        : auth_username;
      sanitizedDataToPost.auth_portfolio = auth_portfolio;
      sanitizedDataToPost.auth_role = auth_role;
      sanitizedDataToPost.user_type = user_type;
      sanitizedDataToPost.org_name = isPublicUser
        ? 'public'
        : org_name;

      delete sanitizedDataToPost.user_name;
      delete sanitizedDataToPost.portfolio;

      
      // return setDataLoading(false);
    }
    
    if (dataIsPosting) return

    setDataIsPosting(true);
    const processID =  window.location.href.split('verify/')[1]?.split('/')[0]
    verifyProcessForUser(processID,sanitizedDataToPost)
      .then((res) => {
        setLoading(false);
        window.location = 
          isPublicUser ? 
            `${res.data}&link_id=${link_id}`
          : 
            res.data;
      })
      .catch((err) => {
        // console.log(err.response ? err.response.data : err.message);
        setLoading(false);
        setVerificationFailed(true);
        // console.log(err);
        toast.info(
          err.response
            ? err.response.status === 500
              ? 'Process verification failed'
              : err.response.data
            : 'Process verification failed'
        );
      });
  }, [token, isPublicUser, userDetail, publicUserConfigured, verificationFailed, dataIsPosting]);

  const handleLoginLinkClick = (e) => {
    e.preventDefault();
    window.location.replace(dowellLoginUrl);
  };

  const handleHomeLinkClick = (e) => {
    e.preventDefault();

    setLoading(true);
    dispatch(resetUserDetail());

    window.location.replace(
      `https://100014.pythonanywhere.com/?redirect_url=${window.location.origin}/100018-dowellWorkflowAi-testing/%23`
    )
  }

  if (loading)
    return (
      <div className='workflow__Verification__Page__Container__Spinner'>
        <div className='verification__Spinner__Item'>
          <Spinner />
        </div>
      </div>
    );

  return (
    <>
      <div
        className='workflow__Verification__Page__Container'
        style={{ marginTop: '1rem' }}
      >
        {verificationFailed && (
          <>
            <img src={dowellLogo} alt={'workflow logo'} />
            <>
              {isPublicUser ? (
                <Link
                  to={dowellLoginUrl}
                  onClick={handleLoginLinkClick}
                  target='_blank'
                >
                  Go to WorkflowAI
                </Link>
              ) : (
                <Link to={'/'} onClick={handleHomeLinkClick}>Go back home</Link>
              )}
            </>
          </>
        )}
      </div>
    </>
  );
};

export default VerificationPage;
