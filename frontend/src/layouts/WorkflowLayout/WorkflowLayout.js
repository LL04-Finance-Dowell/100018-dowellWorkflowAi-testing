import SideBar from "../../components/sideBar/SideBar";
import { useUserContext } from "../../contexts/UserContext";
import "./style.css";

const WorkflowLayout = ({ children }) => {
  const { currentUser } = useUserContext();

  return (
    <>
      <>
        <main className="workflow_Layout_Content">
          <SideBar user={currentUser} />
          {children}
        </main>
      </>
    </>
  );
};

export default WorkflowLayout;
