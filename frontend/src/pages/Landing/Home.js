import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { dowellLoginUrl } from "../../services/axios";
import { handleAuthenticationBtnClick } from "../../services/common";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import "../Landing/home.css";
import HoverCard from "../../components/hover-card/HoverCard";
import Table from "../../components/table/Table";
import Chat from "../../components/chat/Chat";
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
