import { legalAxiosInstance } from "./axios";

export const registerNewWebsite = async (data) => {
    return await legalAxiosInstance.post("legalpolicies/", data);
}

export const getAgreeStatus = async (eventId) => {
    return await legalAxiosInstance.get(`legalpolicies/${eventId}/iagreestatus/`)
}
