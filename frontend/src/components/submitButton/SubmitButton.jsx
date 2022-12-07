import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import styles from "./submitButton.module.css";

const SubmitButton = ({ children, status, className = "", type, onClick }) => {
  console.log("aaaaaaaaaaaaaaaaaaaaaaa", status);

  return (
    <button
      onClick={!!type && onClick}
      className={className}
      type={type ? type : "submit"}
    >
      {status === "pending" ? <LoadingSpinner /> : <span>{children}</span>}
    </button>
  );
};

export default SubmitButton;
