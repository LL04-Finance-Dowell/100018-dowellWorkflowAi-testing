import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { dowellLoginUrl } from "../../services/axios";
import { handleAuthenticationBtnClick } from "../../services/common";
import { localStorageGetItem } from "../../utils/localStorageUtils";
import "../Landing/home.css";

const LandingPage = () => {
  const currentUser = localStorageGetItem("workFlowUser");
  const userDetail = localStorageGetItem("userDetail");
  /* const [currentUser, setCurrentUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null); */

  /* https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing */

  /*  useEffect(() => {
    const currentUser = localStorageGetItem("workFlowUser");
    const userDetail = localStorageGetItem("userDetail");
    setCurrentUser(currentUser);
    setUserDetail(userDetail);
  }, [currentUser, userDetail]); */

  /* useEffect(() => {
    if (!currentUser || !userDetail) {
      window.location.replace(dowellLoginUrl);
    }
  }, []); */

  return (
    <>
      {/* <div>
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
      </div> */}

      {/* <div className="main">
        <SideBar />

        <div className="top-main">
          <Carousel />

          <div
            style={{
              zIndex: "1",
              position: "sticky",
              top: "0px",
            }}
            className="sm-flip"
          >
            <SmallFlip
              icon={<NotificationsNoneIcon fontSize="large" />}
              content={"006"}
              button={"View"}
              size={"50px"}
              padding={"32px"}
              color={"#1abc9c"}
              width="50%"
            />
            <SmallFlip
              icon={<InsertDriveFileIcon fontSize="large" />}
              content={"New"}
              button={"Create Document"}
              size={"60px"}
              padding={"30px"}
              color={"gray"}
              btm={"5px"}
            />
            <SmallFlip
              icon={<SearchIcon fontSize="large" />}
              content={"Search"}
              button={"Search Document"}
              size={"60px"}
              padding={"30px"}
              color={"#61ce70"}
            />
            <SmallFlip
              icon={<ManageAccountsIcon fontSize="large" />}
              content={"Support"}
              button={"Dowell Knowledge Center"}
              size={"85px"}
              padding={"15px"}
              color={"#c3d6be"}
            />
          </div>
          <div style={{ marginTop: "150px" }}>
            <h5
              id="ji"
              style={{
                border: "1px solid #74d481",
                width: "107%",
                height: "40px",
                marginBottom: "0",
                marginLeft: "39px",
                color: "red",
                paddingTop: "5px",
                paddingLeft: "5px",
                fontWeight: "bold",
              }}
            >
              Notifications - Documents
            </h5>
            <div
              style={{
                display: "grid",
                width: "96%",
                marginTop: "3px",
                paddingLeft: "50px",
                gridTemplateColumns: "auto auto auto",
              }}
            >
              <HoverCard />
              <HoverCard />
              <HoverCard />
              <HoverCard />
              <HoverCard />
            </div>
          </div>

          <div style={{ marginTop: "100px" }}>
            <h5
              id="ji"
              style={{
                border: "1px solid #74d481",
                width: "107%",
                height: "40px",
                marginBottom: "0",
                marginLeft: "39px",
                color: "red",
                paddingTop: "5px",
                paddingLeft: "5px",
                fontWeight: "bold",
              }}
            >
              Notifications - Templates
            </h5>
            <div
              style={{
                display: "grid",
                width: "96%",
                marginTop: "3px",
                paddingLeft: "50px",
                gridTemplateColumns: "auto auto auto",
              }}
            >
              <HoverCard color="#c3d6be" />
              <HoverCard color="#c3d6be" />
              <HoverCard color="#c3d6be" />
            </div>
          </div>
          <div style={{ marginTop: "100px", marginBottom: "100px" }}>
            <h5
              id="ji"
              style={{
                border: "1px solid #74d481",
                width: "107%",
                height: "40px",
                marginBottom: "0",
                marginLeft: "39px",
                color: "red",
                paddingTop: "5px",
                paddingLeft: "5px",
                fontWeight: "bold",
              }}
            >
              Notifications - Workflows
            </h5>
            <div
              style={{
                display: "grid",
                width: "67%",
                marginTop: "3px",
                paddingLeft: "50px",
                gridTemplateColumns: "auto auto auto",
              }}
            >
              <HoverCard color="#e1e1e1" />
              <HoverCard color="#e1e1e1" />
            </div>
          </div>
          <div style={{ width: "137%", display: "flex" }}>
            <Table header="Incomplete Tasks" />
            <Table header="Complete Tasks" color="#7a7a7a" />
          </div>
        </div>
        <FlipCard />
      </div> */}
    </>
  );
};

export default LandingPage;
