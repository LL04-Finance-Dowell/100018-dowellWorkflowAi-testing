import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/spinner/Spinner';
import { verifyProcessForUser } from '../../services/processServices';
import './style.css';
import dowellLogo from '../../assets/dowell.png';
import { updateVerificationDataWithTimezone } from '../../utils/helpers';
import { useAppContext } from '../../contexts/AppContext';
import { dowellLoginUrl } from '../../httpCommon/httpCommon';

const VerificationPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const { userDetail } = useSelector((state) => state.auth);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const { isPublicUser, publicUserConfigured } = useAppContext();
  const { state } = useLocation();
  const [ dataIsPosting, setDataIsPosting ] = useState(false);

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

      // console.log(paramsPassed);

      const auth_username = paramsPassed.get('username');
      const auth_portfolio = paramsPassed.get('portfolio');
      const auth_role = paramsPassed.get('auth_role');
      const user_type = paramsPassed.get('user_type');
      let auth_users;

      try {
        auth_users = JSON.parse(paramsPassed.getAll('username')[0].replaceAll("'", '"'));        
      } catch (error) {
        auth_users = []
      }

      if (
        !isPublicUser &&
        userDetail &&
        (auth_username !== userDetail?.userinfo?.username ||
          auth_portfolio !== userDetail?.portfolio_info[0]?.portfolio_name) &&
        !state?.routedInternally
      ) {
        toast.info('You are not authorized to view this');
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
        : userDetail?.selected_product?.product_name;

      delete sanitizedDataToPost.user_name;
      delete sanitizedDataToPost.portfolio;

      // console.log(sanitizedDataToPost)
      // return setDataLoading(false);
    }

    if (dataIsPosting) return

    setDataIsPosting(true);

    verifyProcessForUser(sanitizedDataToPost)
      .then((res) => {
        setLoading(false);
        window.location = res.data;
      })
      .catch((err) => {
        console.log(err.response ? err.response.data : err.message);
        setLoading(false);
        setVerificationFailed(true);
        console.log(err);
        toast.info(
          err.response
            ? err.response.status === 500
              ? 'Process verification failed'
              : err.response.data
            : 'Process verification failed'
        );
      });
  }, [token, isPublicUser, userDetail, publicUserConfigured, state, verificationFailed, dataIsPosting]);

  const handleLoginLinkClick = (e) => {
    e.preventDefault();
    window.location.replace(dowellLoginUrl);
  };

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
                <Link to={'/'}>Go back home</Link>
              )}
            </>
          </>
        )}
      </div>
    </>
  );
};

export default VerificationPage;
