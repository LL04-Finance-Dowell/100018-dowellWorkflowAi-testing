import { httpApiUrl, httpApiUrlV2, httpProcess, processReport } from '../httpCommon/httpCommon';

// API Route Disabled
// export const saveWorkflowsToDocument = async (data) => {
//     return await httpProcess.post("new/", data);
// }

export const startNewProcess = async (data) => {
  return await httpProcess.post('/', data);
};

export const getVerifiedProcessLink = async (processId, data) => {
  return await httpProcess.post(`${processId}/process-link/`, data);
};

export const verifyProcessForUser = async (processId, data) => {
  return await httpProcess.post(`${processId}/verify/`, data);
};

export const getSingleProcessV2 = async (processId) => {
  return await httpProcess.get(`${processId}/`);
};

export const getAllProcessesV2 = async (companyId, dataType) => {
  return await httpApiUrlV2.get(
    `processes/${companyId}/organisations/?data_type=${dataType}`
    // https://100094.pythonanywhere.com/v2/processes/65ad8a28c9038ff4498672c9/organisations/?data_type=Real_Data
  );
};

export const getCompletedProcesses = (companyId, dataType, processState) => {
  return httpApiUrlV2.get(
    `/processes/${companyId}/organisations/?data_type=${dataType}&process_state=${processState}`
  );
};

export const getActiveProcesses = (companyId, dataType, processState) => {
  return httpApiUrlV2.get(
    `/processes/${companyId}/organisations/?data_type=${dataType}&process_state=${processState}`
  );
};

// export const verifyProcessV2 = async (data) => {
//   return await httpProcess.post('/verification/', data);
// };

// export const markProcessV2 = async (data) => {
//   return await httpProcess.post('/mark/', data);
// };

// export const getProcessVerificationLinkV2 = async (processId) => {
//   return await httpProcess.get(`/verify/${processId}/`);
// };

// export const startDraftProcessingV2 = async (processId) => {
//   return await httpProcess.get(`/start/${processId}/`);
// };

// export const pauseOngoingProcessV2 = async (processId) => {
//   return await httpProcess.get(`/pause/${processId}/`);
// };

export const startDraftProcessingV2 = async (processId, data) => {
  return await httpProcess.post(`${processId}/trigger/`, data)
}

export const startOngoingProcessingV2 = async (processId, data) => {
  return await httpProcess.post(`${processId}/trigger/`, data)
}

export const finalizeOrReject = async (processId) => {
  return await httpProcess.post(`${processId}/finalize-or-reject/`)
}

export const processActionOptions = {
  saveWorkflowToDocument: 'save_workflow_to_document',
  saveAndStartProcess: 'save_and_start_processing',
};

export const newProcessActionOptions = {
  saveWorkflowToDocumentAndDrafts:
    'save_workflow_to_document_and_save_to_drafts',
  cancelProcessBeforeCompletion: 'cancel_process_before_completion',
  pauseProcessAfterCompletingOngoingStep:
    'pause_processing_after_completing_ongoing_step',
  resumeProcessingFromNextStep: 'resume_processing_from_next_step',
  testDocumentProcessWorkflowWise: 'test_document_processing_wf_wise',
  testDocumentProcessWorkflowStepWise: 'test_document_processing_wf_steps_wise',
  testDocumentProcessContentWise: 'test_document_processing_content_wise',
  startDocumentProcessingWorkflowWise: 'start_document_processing_wf_wise',
  startDocumentProcessingWorkflowStepWise:
    'start_document_processing_wf_steps_wise',
  startDocumentProcessingContentWise: 'start_document_processing_content_wise',
  closeProcessingAndMarkCompleted: 'close_processing_and_mark_as_completed',
};

export const processActionOptionsWithLinkReturned = [
  'test_document_processing_wf_wise',
  'test_document_processing_wf_steps_wise',
  'test_document_processing_content_wise',
  'start_document_processing_wf_wise',
  'start_document_processing_wf_steps_wise',
  'start_document_processing_content_wise',
];
