import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import SideBar from "../../components/newSidebar/Sidebar";
import { useUserContext } from "../../contexts/UserContext";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserInfo } from "../../features/app/asyncThunks";
import { mineDocuments } from "../../features/document/asyncThunks";
import { mineTemplates } from "../../features/template/asyncThunks";
import { mineWorkflow } from "../../features/workflow/asyncTHunks";

const WorkflowLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { currentUser } = useUserContext();
  const { userStatus } = useSelector((state) => state.app);

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    /* const docData = {
      created_by: "Manish",
      company_id: "6360b64d0a882cf6308f5758",
    };
    const tempData = {
      company_id: "6360b64d0a882cf6308f5758",
    };
    const workflowData = {
      company_id: "6360b64d0a882cf6308f5758",
      created_by: "Manish",
    }; */
    const data = {
      session_id: localStorage.getItem("session_id"),
    };

    dispatch(getUserInfo(data));
    /* dispatch(mineDocuments(docData));
    dispatch(mineTemplates(tempData));
    dispatch(mineWorkflow(workflowData)); */
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content__box}>
        <div className={styles.sidebar__box}>
          <SideBar user={currentUser} />
        </div>
        <div className={styles.children__box}>{children}</div>
      </div>
      <Editor />
    </div>
  );
};

export default WorkflowLayout;
