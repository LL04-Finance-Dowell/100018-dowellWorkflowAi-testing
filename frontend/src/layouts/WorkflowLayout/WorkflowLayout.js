import { useSelector } from "react-redux";
import SideBar from "../../components/newSidebar/Sidebar";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";

const WorkflowLayout = ({ children }) => {
  const { userDetail } = useSelector((state) => state.auth);

  return (
    <>
      <div className={styles.container}>
        {userDetail && (
          <>
            <div className={styles.content__box}>
              <div className={styles.sidebar__box}>
                <SideBar />
              </div>
              <div className={styles.children__box}>{children}</div>
            </div>
            <Editor />
          </>
        )}
      </div>
    </>
  );
};

export default WorkflowLayout;
