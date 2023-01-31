import { httpProcess } from "../httpCommon/httpCommon";

export const saveWorkflowsToDocument = async (data) => {
    return await httpProcess.post("new/", data);
}

export const startNewProcess = async (data) => {
    return await httpProcess.post("start/", data);
}

export const verifyProcess = async (data) => {
    return await httpProcess.post("verify/", data);
}

export const getProcessLink = async (data) => {
    return await httpProcess.post("link/", data);
}

export const processActionOptions = {
    saveWorkflowToDocument: "save_workflow_to_document",
    saveAndStartProcess: "save_and_start_processing",
}