import { useSelector } from "react-redux";
import SideBar from "../../components/newSidebar/Sidebar";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";
import { useEffect, useState } from "react";
import DowellLogo from "../../assets/dowell.png";
import Spinner from "../../components/spinner/Spinner";
import useCloseElementOnEscapekeyClick from "../../../src/hooks/useCloseElementOnEscapeKeyClick";

const WorkflowLayout = ({ children }) => {
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const [ createNewPortfolioLoading, setCreateNewPortfolioLoading ] = useState(false);

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

  return (
    <>
      <div className={styles.container}>
        {userDetail ? (
          !userDetail.portfolio_info ||
          userDetail.portfolio_info?.length === 0 ? (
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
              { createNewPortfolioLoading ? <div className="loading__Spinner__New__Portfolio"><Spinner /></div> : <></> }
            </div>
          ) : (
            <>
              <div className={styles.content__box}>
                <div className={styles.sidebar__box}>
                  <SideBar />
                </div>
                <div className={styles.children__box}>{children}</div>
              </div>
              <Editor />
            </>
          )
        ) : (
          <div style={{ margin: "auto" }}>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default WorkflowLayout;
