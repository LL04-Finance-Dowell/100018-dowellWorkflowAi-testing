import { useDispatch, useSelector } from 'react-redux';
import SideBar from '../../components/newSidebar/Sidebar';
import './style.css';
import styles from './workflowLayout.module.css';
import Editor from '../../components/editor/Editor';
import { useEffect, useState } from 'react';
import DowellLogo from '../../assets/dowell.png';
import Spinner from '../../components/spinner/Spinner';
import useCloseElementOnEscapekeyClick from '../../../src/hooks/useCloseElementOnEscapeKeyClick';
import UserDetail from '../../components/newSidebar/userDetail/UserDetail';
import {
  setAdminUser,
  setAdminUserPortfolioLoaded,
  setAllProcesses,
  setLegalAgreePageLoading,
  setProcessesLoaded,
  setProcessesLoading,
  setShowLegalStatusPopup,
  setUserDetailPosition,
} from '../../features/app/appSlice';
import { AiOutlineClose } from 'react-icons/ai';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { formatDateAndTime } from '../../utils/helpers';
import { workflowRegistrationEventId } from '../../services/legalService';
import { AuthServices } from '../../services/authServices';
import { updateUserDetail } from '../../features/auth/authSlice';
import { getAllProcessesV2 } from '../../services/processServices';
import { useAppContext } from '../../contexts/AppContext';
import { WorkflowSettingServices } from '../../services/workflowSettingServices';

const WorkflowLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { userDetail, session_id, id } = useSelector((state) => state.auth);
  const {
    userDetailPosition,
    legalStatusLoading,
    showLegalStatusPopup,
    legalTermsAgreed,
    dateAgreedToLegalStatus,
    legalArgeePageLoading,
    adminUserPortfolioLoaded,
    processesLoaded,
  } = useSelector((state) => state.app);
  const [createNewPortfolioLoading, setCreateNewPortfolioLoading] =
    useState(false);
  const { allDocuments } = useSelector((state) => state.document);
  const { allTemplates } = useSelector((state) => state.template);
  const { allWorkflows } = useSelector((state) => state.workflow);
  const {
    searchItemsStatus,
    setSearchItems,
    updateSearchItemStatus,
    workflowTeamsLoaded,
    setWorkflowTeamsLoaded,
    setWorkflowTeams,
  } = useAppContext();

  const handleClick = () => {
    if (session_id) {
      setCreateNewPortfolioLoading(true);
      sessionStorage.clear();
      window.location.replace(
        `https://100093.pythonanywhere.com/?session_id=${session_id}`
      );
    }
  };

  useCloseElementOnEscapekeyClick(() => setCreateNewPortfolioLoading(false));

  const handleMouseEnter = () => {
    dispatch(setUserDetailPosition(userDetailPosition));
  };

  const handleMouseLeave = () => {
    dispatch(setUserDetailPosition(null));
  };

  const handleAgreeCheckBoxClick = (e) => {
    e.preventDefault();
    dispatch(setLegalAgreePageLoading(true));
    window.location = `https://100087.pythonanywhere.com/legalpolicies/${workflowRegistrationEventId}/website-privacy-policy/policies/?redirect_url=${window.location.origin}/100018-dowellWorkflowAi-testing/%23?id=${id}&session_id=${session_id}`;
  };

  useEffect(() => {
    if (
      !session_id ||
      !userDetail ||
      !userDetail.portfolio_info ||
      userDetail.portfolio_info.length < 1
    )
      return;

    if (!processesLoaded) {
      // Fetching processes
      getAllProcessesV2(userDetail?.portfolio_info[0]?.org_id)
        .then((res) => {
          dispatch(
            setAllProcesses(
              res.data.filter((process) => process.processing_state).reverse()
            )
          );
          dispatch(setProcessesLoading(false));
          dispatch(setProcessesLoaded(true));
        })
        .catch((err) => {
          console.log('Failed: ', err.response);
          dispatch(setProcessesLoading(false));
          console.log('did not fetch processes');
        });
    }

    // ! Fetching workflow teams should be handled in AppContext.js
    // if (!workflowTeamsLoaded) {
    //   // Fetching workflow teams
    //   const settingService = new WorkflowSettingServices();
    //   settingService.getAllTeams(userDetail?.portfolio_info[0]?.org_id).then(res => {
    //     setWorkflowTeams(res.data);
    //     setWorkflowTeamsLoaded(true);
    //   }).catch(err => {
    //     console.log("Failed to fetch teams: ", err.response? err.response.data : err.message);
    //     setWorkflowTeamsLoaded(true);
    //   })
    // }

    const workflowProduct = userDetail?.portfolio_info?.find(
      (item) => item.product === 'Workflow AI'
    );
    if (!workflowProduct || workflowProduct.member_type !== 'owner') return;

    if (adminUserPortfolioLoaded) return;

    // admin user
    dispatch(setAdminUser(true));

    // updating details for owner
    const authService = new AuthServices();
    authService
      .getUserDetail({
        session_id: session_id,
        product: workflowProduct.product,
      })
      .then((res) => {
        // console.log(res.data);
        dispatch(updateUserDetail(res.data));
        dispatch(setAdminUserPortfolioLoaded(true));
      })
      .catch((err) => {
        console.log(
          'Failed to update admin user: ',
          err.response ? err.response.data : err.message
        );
        dispatch(setAdminUserPortfolioLoaded(true));
      });
  }, [session_id, userDetail]);

  useEffect(() => {
    if (
      !allDocuments ||
      !allWorkflows ||
      !allTemplates ||
      allDocuments?.length < 1 ||
      allWorkflows?.length < 1 ||
      allTemplates?.length < 1
    )
      return;

    if (!searchItemsStatus.documentsAdded) {
      setSearchItems((prevItems) => {
        return [...prevItems, ...allDocuments];
      });
      updateSearchItemStatus('documentsAdded', true);
    }

    if (!searchItemsStatus.templatesAdded) {
      setSearchItems((prevItems) => {
        return [...prevItems, ...allTemplates];
      });
      updateSearchItemStatus('templatesAdded', true);
    }

    if (!searchItemsStatus.workflowsAdded) {
      setSearchItems((prevItems) => {
        return [...prevItems, ...allWorkflows];
      });
      updateSearchItemStatus('workflowsAdded', true);
    }
  }, [allDocuments, allTemplates, allWorkflows, searchItemsStatus]);

  return (
    <>
      <div className={styles.container}>
        {userDetail ? (
          !userDetail.portfolio_info ||
          userDetail.portfolio_info?.length === 0 ||
          (userDetail.portfolio_info?.length > 0 &&
            !userDetail.portfolio_info.find(
              (item) => item.product === 'Workflow AI'
            )) ? (
            <div className={styles.redirect__container}>
              <div className={styles.img__container}>
                <img src={DowellLogo} />
              </div>
              <div className={styles.typewriter}>
                <h1>
                  You don't have portfolio,{' '}
                  <span onClick={handleClick}> create here</span>
                </h1>
              </div>
              {createNewPortfolioLoading ? (
                <div className='loading__Spinner__New__Portfolio'>
                  <Spinner />
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <>
              <div className={styles.content__box}>
                <div className={`${styles.sidebar__box} hide-scrollbar`}>
                  <SideBar />
                </div>
                <div className={styles.children__box}>
                  <p className={styles.beta__Info__Text}>
                    You are on the beta version of workflow.ai
                  </p>
                  {children}
                </div>
              </div>
              <Editor />
            </>
          )
        ) : (
          <div style={{ margin: 'auto' }}>
            <Spinner />
          </div>
        )}
        {userDetailPosition && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'fixed',
              zIndex: '10000000',
              top: `${userDetailPosition.top}px`,
              left: `${userDetailPosition.left}px`,
            }}
          >
            <UserDetail />
          </div>
        )}
        {showLegalStatusPopup && (
          <div className={styles.legal__Overlay__Container}>
            <div className={styles.legal__Content__Container}>
              <div
                className={styles.legal__Overlay__Container__Close__Icon}
                onClick={() => dispatch(setShowLegalStatusPopup(false))}
              >
                <AiOutlineClose />
              </div>
              <h3>Agree to terms</h3>
              {legalStatusLoading ? (
                <LoadingSpinner />
              ) : (
                <div className={styles.legal__Content__Form__Container}>
                  {dateAgreedToLegalStatus &&
                    dateAgreedToLegalStatus.length > 1 && (
                      <span className={styles.date__Agreed}>
                        You agreed on:{' '}
                        {formatDateAndTime(dateAgreedToLegalStatus)}
                      </span>
                    )}
                  <label className={styles.legal__Agree}>
                    <input
                      checked={legalTermsAgreed}
                      type='checkbox'
                      onChange={handleAgreeCheckBoxClick}
                    />
                    I agree with the privacy policy and terms and conditions
                  </label>
                  <button
                    disabled={!legalTermsAgreed}
                    className={`${styles.legal__Register__Btn} ${styles.continue__Btn}`}
                    onClick={() => dispatch(setShowLegalStatusPopup(false))}
                  >
                    {'Continue'}
                  </button>
                  {legalArgeePageLoading ? (
                    <div className='loading__Spinner__New__Portfolio abs__Pos'>
                      <Spinner />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkflowLayout;
