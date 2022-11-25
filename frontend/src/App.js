import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useUserContext } from "./contexts/UserContext";
import useDowellLogin from "./hooks/useDowellLogin";
import WorkflowApp from "./pages/App/WorkflowApp";
import LandingPage from "./pages/Landing/Home";
import "./App.css";
import SetWorkflowInDoc from "./components/setWorkFlowInDoc/SetWorkflowInDoc";

function App() {
  const { currentUser, setCurrentUser } = useUserContext();
  const [loading, setLoading] = useState(true);

  useDowellLogin(setCurrentUser, setLoading);

  /*  if (loading) return <></>;

  if (!currentUser)
    return (
      <Routes>
        <Route path={"/"} element={<LandingPage />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path={"/"} element={<WorkflowApp />} />
    </Routes>
  ); */

  return (
    <div style={{ paddingTop: "200px", paddingBottom: "150px" }}>
      <Routes>
        <Route path={"/"} element={<SetWorkflowInDoc />} />
      </Routes>
    </div>
  );
}

export default App;
