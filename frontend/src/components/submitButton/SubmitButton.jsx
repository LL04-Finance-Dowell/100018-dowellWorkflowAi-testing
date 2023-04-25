import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './submitButton.module.css';

const SubmitButton = ({
  children,
  status,
  className = '',
  type,
  onClick,
  disabled,
}) => {
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
      {status === 'pending' ? <LoadingSpinner /> : <span>{children}</span>}
    </button>
  );
};

export default SubmitButton;
