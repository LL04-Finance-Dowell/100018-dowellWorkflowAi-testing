import { legalAxiosInstance } from "./axios";

export const getAgreeStatus = async (eventId) => {
    return await legalAxiosInstance.get(`legalpolicies/${eventId}/iagreestatus/`)
}
