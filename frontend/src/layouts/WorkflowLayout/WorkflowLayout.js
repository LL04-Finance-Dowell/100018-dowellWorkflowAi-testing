import SideBar from "../../components/sideBar/SideBar";
import { useUserContext } from "../../contexts/UserContext";
import "./style.css";

const WorkflowLayout = ({ children }) => {
<<<<<<< HEAD
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
=======
    const { currentUser } = useUserContext();

    return <>
        <>
            <main className="workflow_Layout_Content">
                <SideBar user={currentUser} />
                { children }
            </main>
        </>
    </>
}
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e

export default WorkflowLayout;
