import { Link } from "react-router-dom";
import Carousel from "../../components/carousel/Carousel";
import FlipCard from "../../components/flip-card/FlipCard";
import SideBar from "../../components/sideBar/SideBar";
import SmallFlip from "../../components/small-flip/SmallFlip";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { dowellLoginUrl } from "../../services/axios";
import { handleAuthenticationBtnClick } from "../../services/common";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import "../Landing/home.css";
import HoverCard from "../../components/hover-card/HoverCard";
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

      <div className="main">
        <SideBar />
        <div className="top-main">
          <Carousel />

          <div className="sm-flip">
            <SmallFlip
              icon={<NotificationsNoneIcon fontSize="large" />}
              content={"006"}
              button={"View"}
              size={"50px"}
              padding={"25px"}
              color={"#1abc9c"}
            />
            <SmallFlip
              icon={<InsertDriveFileIcon fontSize="large" />}
              content={"New"}
              button={"Create Document"}
              size={"60px"}
              padding={"20px"}
              color={"gray"}
            />
            <SmallFlip
              icon={<SearchIcon fontSize="large" />}
              content={"Search"}
              button={"Search Document"}
              size={"60px"}
              padding={"20px"}
              color={"#61ce70"}
            />
            <SmallFlip
              icon={<ManageAccountsIcon fontSize="large" />}
              content={"Support"}
              button={"Dowell Knowledge Center"}
              size={"85px"}
              padding={"8px"}
              color={"#c3d6be"}
            />
          </div>
          <HoverCard />
          <HoverCard />
          <HoverCard />
        </div>
        <FlipCard />
      </div>
    </>
  );
};

export default LandingPage;
