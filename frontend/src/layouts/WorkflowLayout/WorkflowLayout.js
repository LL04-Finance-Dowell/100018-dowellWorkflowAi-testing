import SideBar from "../../components/newSidebar/Sidebar";
import { useUserContext } from "../../contexts/UserContext";
import "./style.css";
import styles from "./workflowLayout.module.css";

const WorkflowLayout = ({ children }) => {
  const { currentUser } = useUserContext();

  return (
    <>
      <>
        <main className={styles.container}>
          <div className={styles.content__box}>
            <SideBar user={currentUser} />
            {children}
          </div>
        </main>
      </>
    </>
  );
};

export default WorkflowLayout;
