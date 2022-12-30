import { httpProcess } from "../httpCommon/httpCommon";

export const saveWorkflowsToDocument = async (data) => {
    return await httpProcess.post("new/", data);
}

export const startNewProcess = async (data) => {
    return await httpProcess.post("start/", data);
}