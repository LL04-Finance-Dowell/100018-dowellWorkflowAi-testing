import { useEffect, useState } from "react";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import { useDispatch, useSelector } from "react-redux";
import { setAllProcesses, setProcessesLoaded, setProcessesLoading } from "../../../features/app/appSlice";
import { getAllProcessesV2 } from "../../../services/processServices";
import ProcessCard from "../../../components/hoverCard/processCard/ProcessCard";

const ProcessesPage = () => {
  const dispatch = useDispatch();
  const { processesLoading, processesLoaded, allProcesses } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);
  
  useEffect(() => {

    if (processesLoaded) return
    
    dispatch(setProcessesLoading(true));

    if (
      !userDetail ||
      !userDetail.portfolio_info ||
      userDetail.portfolio_info.length < 1
    ) {
      dispatch(setProcessesLoading(false));
      return;
    }

    getAllProcessesV2(userDetail?.portfolio_info[0]?.org_id).then(res => {
      dispatch(setAllProcesses(res.data.reverse()));
      dispatch(setProcessesLoading(false));
      dispatch(setProcessesLoaded(true));
    }).catch(err => {
      console.log("Failed: ", err.response);
      dispatch(setProcessesLoading(false));
      console.log("did not fetch processes");
    })

  }, [userDetail])

  return (
    <WorkflowLayout>
      <div id="new-proccess">
        <ManageFiles title="Proccess">
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              Card={ProcessCard}
              cardItems={allProcesses.filter(process => process.processing_state && process.processing_state === "draft")}
              status={processesLoading ? "pending" :"success"}
            />
          </div>
          <div id="saved-processes">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="saved proccess"
              Card={ProcessCard}
              cardItems={allProcesses.filter(process => process.processing_state && process.processing_state === "processing")}
              status={processesLoading ? "pending" : "success"}
            />
          </div>
          <div id="paused-processes">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="paused proccess"
              Card={ProcessCard}
              cardItems={allProcesses.filter(process => process.processing_state && process.processing_state === "paused")}
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
