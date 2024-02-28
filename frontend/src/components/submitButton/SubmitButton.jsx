import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

import { useTranslation } from 'react-i18next';

const SubmitButton = ({
  children,
  status,
  className = '',
  type,
  onClick,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={!!type ? onClick : () => {}}
      className={className}
      type={type ? type : 'submit'}
      disabled={disabled}
      style={
        disabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}
      }
    >
      {status === 'pending' ? <LoadingSpinner /> : <span>{t(children)}</span>}
    </button>
  );
};

export default SubmitButton;
