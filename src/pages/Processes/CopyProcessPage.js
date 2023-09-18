import React from "react";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const CopyProcessPage = () => {
  const { process_id } = useParams();
  const navigate = useNavigate();

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
              onClick={()=>{toast.info('Currently under construction!')}}
            >
              Yes
            </button>
            <button
              style={{
                padding: "7px",
                background: "red",
                color: "white",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/")}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
};

export default CopyProcessPage;
