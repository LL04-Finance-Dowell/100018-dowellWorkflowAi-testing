import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { dowellLoginUrl } from "../../services/axios";
import { handleAuthenticationBtnClick } from "../../services/common";

const LandingPage = () => {
  const { currentUser } = useUserContext();

  return (
    <>
      <WorkflowLayout>
        <div>
          Landing
          {!currentUser ? (
            <button>
              <Link
                to={dowellLoginUrl}
                onClick={(e) => handleAuthenticationBtnClick(e, dowellLoginUrl)}
              >
                Login
              </Link>
            </button>
          ) : (
            <></>
          )}
        </div>
      </WorkflowLayout>
    </>
  );
};

export default LandingPage;
