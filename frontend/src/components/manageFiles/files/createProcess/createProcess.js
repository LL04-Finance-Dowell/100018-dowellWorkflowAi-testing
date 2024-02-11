import React, { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWhichApproval } from "../../../../features/processCopyReducer";
import "./createProcess.css";

const CreateProcess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [selectedOption, setSelectedOption] = useState("Document");
  const handleOptionChange = () => {
    setSelectedOption(selectedOption === "Document" ? "Template" : "Document");
  };
  const handleClick = async () => {
    await dispatch(setWhichApproval(selectedOption))
    navigate('/workflows/new-set-workflow')
  };

  return (
    <div className="createProcess">
      <div className="bodyWrapper">
        <div>
          <h3>Choose the process you want to create</h3>
          <div className="radioWrapper">
            <label className="radio-label">
              <input
                type="radio"
                name="options"
                value="Document"
                checked={selectedOption === "Document"}
                onChange={handleOptionChange}
              />
              Document Approval
            </label>
          </div>
          <div className="radioWrapper">
            <label className="radio-label">
              <input
                type="radio"
                name="options"
                value="Template"
                checked={selectedOption === "Template"}
                onChange={handleOptionChange}
              />
              Template Approval
            </label>
          </div>
          <p className="selectedProcessWrapper">
            Selected Option :{" "}
            <h5 className="selectedProcess">{selectedOption} Approval</h5>
          </p>
        </div>
        <div className="buttonWrapper">
          <button className="createProcessBtn" onClick={handleClick}>Create Process</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProcess;
