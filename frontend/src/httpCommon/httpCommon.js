import axios from "axios";

const api_url = "https://100094.pythonanywhere.com/v0.1/";
const auth_url = "https://100014.pythonanywhere.com/api/";

export const httpWorkflow = axios.create({
  baseURL: api_url + "/workflows",
});

export const httpTemplate = axios.create({ baseURL: api_url + "/templates" });

export const httpDocument = axios.create({ baseURL: api_url + "/documents" });

export const httpAuth = axios.create({ baseURL: auth_url });
