import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import SideBar from "../../components/newSidebar/Sidebar";
import { useUserContext } from "../../contexts/UserContext";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getUserInfo } from "../../features/app/asyncThunks";
import { mineDocuments } from "../../features/document/asyncThunks";
import { mineTemplates } from "../../features/template/asyncThunks";
import { mineWorkflow } from "../../features/workflow/asyncTHunks";
import { localStorageGetItem } from "../../utils/localStorageUtils";
import Spinner from "../../components/spinner/Spinner";

const WorkflowLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { currentUser, userDetail } = useSelector((state) => state.auth);
  /* const currentUser = localStorageGetItem("currentUser");
  const userDetail = localStorageGetItem("userDetail"); */
  /* const [currentUser, setCurrentUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null); */

  /*  useEffect(() => {
    const currentUser = localStorageGetItem("currentUser");
    const userDetail = localStorageGetItem("userDetail");
    setCurrentUser(currentUser);
    setUserDetail(userDetail);
  }, []);

  console.log(currentUser, userDetail); */

  /*   console.log("aaaaaaaaaaa", currentUser, userDetail);

  const www = useCallback(())
 */

  console.log("aaaaaaaaaaaaaaaa", currentUser, userDetail);

  /*   useEffect(() => {
    if (!currentUser || !userDetail) {
      window.location.reload();
    }
  }, []); */

  return (
    <>
      {currentUser && userDetail ? (
        <div className={styles.container}>
          <div className={styles.content__box}>
            <div className={styles.sidebar__box}>
              <SideBar user={currentUser} />
            </div>
            <div className={styles.children__box}>{children}</div>
          </div>
          <Editor />
        </div>
      ) : (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
    </>
  );
};

export default WorkflowLayout;
