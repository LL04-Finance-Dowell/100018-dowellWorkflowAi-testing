import { httpProcess } from "../httpCommon/httpCommon";

export const createNewProcess = async (data) => {
    return await httpProcess.post("new/", data);
}
