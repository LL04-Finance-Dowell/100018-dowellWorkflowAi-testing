import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import SideBar from "../../components/newSidebar/Sidebar";
import { useUserContext } from "../../contexts/UserContext";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";

const WorkflowLayout = ({ children }) => {
  const { currentUser } = useUserContext();

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
