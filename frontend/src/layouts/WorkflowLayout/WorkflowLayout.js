import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import SideBar from "../../components/newSidebar/Sidebar";
import { useUserContext } from "../../contexts/UserContext";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../features/app/asyncThunks";
import { mineDocuments } from "../../features/document/asyncThunks";
import { mineTemplates } from "../../features/template/asyncThunks";
import { mineWorkflow } from "../../features/workflow/asyncTHunks";
import { localStorageGetItem } from "../../utils/localStorageUtils";
import Spinner from "../../components/spinner/Spinner";

const WorkflowLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const currentUser = localStorageGetItem("workFlowUser");
    const userDetail = localStorageGetItem("userDetail");
    setCurrentUser(currentUser);
    setUserDetail(userDetail);
  }, []);

  console.log(currentUser, userDetail);

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
