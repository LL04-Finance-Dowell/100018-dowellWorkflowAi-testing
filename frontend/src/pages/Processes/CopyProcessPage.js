import React, { useEffect, useState } from "react";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { productName } from "../../utils/helpers";
import axios from "axios";
import { DocumentServices } from "../../services/documentServices";
import { WorkflowServices } from "../../services/workflowServices";
import { getAllProcessesV2 } from "../../services/processServices";
import { setAllDocuments } from "../../features/document/documentSlice";
import { setAllWorkflows } from "../../features/workflow/workflowsSlice";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

import { setCopiedDocument, setCopiedWorkflow ,setProcessStepCopy} from "../../features/processCopyReducer";
import { setAllProcesses } from "../../features/processes/processesSlice";

const CopyProcessPage = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const { process_id } = useParams();
  const [processCopy, setProcessCopy] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // // console.log('effect entered')
    axios.get(`https://100094.pythonanywhere.com/v2/processes/${process_id}/`)
      .then((response) => {
        setProcessData(response.data);
        // // console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [process_id]);

  const handleCopy = async () => {
    setLoading(true);
    const data = {
      member: userDetail?.userinfo?.username,
      company_id:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
          : userDetail?.portfolio_info[0]?.org_id,
      data_type:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.data_type
          : userDetail?.portfolio_info[0]?.data_type,
      portfolio:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.portfolio_name
          : userDetail?.portfolio_info[0].portfolio_name,
      org_name: "workflowAI",
    };
    // // console.log(JSON.stringify(data));
  
    try {
      const response = await axios.post(
        `https://100094.pythonanywhere.com/v2/processes/process-import/${process_id}/`,
        data
      );
  
      // // console.log("the response is ", response.data);
      // setProcessCopy(response.data);
        const doc_id = response.data?.document_id
        const workflow_id = response.data?.workflow_id
        const process_ID = response.data?.process_id

        if(doc_id){
          const docData = await axios.get(`https://100094.pythonanywhere.com/v2/documents/${doc_id}/`);
          // // console.log('the response for the copied document is ', docData)
          dispatch(setCopiedDocument(docData))
        }


  
      const documentServices = new DocumentServices();
      const res1 = await documentServices.allDocuments(data.company_id, data.data_type, data.member);
      dispatch(
        setAllDocuments(
          res1.data.documents.filter(
            (document) =>
              document.document_state !== "trash" &&
              document.data_type &&
              document.data_type === data.data_type 
          )
        )
      );
      // // console.log('the refreshed doc data is ', res1.data)
      if(doc_id){
        const findDoc = res1.data.documents.find((item)=>item.collection_id == doc_id)
        // // console.log('the response for the copied document is ', findDoc)
        dispatch(setCopiedDocument(findDoc))
      }
  
      const workflowServices = new WorkflowServices();
      const res2 = await workflowServices.allWorkflows(data.company_id, data.data_type);
      dispatch(
        setAllWorkflows(
          res2.data.workflows.filter(
            (workflow) =>
              (workflow?.data_type &&
                workflow?.data_type === data.data_type) ||
              (workflow.workflows.data_type &&
                workflow.workflows.data_type === data.data_type)
          )
        )
      );
      // // console.log('the refreshed workflow data is ', res2.data)
      if(workflow_id){
        const workflowData = res2.data.workflows.find((item)=>item._id == workflow_id)
        // // console.log('the response for the copied workflow is ', workflowData)
        dispatch(setCopiedWorkflow(workflowData))
      }
  
      const res3 = await getAllProcessesV2(data.company_id, data.data_type);
      const savedProcessesInLocalStorage = JSON.parse(
        localStorage.getItem("user-saved-processes")
      );

      ///save the process steps
      // // console.log('the processID is ', process_ID)
      try {
        const response5 = await fetch(`https://100094.pythonanywhere.com/v2/processes/${process_ID}/`);
        if (!response5.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response5.json();
        // // console.log('the copied process steps are ', data)
        dispatch(setProcessStepCopy(data));
      } catch (error) {
        // console.log('An error occurred while fetching process data:', error);
      }
      
      // // console.log("the res3.data is ", res3.data);
      if (savedProcessesInLocalStorage) {
        const processes = [
          ...savedProcessesInLocalStorage,
          ...res3.data.reverse(),
        ].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
        dispatch(setAllProcesses(processes));
      } else {
        dispatch(setAllProcesses(res3.data.reverse()));
      }
      navigate('/workflows/new-set-workflow-document')
      setLoading(false);
    } catch (error) {
      // console.log("error sending request ", error);
      toast.info(
        "There was some issue while importing the process, Make sure you have Portfolio, company Id"
      );
      setLoading(false);
    }
  };
  
  return (
    <WorkflowLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {processCopy == null ? (
          userDetail !== null ? (
            <div
              style={{
                display: "block",
                margin: "0 auto",
              }}
            >
              <h4>
                Do you want to import process {" ' "}
                {processData?.process_title} {" ' "}?
              </h4>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  style={{
                    marginRight: "20px",
                    padding: "7px",
                    background: "green",
                    color: "white",
                    borderRadius: "5px",
                  }}
                  disabled={loading}
                  onClick={() => handleCopy()}
                >
                  {loading ? (
                    <LoadingSpinner
                      color={"white"}
                      width={"1rem"}
                      height={"1rem"}
                    />
                  ) : (
                    "Yes"
                  )}
                </button>
                <button
                  style={{
                    padding: "7px",
                    background: "red",
                    color: "white",
                    borderRadius: "5px",
                  }}
                  disabled={loading}
                  onClick={() => navigate("/")}
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
              }}
            >
              <div>
                <LoadingSpinner
                  color={"green"}
                  width={"3rem"}
                  height={"3rem"}
                />
              </div>
            </div>
          )
        ) : (
          <div
            style={{
              display: "block",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4 style={{ color: "green" }}>{processCopy?.Message}</h4>
            </div>
            {/* <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h5 style={{ color: "red" }}>
                Refresh the page to find the imported Document, Workflow and
                Process
              </h5>
            </div> */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  padding: "7px",
                  background: "green",
                  color: "white",
                  borderRadius: "5px",
                }}
                onClick={() => navigate("/")}
              >
                Go to home
              </button>
            </div>
          </div>
        )}
      </div>
    </WorkflowLayout>
  );
};

export default CopyProcessPage;
