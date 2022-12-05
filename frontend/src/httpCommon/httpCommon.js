import axios from "axios";

const api_url = "https://100094.pythonanywhere.com/v0.1/";

export const httpWorkflow = axios.create({
  baseURL: api_url + "/workflows",
});

export const httpTemplate = axios.create({ baseURL: api_url + "/templates" });

export const httpDocument = axios.create({ baseURL: api_url + "/documents" });
