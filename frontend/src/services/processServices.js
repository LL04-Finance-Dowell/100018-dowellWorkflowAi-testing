import { httpProcess, newHttpProcess } from "../httpCommon/httpCommon";

// API Route Disabled
// export const saveWorkflowsToDocument = async (data) => {
//     return await httpProcess.post("new/", data);
// }

export const startNewProcess = async (data) => {
    return await httpProcess.post("/", data);
}

export const verifyProcess = async (data) => {
    return await newHttpProcess.post("action/verify/", data);
}

export const getProcessLink = async (data) => {
    return await httpProcess.post("verification/link/", data);
}

export const startNewProcessV2 = async (data) => {
    return await newHttpProcess.post("/", data);
}

export const getSingleProcessV2 = async (processId) => {
    return await newHttpProcess.get(`/${processId}/`);
}

export const getAllProcessesV2 = async (companyId) => {
    return await newHttpProcess.get(`/org/${companyId}/`);
}

export const verifyProcessV2 = async (data) => {
    return await newHttpProcess.post("/verification/", data)
}

export const markProcessV2 = async (data) => {
    return await newHttpProcess.post("/mark/", data)
}

export const getProcessVerificationLinkV2 = async (processId) => {
    return await newHttpProcess.get(`/verify/${processId}/`)
}

export const startDraftProcessingV2 = async (processId) => {
    return await newHttpProcess.get(`/start/${processId}/`)
}

export const pauseOngoingProcessV2 = async (processId) => {
    return await newHttpProcess.get(`/pause/${processId}/`)
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

export const processActionOptionsWithLinkReturned = [
    "test_document_processing_wf_wise",
    "test_document_processing_wf_steps_wise",
    "test_document_processing_content_wise",
    "start_document_processing_wf_wise",
    "start_document_processing_wf_steps_wise",
    "start_document_processing_content_wise",
]