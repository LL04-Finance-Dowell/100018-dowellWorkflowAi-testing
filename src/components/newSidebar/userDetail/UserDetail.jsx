import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import styles from './userDetail.module.css';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { productName } from '../../../utils/helpers';

const UserDetail = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isBuyButtonHovered, setIsBuyButtonHovered] = useState(false);

  const { userDetail } = useSelector((state) => state.auth);
  const { creditResponse } = useSelector((state) => state.app);

  const { t } = useTranslation();

  const handleMouseEnter = () => {
    setIsButtonHovered(true);
  };

  const handleMouseLeave = () => {
  };

  const handleBuyMouseEnter = () => {
    setIsBuyButtonHovered(true);
  };

  const handleBuyMouseLeave = () => {
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.info__box}>
        <span>
          <span className={styles.title}>{t('Member Type')}:</span>{' '}
          {userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.member_type : userDetail.portfolio_info[0].member_type}
        </span>
        <span>
          <span className={styles.title}>{t('Portfolio Name')}:</span>{' '}
          {userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.portfolio_name : userDetail.portfolio_info[0].portfolio_name}
        </span>
        <span>
          <span className={styles.title}>{t('Username')}:</span>{' '}
          {userDetail?.userinfo?.username}
        </span>
        <span>
          <span className={styles.title}>{t('Data type')}:</span>{' '}
          {userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail.portfolio_info[0].data_type}
        </span>
        <span>
          <span className={styles.title}>{t('Operation Rights')}:</span>{' '}
          {userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.operations_right : userDetail.portfolio_info[0].operations_right}
        </span>
        <span>
          <span className={styles.title}>{t('Role')}:</span>{' '}
          {userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.role : userDetail.portfolio_info[0].role}
        </span>
        <span>
          <span className={styles.title}>{t('Organization Name')}:</span>{' '}
          {userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_name : userDetail.portfolio_info[0].org_name}
        </span>
        <span>
          <span className={styles.title}>{t('Is Active')}:</span>{' '}
          {creditResponse?.is_active ? 'Active' : <>
            <button 
            className={styles.activate__button} 
            onClick={handleActivateWorkspace}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => handleMouseLeave(setIsButtonHovered(false))}
            style={{
              marginLeft: 'auto',
              border: '1px solid green',
              padding: '5px 10px',  // Adjusted padding for smaller size
              cursor: 'pointer',
              fontSize: '10px',  // Adjusted font size for smaller size
              borderRadius: '50%',
              backgroundColor: isButtonHovered ? 'lightgreen' : 'transparent',
            }}
            >Activate Workspace</button>
          </>}
        </span>

        <span>
          <span className={styles.title}>{t('Total Credits')}:</span>{' '}
          {creditResponse?.total_credits !== 0 ? (
            creditResponse?.total_credits
          ) : (
            <button
              onClick={handleBuyCredits}
              onMouseEnter={handleBuyMouseEnter}
              onMouseLeave={() => handleBuyMouseLeave(setIsBuyButtonHovered(false))}
              style={{
                marginLeft: 'auto',
                border: '1px solid green',
                padding: '5px 10px',  // Adjusted padding for smaller size
                cursor: 'pointer',
                fontSize: '10px',  // Adjusted font size for smaller size
                borderRadius: '50%',
                backgroundColor: isBuyButtonHovered ? 'lightgreen' : 'transparent',
              }}
            >
              Buy Credits
            </button>
          )}
        </span>

        {/* <span>
          <span className={styles.title}>{t('Total Credits')}:</span>{' '}
          {creditResponse?.total_credits || 0}
        </span> */}

        {/* Display the "Activate Workspace" button when creditResponse is not active */}

      </div>
    </div>
  );
};

export default UserDetail;
