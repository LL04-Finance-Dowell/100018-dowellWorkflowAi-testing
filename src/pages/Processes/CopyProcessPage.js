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
import { setAllProcesses } from "../../features/app/appSlice";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

const CopyProcessPage = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const { process_id } = useParams();
  const [processCopy, setProcessCopy] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    console.log(JSON.stringify(data));
  
    try {
      const response = await axios.post(
        `https://100094.pythonanywhere.com/v1/processes/process-import/${process_id}`,
        data
      );
  
      console.log("the response is ", response.data);
      setProcessCopy(response.data);
  
      const documentServices = new DocumentServices();
      const res1 = await documentServices.allDocuments(data.company_id, data.data_type);
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
  
      const res3 = await getAllProcessesV2(data.company_id, data.data_type);
      const savedProcessesInLocalStorage = JSON.parse(
        localStorage.getItem("user-saved-processes")
      );
  
      // console.log("the res3.data is ", res3.data);
      if (savedProcessesInLocalStorage) {
        const processes = [
          ...savedProcessesInLocalStorage,
          ...res3.data.reverse(),
        ].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
        dispatch(setAllProcesses(processes));
      } else {
        dispatch(setAllProcesses(res3.data.reverse()));
      }
  
      setLoading(false);
    } catch (error) {
      console.log("error sending request ", error);
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
                Are you sure, do you want to import process with the id of{" "}
                {process_id}?
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
