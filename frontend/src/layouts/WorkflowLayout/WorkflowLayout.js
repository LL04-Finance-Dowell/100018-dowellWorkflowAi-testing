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
import { AiOutlineClose } from 'react-icons/ai';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosCloseCircle } from 'react-icons/io';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import Chat from '../../components/Chat/Chat';
import ProcessDetail from '../../components/manageFiles/ProcessDetail/ProcessDetail';
import { formatDateAndTime, productName } from '../../utils/helpers';
import { workflowRegistrationEventId } from '../../services/legalService';
import { AuthServices } from '../../services/authServices';
import { updateUserDetail } from '../../features/auth/authSlice';
import { getAllProcessesV2 } from '../../services/processServices';
import { useAppContext } from '../../contexts/AppContext';
import FoldersModal from '../../pages/Folders/modals/FoldersModal';

import { useTranslation } from 'react-i18next';

import LanguageDropdown from '../../components/LanguageSelector/LanguageDropdown';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setAllProcesses, setProcessesLoaded, setProcessesLoading } from '../../features/processes/processesSlice';
import { setAdminUser, setAdminUserPortfolioLoaded, setLanguageSelectPosition, setLegalAgreePageLoading, setShowLegalStatusPopup, setUserDetailPosition } from '../../features/app/appSlice';

const WorkflowLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { workflowTeams, isDesktop, nonDesktopStyles, isMobile } =
    useAppContext();

  const { userDetail, session_id, id } = useSelector((state) => state.auth);
  const {
    userDetailPosition,
    languageSelectPosition,
    legalStatusLoading,
    showLegalStatusPopup,
    legalTermsAgreed,
    dateAgreedToLegalStatus,
    legalArgeePageLoading,
    adminUserPortfolioLoaded,
    ShowProfileSpinner,
    temLoading
  } = useSelector((state) => state.app);
  const {
    processesLoaded,
  } = useSelector((state) => state.processes);

  const [createNewPortfolioLoading, setCreateNewPortfolioLoading] =
    useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { allDocuments } = useSelector((state) => state.document);
  const { allTemplates } = useSelector((state) => state.template);
  const { allWorkflows } = useSelector((state) => state.workflow);
  const { searchItemsStatus, setSearchItems, updateSearchItemStatus,demoTemplates,fetchDemoTemplates, demoDocuments, fetchDemoDocuments } =
    useAppContext();

  const [showUserDetail, setShowUserDetail] = useState(false);

  
  ///credits
  const { creditResponse } = useSelector((state) => state.app);
  const handleActivateWorkspace = () => {
    // Assuming you have the API key stored in a variable apiKey
    const apiKey = creditResponse.api_key;

    // API endpoint
    const endpoint = `https://100105.pythonanywhere.com/api/v3/user/?type=activate_key&api_key=${apiKey}`;
    // Make the API call to activate the workspace using Axios
    axios
      .post(endpoint)
      .then((response) => {
        toast.success(response.data);
      })
      .catch((error) => {
        toast.error('Error activating workspace:', error);
      });
      
  };
  const handleBuyCredits = () => {
    window.open('https://ll05-ai-dowell.github.io/100105-DowellApiKeySystem/', '_blank');
  };

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

  const handleMouseEnter = (e) => {
  //   const top = e.target.getBoundingClientRect().top;
  //   const left = e.target.getBoundingClientRect().left + 25;

  //   dispatch(
  //     setUserDetailPosition({
  //       top,
  //       left,
  //     })
  //   );

    // console.log(userDetailPosition)
    dispatch(setUserDetailPosition(userDetailPosition));
  };

  const handleMouseLeave = () => {
    dispatch(setUserDetailPosition(null));
  };
  const HandleLanBtnClk = () => {
    dispatch(setLanguageSelectPosition(languageSelectPosition));
  };
  const handleLanClose = () => {
    dispatch(setLanguageSelectPosition(null));
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
      const [userCompanyId, userPortfolioDataType] = [
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
          : userDetail?.portfolio_info[0]?.org_id,
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.data_type
          : userDetail?.portfolio_info[0]?.data_type,
      ];
      // Fetching processes
      getAllProcessesV2(userCompanyId, userPortfolioDataType)
        .then((res) => {
          const savedProcessesInLocalStorage = JSON.parse(
            localStorage.getItem('user-saved-processes')
          );
          if (savedProcessesInLocalStorage) {
            const processes = [
              ...savedProcessesInLocalStorage,
              ...res.data.filter((process) => process.processing_state),
            ].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
            dispatch(setAllProcesses(processes));
          } else {
            dispatch(
              setAllProcesses(
                res.data.filter((process) => process.processing_state).reverse()
              )
            );
          }
          dispatch(setProcessesLoading(false));
          dispatch(setProcessesLoaded(true));
        })
        .catch((err) => {
          dispatch(setProcessesLoading(false));
        });
    }

    const workflowProduct = userDetail?.portfolio_info?.find(
      (item) => item.product === 'Workflow AI' &&
        item.member_type === 'owner'
    );

    if (
      !workflowProduct ||
      adminUserPortfolioLoaded
    )
      return;

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
        // console.log("res.datamubeen", res.data)
        dispatch(updateUserDetail(res.data));
        dispatch(setAdminUserPortfolioLoaded(true));
      })
      .catch((err) => {
        // console.log(
        //   'Failed to update admin user: ',
        //   err.response ? err.response.data : err.message
        // );
        dispatch(setAdminUserPortfolioLoaded(true));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (!demoTemplates) {
        fetchDemoTemplates();
      }
      // // console.log('the demoTemplates in layout are ', demoTemplates)
      if(demoTemplates !== null){
        setSearchItems((prevItems) => {
          return [...prevItems, ...demoTemplates];
        });
      }

      if (!demoDocuments) fetchDemoDocuments();
      if(demoDocuments !== null){
        setSearchItems((prevItems) => {
          return [...prevItems, ...demoDocuments];
        });
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDocuments, allTemplates, allWorkflows, searchItemsStatus, demoTemplates]);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <>
      <div className={styles.container}>
        {userDetail ? (
          !userDetail.portfolio_info ||
          userDetail.portfolio_info?.length === 0 ||
          (userDetail.portfolio_info?.length > 0 &&
            !id &&
            !userDetail.portfolio_info.find(
              (item) => item.product === 'Workflow AI' &&
                item.member_type === 'owner'
            )) ? (
            <div className={styles.redirect__container}>
              <div className={styles.img__container}>
                <img alt='' src={DowellLogo} />
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
                {isMobile ? (
                  <>
                    <div
                      className={`${styles.sidebar__box} hide-scrollbar`}
                      style={{ display: isSidebarOpen ? 'block' : 'none' }}
                    >
                      <SideBar toggleSidebar={toggleSidebar} isMobile={true} />
                    </div>
                    <div
                      style={{ position: 'fixed', top: 4, left: 4, zIndex: 2 }}
                    >
                      {isSidebarOpen ? (
                        <IoIosCloseCircle size={40} onClick={toggleSidebar} />
                      ) : (
                        <RxHamburgerMenu
                          color='black'
                          size={30}
                          onClick={toggleSidebar}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className={`${styles.sidebar__box} hide-scrollbar`}>
                    <SideBar toggleSidebar={toggleSidebar} isMobile={false} />
                  </div>
                )}

                <div className={styles.children__box}>
                <p className={styles.beta__Info__Text}>
                    {t("You are on the beta version of workflow.ai")}
                  </p>
                  {
                    creditResponse?.is_active == false   || creditResponse?.total_credits < 100 ?
                    <p className={styles.workflow_check}>
                    <span>
                      {
                         creditResponse?.is_active == false ? <>
                         <span className={styles.title}>{t('Activate your Workflow AI')}:</span>{' '}
                         <button 
                          className={styles.activate__button} 
                          onClick={handleActivateWorkspace}
                          
                          style={{
                            marginLeft: 'auto',
                            border: '1px solid green',
                            padding: '5px 10px',  // Adjusted padding for smaller size
                            cursor: 'pointer',
                            fontSize: '10px',  // Adjusted font size for smaller size
                            // borderRadius: '50%',
                            backgroundColor:'green',
                            color:'white',
                            marginRight:"10px",
                            borderRadius:'6px'
                          }}
                          >Activate Workspace</button>
                         </> :<></>
                      }
                    </span>

                    <span>
                      {
                        creditResponse?.total_credits < 100 ? <>
                        <span className={styles.title}>{t('Your Credits are very low')}:</span>{' '}
                        <button
                          onClick={handleBuyCredits}
                          style={{
                            marginLeft: 'auto',
                            border: '1px solid green',
                            padding: '5px 10px',  // Adjusted padding for smaller size
                            cursor: 'pointer',
                            fontSize: '10px',  // Adjusted font size for smaller size
                            backgroundColor:'green',
                            color:'white',
                            borderRadius:'6px'
                          }}
                        >
                          Buy Credits
                        </button>
                        </>:<></>
                      }
                    </span>
                  </p> : <></>
                  }
                 
                  {children}
                </div>
                <div className={styles.chat_container}>
                <Chat />
                </div>
              </div>
              <div className={styles.editor_container}>
              <Editor />
              </div>
             
            </>
          )
        ) : (
          <div style={{ margin: 'auto' }}>
            <Spinner />
          </div>
        )}

        {/* ////////// */}

        {languageSelectPosition && (
          <div
            onClick={HandleLanBtnClk}
            onMouseLeave={handleLanClose}
            style={{
              position: 'fixed',
              zIndex: '10000000',
              top: `${languageSelectPosition.top}px`,
              left: `${languageSelectPosition.left}px`,
            }}
          >
            <LanguageDropdown />
          </div>
        )}
        {/* /////////// */}
        {userDetailPosition && (
          <div
            onMouseOver={(e) => handleMouseEnter(e)}
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
              <h3>{t('Agree to terms')}</h3>
              {legalStatusLoading ? (
                <LoadingSpinner />
              ) : (
                <div className={styles.legal__Content__Form__Container}>
                  {dateAgreedToLegalStatus &&
                    dateAgreedToLegalStatus.length > 1 && (
                      <span className={styles.date__Agreed}>
                        {t('You agreed on')}:{' '}
                        {formatDateAndTime(dateAgreedToLegalStatus)}
                      </span>
                    )}
                  <label className={styles.legal__Agree}>
                    <input
                      checked={legalTermsAgreed}
                      type='checkbox'
                      onChange={handleAgreeCheckBoxClick}
                    />
                    {t(
                      'I agree with the privacy policy and terms and conditions'
                    )}
                  </label>
                  <button
                    disabled={!legalTermsAgreed}
                    className={`${styles.legal__Register__Btn} ${styles.continue__Btn}`}
                    onClick={() => dispatch(setShowLegalStatusPopup(false))}
                  >
                    {t('Continue')}
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

      <FoldersModal />
      
      {ShowProfileSpinner && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.2s ease-in-out',
            zIndex: 99999,
            overflow: 'hidden',
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            position: 'fixed',
            top: '0%',
            left: '0%',
          }}
        >
          <Spinner />
        </div>
      )}
      {/* {temLoading && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.2s ease-in-out',
            zIndex: 99999,
            overflow: 'hidden',
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            position: 'fixed',
            top: '0%',
            left: '0%',
          }}
        >
          <Spinner />
        </div>
      )} */}
    </>
  );
};

export default WorkflowLayout;
