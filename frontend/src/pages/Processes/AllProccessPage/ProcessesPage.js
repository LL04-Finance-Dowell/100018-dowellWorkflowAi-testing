import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import { useSelector } from "react-redux";
import ProcessCard from "../../../components/hoverCard/processCard/ProcessCard";

const ProcessesPage = () => {
  const { processesLoading, allProcesses } = useSelector((state) => state.app);

  return (
    <WorkflowLayout>
      <div id="new-proccess">
        <ManageFiles title="Proccess">
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              Card={ProcessCard}
              cardItems={allProcesses.filter(process => process.processing_state === "draft")}
              status={processesLoading ? "pending" :"success"}
            />
          </div>
          <div id="saved-processes">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="saved proccess"
              Card={ProcessCard}
              cardItems={allProcesses.filter(process => process.processing_state === "processing")}
              status={processesLoading ? "pending" : "success"}
            />
          </div>
          <div id="paused-processes">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="paused proccess"
              Card={ProcessCard}
              cardItems={allProcesses.filter(process => process.processing_state === "paused")}
              status={processesLoading ? "pending" : "success"}
            />
          </div>
          <div id="cancelled-processes">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="cancelled proccess"
              Card={ProcessCard}
              cardItems={allProcesses.filter(process => process.processing_state && process.processing_state === "cancelled")}
              status={processesLoading ? "pending" : "success"}
            />
          </div>
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default ProcessesPage;

export const createDocumentsByMe = [{ id: uuidv4() }];
