import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../components/newSidebar/Sidebar";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";
import { useEffect, useState } from "react";
import DowellLogo from "../../assets/dowell.png";
import Spinner from "../../components/spinner/Spinner";
import useCloseElementOnEscapekeyClick from "../../../src/hooks/useCloseElementOnEscapeKeyClick";
import UserDetail from "../../components/newSidebar/userDetail/UserDetail";
import { setUserDetailPosition } from "../../features/app/appSlice";

const WorkflowLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const { userDetailPosition } = useSelector((state) => state.app);
  const [createNewPortfolioLoading, setCreateNewPortfolioLoading] =
    useState(false);

  const handleClick = () => {
    if (session_id) {
      setCreateNewPortfolioLoading(true);
      sessionStorage.clear();
      window.location.replace(
        `https://100093.pythonanywhere.com/?session_id=${session_id}`
      );
    }
  };

  useCloseElementOnEscapekeyClick(() => setCreateNewPortfolioLoading(false));

  const handleMouseEnter = () => {
    dispatch(setUserDetailPosition(userDetailPosition));
  };

  const handleMouseLeave = () => {
    dispatch(setUserDetailPosition(null));
  };
console.log(userDetail)
  return (
    <>
      <div className={styles.container}>
        {userDetail ? (
          !userDetail.portfolio_info ||
          userDetail.portfolio_info?.length === 0 ||
          (userDetail.portfolio_info?.length > 0 && userDetail.portfolio_info[0]?.product !== "Workflow AI") ? (
            <div className={styles.redirect__container}>
              <div className={styles.img__container}>
                <img src={DowellLogo} />
              </div>
              <div className={styles.typewriter}>
                <h1>
                  You don't have portfolio,{" "}
                  <span onClick={handleClick}> create here</span>
                </h1>
              </div>
              {createNewPortfolioLoading ? (
                <div className="loading__Spinner__New__Portfolio">
                  <Spinner />
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <>
              <div className={styles.content__box}>
                <div className={`${styles.sidebar__box} hide-scrollbar`}>
                  <SideBar />
                </div>
                <div className={styles.children__box}>
                  <p className={styles.beta__Info__Text}>You are on the beta version of workflow.ai</p>
                  {children}
                </div>
              </div>
              <Editor />
            </>
          )
        ) : (
          <div style={{ margin: "auto" }}>
            <Spinner />
          </div>
        )}
        {userDetailPosition && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "fixed",
              zIndex: "10000000",
              top: `${userDetailPosition.top}px`,
              left: `${userDetailPosition.left}px`,
            }}
          >
            <UserDetail />
          </div>
        )}
      </div>
    </>
  );
};

export default WorkflowLayout;
