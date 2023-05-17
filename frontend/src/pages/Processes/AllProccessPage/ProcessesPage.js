import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import { useDispatch, useSelector } from "react-redux";
import ProcessCard from "../../../components/hoverCard/processCard/ProcessCard";
import GeneratedLinksModal from "../../../components/setWorkFlowInDocNew/steps/processDocument/components/GeneratedLinksModal/GeneratedLinksModal";
import { useEffect } from "react";
import { getAllProcessesV2 } from "../../../services/processServices";

import { setAllProcesses, setProcessesLoaded, setProcessesLoading, setShowGeneratedLinksPopup } from "../../../features/app/appSlice";
import { useNavigate } from "react-router-dom";

const ProcessesPage = ({ home, showOnlySaved, showOnlyPaused, showOnlyCancelled, showOnlyTrashed, showOnlyTests, showOnlyCompleted }) => {
  const { processesLoading, allProcesses, processesLoaded, ArrayofLinks, showGeneratedLinksPopup, linksFetched } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);
  const [copiedLinks, setCopiedLinks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    if (showOnlySaved) navigate("#saved-processes");
    if (showOnlyPaused) navigate("#paused-processes");
    if (showOnlyCancelled) navigate("#cancelled-processes");
    if (showOnlyTrashed) navigate("#thrashed-processes");
    if (showOnlyTests) navigate("#test-processes");
    if (showOnlyCompleted) navigate("#completed-processes");
    if (home) navigate('#drafts')

  }, [showOnlySaved, showOnlyPaused, showOnlyCancelled, showOnlyTrashed, home, showOnlyTests, showOnlyCompleted])

  useEffect(() => {

    if (processesLoaded) return

    if (
      !userDetail ||
      !userDetail.portfolio_info ||
      userDetail.portfolio_info.length < 1
    ) {
      return;
    }

    getAllProcessesV2(userDetail?.portfolio_info[0]?.org_id, userDetail?.portfolio_info[0]?.data_type).then(res => {
      const savedProcessesInLocalStorage = JSON.parse(localStorage.getItem('user-saved-processes'));
      if (savedProcessesInLocalStorage) {
        const processes = [...savedProcessesInLocalStorage, ...res.data.filter(process => process.processing_state)].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
        dispatch(setAllProcesses(processes));
      } else {
        dispatch(setAllProcesses(res.data.filter(process => process.processing_state).reverse()));
      }
      dispatch(setProcessesLoading(false));
      dispatch(setProcessesLoaded(true));
    }).catch(err => {
      console.log("Failed: ", err.response);
      dispatch(setProcessesLoading(false));
      console.log("did not fetch processes");
    })

  }, [processesLoaded, userDetail])



  return (
    <WorkflowLayout>
      <div id="new-proccess">
        <ManageFiles title="Proccesses" removePageSuffix={true}>
          {
            home ? <div id="drafts">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="drafts"
                Card={ProcessCard}
                cardItems={
                  allProcesses.filter(process => process.processing_state === "draft")
                    .filter(process => process.data_type === userDetail?.portfolio_info[0]?.data_type)
                    .filter(process => process.created_by === userDetail?.userinfo?.username)
                    .filter(process => process.workflow_construct_ids)
                }
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }
          {
            showOnlySaved ? <div id="saved-processes">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="saved proccess"
                Card={ProcessCard}
                cardItems={allProcesses.filter(process => process.processing_state === "processing").filter(process => process.data_type === userDetail?.portfolio_info[0]?.data_type)}
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }
          {showGeneratedLinksPopup && linksFetched && Array.isArray(ArrayofLinks) &&
            <GeneratedLinksModal />
          }


          {
            showOnlyPaused ? <div id="paused-processes">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="paused proccess"
                Card={ProcessCard}
                cardItems={allProcesses.filter(process => process.processing_state === "paused").filter(process => process.data_type === userDetail?.portfolio_info[0]?.data_type)}
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }
          {
            showOnlyCancelled ? <div id="cancelled-processes">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="cancelled proccess"
                Card={ProcessCard}
                cardItems={allProcesses.filter(process => process.processing_state === "cancelled").filter(process => process.data_type === userDetail?.portfolio_info[0]?.data_type)}
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }
          {
            showOnlyTrashed ? <div id="trashed-processes">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="trashed proccess"
                Card={ProcessCard}
                cardItems={allProcesses.filter(process => process.processing_state === "trash")}
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }
          {
            showOnlyTests ? <div id="test-processes">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="test proccess"
                Card={ProcessCard}
                cardItems={allProcesses.filter(process => process.processing_state === "test").filter(process => process.data_type === userDetail?.portfolio_info[0]?.data_type)}
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }
          {
            showOnlyCompleted ? <div id="completed-processes">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="completed proccess"
                Card={ProcessCard}
                cardItems={allProcesses.filter(process => process.processing_state === "completed").filter(process => process.data_type === userDetail?.portfolio_info[0]?.data_type)}
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default ProcessesPage;

export const createDocumentsByMe = [{ id: uuidv4() }];
