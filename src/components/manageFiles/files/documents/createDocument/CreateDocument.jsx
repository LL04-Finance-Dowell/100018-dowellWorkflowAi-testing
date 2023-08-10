import styles from './createDocument.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Overlay from '../../../overlay/Overlay';
import { BsArrowRightShort } from 'react-icons/bs';
import Collapse from '../../../../../layouts/collapse/Collapse';
import { useDispatch, useSelector } from 'react-redux';
import { allTemplates } from '../../../../../features/template/asyncThunks';
import { useEffect } from 'react';
import { createDocument } from '../../../../../features/document/asyncThunks';
import { setToggleManageFileForm } from '../../../../../features/app/appSlice';
import Spinner from '../../../../spinner/Spinner';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateDocument = ({ handleToggleOverlay }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const {creditResponse } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { allTemplates: allTemplatesArray, allTemplatesStatus } = useSelector(
    (state) => state.template
  );
  const [currentOption, setCurrentOption] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const ref = useRef(null);

  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (data) => {
    const { template } = data;

    dispatch(setToggleManageFileForm(false));

    const foundTemplateObj = allTemplatesArray.find(
      (singleTemplate) => singleTemplate._id === template
    );
    if (!foundTemplateObj) return;

    const createDocumentData = {
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
      // template_id: template,
      created_by: userDetail?.userinfo.username,
      data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
      page: foundTemplateObj?.page,
      content: foundTemplateObj?.content,
      portfolio: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find((portfolio) => portfolio.product === productName)?.portfolio_name : userDetail?.portfolio_info[0].portfolio_name,
    };
    const Api_key = creditResponse?.api_key
    axios
    .post(
      `https://100105.pythonanywhere.com/api/v3/process-services/?type=product_service&api_key=${Api_key}`,
      {
        "service_id": "DOWELL10026",
        "sub_service_ids": ["DOWELL100261"],
      },
    )
    .then((response) => {
      console.log(response)
      if (response.data.success == true) {

        dispatch(createDocument(createDocumentData));
      }
    })
    .catch((error) => {
      console.log(error);
      toast.info(error.response?.data?.message)

    });

    
  };

  const handleDropdown = () => {
    setToggleDropdown((prev) => !prev);
    ref.current?.blur();
  };

  const handleOptionClick = (item) => {
    setToggleDropdown(false);
    setCurrentOption(item.template_name);
    setValue('template', item._id);
    ref.current?.focus();
  };

  const handleClickLabel = () => {
    ref.current?.focus();
  };

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
      data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
    };

    dispatch(allTemplates(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Overlay title='Create Document' handleToggleOverlay={handleToggleOverlay}>
      {allTemplatesStatus === 'pending' ? (
        <Spinner />
      ) : allTemplatesArray ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div id='template' className={styles.dropdown__container}>
            <label onClick={handleClickLabel} htmlFor='template'>
              {t('Select Template')} <span>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                required
                className={styles.ghost__input}
                tabIndex={-98}
                {...register('template')}
              >
                {allTemplatesArray.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.template_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              ref={ref}
              type='button'
              onClick={handleDropdown}
              className={`${styles.dropdown__current__option} `}
            >
              {/* {currentOption ? currentOption : "__Template Name__"} */}
              {currentOption ? currentOption : t('__Template Name__')}
            </button>
            <div className={styles.dropdown__option__container}>
              <Collapse open={toggleDropdown}>
                <div role='listbox' className={styles.dropdown__option__box}>
                  {allTemplatesArray.map((item) => (
                    <div
                      onClick={() => handleOptionClick(item)}
                      className={styles.dropdown__option__content}
                    >
                      {item.template_name}
                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
          </div>
          <button type='submit' className={styles.create__button}>
            <span>{t('Go to Editor')}</span>
            <i>
              <BsArrowRightShort size={25} />
            </i>
          </button>
        </form>
      ) : (
        <h4>{t('No Template')}</h4>
      )}
    </Overlay>
  );
};

export default CreateDocument;

export const templates = [
  { id: uuidv4(), option: '__template batu__' },
  { id: uuidv4(), option: '__template batu__' },
  { id: uuidv4(), option: '__template batu__' },
  { id: uuidv4(), option: '__template batu__' },
];
