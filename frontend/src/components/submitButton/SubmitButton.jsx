import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import styles from "./submitButton.module.css";

const SubmitButton = ({ children, status, className = "", type, onClick, disabled }) => {
  return (
    <button
      onClick={!!type && onClick}
      className={className}
      type={type ? type : "submit"}
      disabled={disabled}
    >
      {status === "pending" ? <LoadingSpinner /> : <span>{children}</span>}
    </button>
  );
};

export default SubmitButton;
