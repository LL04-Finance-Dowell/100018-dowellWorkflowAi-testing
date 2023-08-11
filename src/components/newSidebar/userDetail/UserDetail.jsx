import React from 'react';
import styles from './userDetail.module.css';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../utils/helpers';

const UserDetail = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const { creditResponse } = useSelector((state) => state.app);
  console.log(creditResponse?.data?.data?.is_active)

  const { t } = useTranslation();

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
          {creditResponse?.is_active}
        </span>
        <span>
          <span className={styles.title}>{t('Total Credits')}:</span>{' '}
          {creditResponse?.total_credits}
        </span>
      </div>
    </div>
  );
};

export default UserDetail;
