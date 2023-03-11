import axios from "axios";

const api_url = "https://100094.pythonanywhere.com/v0.1/";
const auth_url = "https://100014.pythonanywhere.com/api/";
const auth_url_other = "https://100093.pythonanywhere.com/api/";
const new_process_api_url = "https://100094.pythonanywhere.com/v0.2/";

export const dowellLoginUrl =
  "https://100014.pythonanywhere.com/?redirect_url=" +
  window.location.origin +
  "/100018-dowellWorkflowAi-testing/%23";
export const dowellLogoutUrl =
  "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
  window.location.origin +
  "/100018-dowellWorkflowAi-testing/%23";

export const httpWorkflow = axios.create({
  baseURL: api_url + "workflows",
});

export const httpApiUrl = axios.create({ baseURL: api_url });

export const httpTemplate = axios.create({ baseURL: api_url + "templates" });

export const httpDocument = axios.create({ baseURL: api_url + "documents" });

export const httpAuth = axios.create({ baseURL: auth_url });

export const httpAuthOther = axios.create({ baseURL: auth_url_other });

export const httpProcess = axios.create({ baseURL: api_url + "process" });

export const newHttpProcess = axios.create({
  baseURL: new_process_api_url + "process",
});

export const searchHttpInstance = axios.create({ baseURL: api_url + "search" });

export const httpFovorites = axios.create({ baseURL: api_url + "favorites" });

export const httpFovorite = axios.create({ baseURL: new_process_api_url });
