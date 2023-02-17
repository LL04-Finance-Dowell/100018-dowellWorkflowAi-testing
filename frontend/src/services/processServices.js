import { httpProcess, newHttpProcess } from "../httpCommon/httpCommon";

// API Route Disabled
// export const saveWorkflowsToDocument = async (data) => {
//     return await httpProcess.post("new/", data);
// }

export const startNewProcess = async (data) => {
    return await httpProcess.post("/", data);
}

export const verifyProcess = async (data) => {
    return await httpProcess.post("verify-process/", data);
}

export const getProcessLink = async (data) => {
    return await httpProcess.post("verification-link/", data);
}

export const startNewProcessV2 = async (data) => {
    return await newHttpProcess.post("start/", data);
}

export const processActionOptions = {
    saveWorkflowToDocument: "save_workflow_to_document",
    saveAndStartProcess: "save_and_start_processing",
}

export const newProcessActionOptions = {
    saveWorkflowToDocumentAndDrafts: "save_workflow_to_document_and_save_to_drafts",
    cancelProcessBeforeCompletion: "cancel_process_before_completion",
    pauseProcessAfterCompletingOngoingStep: "pause_processing_after_completing_ongoing_step",
    resumeProcessingFromNextStep: "resume_processing_from_next_step",
    testDocumentProcessWorkflowWise: "test_document_processing_wf_wise",
    testDocumentProcessWorkflowStepWise: "test_document_processing_wf_steps_wise",
    testDocumentProcessContentWise: "test_document_processing_content_wise",
    startDocumentProcessingWorkflowWise: "start_document_processing_wf_wise",
    startDocumentProcessingWorkflowStepWise: "start_document_processing_wf_steps_wise",
    startDocumentProcessingContentWise: "start_document_processing_content_wise",
    closeProcessingAndMarkCompleted: "close_processing_and_mark_as_completed",
}