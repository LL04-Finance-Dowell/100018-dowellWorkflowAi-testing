import styles from './manageFiles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate } from '../../features/template/asyncThunks';
import {
  setCurrentWorkflow,
  setToggleFileForm,
} from '../../features/app/appSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productName } from '../../utils/helpers';

const ManageFiles = ({
  title,
  children,
  OverlayComp,
  contentBoxClassName,
  removePageSuffix,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { userDetail } = useSelector((state) => state.auth);
  const { toggleManageFileForm } = useSelector((state) => state.app);

  const handleToggleOverlay = () => {
    if (OverlayComp) {
      dispatch(setToggleManageFileForm(!toggleManageFileForm));
      dispatch(setCurrentWorkflow(null));
    } else {
      if (title.toLowerCase() === 'template') {
        const data = {
          created_by: userDetail?.userinfo.username,
          company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
          data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
          portfolio: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find((portfolio) => portfolio.product === productName)?.portfolio_name : userDetail?.portfolio_info[0].portfolio_name,
        };
        dispatch(createTemplate(data));
      }
      if (title.toLowerCase() === 'proccess') {
        navigate('/workflows/new-set-workflow');
      }
    }
  };

  return (
    <div className={styles.container}>
      {OverlayComp && toggleManageFileForm && (
        <OverlayComp handleToggleOverlay={handleToggleOverlay} />
      )}
      <h2 className={styles.page__header}>
        {' '}
        {t(title)} {removePageSuffix ? '' : t('Page')}{' '}
      </h2>
      <div
        className={`${styles.content__box} ${
          contentBoxClassName ? contentBoxClassName : ''
        }`}
      >
        {/*   <div>
          <h2 className={styles.header}>New {title}</h2>
          <div
            onClick={handleToggleOverlay}
            className={styles.add__Form__toggle}
          >
            <i>
              <BsPlusLg cursor="pointer" size={25} />
            </i>
            <h2>Add {title}</h2>
          </div>
        </div> */}
        {children}
      </div>
    </div>
  );
};

export default ManageFiles;
