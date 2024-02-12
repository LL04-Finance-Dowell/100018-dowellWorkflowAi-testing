import { locationAxiosInstance } from "./axios";

export const getContinents = async (username, sessionId) => {
    return await locationAxiosInstance.get(`/continents/${username}/${sessionId}/100074`);
}

export const getRegionsInCountry = async (username, sessionId, country) => {
    return await locationAxiosInstance.get(`/region/name/${country}/${username}/${sessionId}/100074`);
}
