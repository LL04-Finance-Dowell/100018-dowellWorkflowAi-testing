import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../../components/manageFiles/ManageFiles";
import ProcessDetail from "../../../components/manageFiles/ProcessDetail/ProcessDetail";
import { useDispatch, useSelector } from "react-redux";
import ProcessCard from "../../../components/hoverCard/processCard/ProcessCard";
import { ProcessDetailModail } from "../../../components/newSidebar/manageFile/ProcessDetailModal/ProcessDetailModail";
import GeneratedLinksModal from "../../../components/setWorkFlowInDocNew/steps/processDocument/components/GeneratedLinksModal/GeneratedLinksModal";
import { useEffect } from "react";
import { getAllProcessesV2 } from "../../../services/processServices";
import axios from "axios";
import { setAllProcesses, setProcessesLoaded, setProcessesLoading, setShowGeneratedLinksPopup } from "../../../features/app/appSlice";
import { useNavigate } from "react-router-dom";
import { productName } from "../../../utils/helpers";
import { reports } from "../../../components/newSidebar/Sidebar";

const ProcessesPage = ({ home, showSingleProcess, showOnlySaved, showOnlyPaused, showOnlyCancelled, showOnlyTrashed, showOnlyTests, showOnlyCompleted }) => {
  const { processesLoading, allProcesses, processesLoaded, ArrayofLinks, showGeneratedLinksPopup, linksFetched, showsProcessDetailPopup, DetailFetched } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);


  const [completedProcess, SetcompletedPcocess] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUserPortfolioDataType, setCurrentUserPortfolioDataType] = useState('');




  useEffect(() => {

    if (showOnlySaved) navigate("#saved-processes");
    if (showSingleProcess) navigate("#processdetail");
    if (showOnlyPaused) navigate("#paused-processes");
    if (showOnlyCancelled) navigate("#cancelled-processes");
    if (showOnlyTrashed) navigate("#thrashed-processes");
    if (showOnlyTests) navigate("#test-processes");
    if (showOnlyCompleted) navigate("#completed-processes");
    if (home) navigate('#drafts')

  }, [showOnlySaved, showSingleProcess, showOnlyPaused, showOnlyCancelled, showOnlyTrashed, home, showOnlyTests, showOnlyCompleted])

  useEffect(() => {

    if (processesLoaded) return

    if (
      !userDetail ||
      !userDetail.portfolio_info ||
      userDetail.portfolio_info.length < 1
    ) {
      return;
    }


    const [userCompanyId, userPortfolioDataType] = [
      userDetail?.portfolio_info?.length > 1 ?
        userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id
        :
        userDetail?.portfolio_info[0]?.org_id
      ,
      userDetail?.portfolio_info?.length > 1 ?
        userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type
        :
        userDetail?.portfolio_info[0]?.data_type
    ];

    getAllProcessesV2(userCompanyId, userPortfolioDataType).then(res => {
      const savedProcessesInLocalStorage = JSON.parse(localStorage.getItem('user-saved-processes'));
      console.log(res)
      if (savedProcessesInLocalStorage) {
        const processes = [...savedProcessesInLocalStorage, ...res.data.filter(process => process.processing_state)].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
        console.log(processes)
        dispatch(setAllProcesses(processes));
      } else {
        dispatch(setAllProcesses(res.data.filter(process => process.processing_state).reverse()));
      }
      dispatch(setProcessesLoading(false));
      dispatch(setProcessesLoaded(true));
    }).catch(err => {
      console.log("Failed: ", err.response);
      dispatch(setProcessesLoading(false));
    })

  }, [processesLoaded, userDetail])

  useEffect(() => {
    const userPortfolioDataType = userDetail?.portfolio_info?.length > 1 ?
      userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type
      :
      userDetail?.portfolio_info[0].data_type;

    setCurrentUserPortfolioDataType(userPortfolioDataType)

    axios
      .get(`https://100094.pythonanywhere.com/v1/companies/6385c0f38eca0fb652c9457e/processes/completed/?data_type=Real_Data`)
      .then((response) => {
        console.log(response)
        SetcompletedPcocess(response.data)
      })
      .catch((error) => {
        console.log(error);

      });
  }, [userDetail])



  return (
    <WorkflowLayout>
      <div id="new-proccess">
        <ManageFiles title="Processes" removePageSuffix={true}>
          {
            home ? <div id="drafts">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="drafts"
                Card={ProcessCard}
                cardItems={
                  allProcesses.filter(process => process.processing_state === "draft")
                    .filter(process => process.data_type === currentUserPortfolioDataType)
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
                cardItems={allProcesses.filter(process => process.processing_state === "processing").filter(process => process.data_type === currentUserPortfolioDataType)}
                status={processesLoading ? "pending" : "success"}
                itemType={"processes"}
              />
            </div> : <></>
          }


          {showGeneratedLinksPopup && linksFetched && Array.isArray(ArrayofLinks) &&
            <GeneratedLinksModal />
          }

          {showsProcessDetailPopup && DetailFetched &&
            <ProcessDetailModail />
          }

          {
            showSingleProcess ? <div id="processdetail">

              <ProcessDetail />

            </div> : <></>
          }

          {
            showOnlyPaused ? <div id="paused-processes">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="paused proccess"
                Card={ProcessCard}
                cardItems={allProcesses.filter(process => process.processing_state === "paused").filter(process => process.data_type === currentUserPortfolioDataType)}
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
                cardItems={allProcesses.filter(process => process.processing_state === "cancelled").filter(process => process.data_type === currentUserPortfolioDataType)}
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
                cardItems={allProcesses.filter(process => process.processing_state === "test").filter(process => process.data_type === currentUserPortfolioDataType)}
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
                cardItems={completedProcess}
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
export const drafts = [{ id: uuidv4() }];

