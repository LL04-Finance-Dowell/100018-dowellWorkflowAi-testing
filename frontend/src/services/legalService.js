import { legalAxiosInstance } from "./axios";

export const workflowRegistrationEventId = "FB1010000000167293994856897783";

export const getAgreeStatus = async (sessionId) => {
    return await legalAxiosInstance.get(`legalpolicies/${sessionId}/iagreestatus/`)
}
