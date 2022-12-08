import axios from "axios";

const workflowAPIBaseURL = "https://100094.pythonanywhere.com/v0.1/";
const loginBaseURL = "https://100014.pythonanywhere.com/api/";

const authAxiosInstance = axios.create({
  withCredentials: true,
  baseURL: loginBaseURL,
});

const workflowAxiosInstance = axios.create({
  withCredentials: true,
  baseURL: workflowAPIBaseURL,
});

const dowellLoginUrl =
  "https://100014.pythonanywhere.com/?redirect_url=" +
  window.location.origin +
  "/100018-dowellWorkflowAi-testing/%23";
const dowellLogoutUrl =
  "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
  window.location.origin +
  "/100018-dowellWorkflowAi-testing/%23";

export {
  authAxiosInstance,
  dowellLoginUrl,
  workflowAxiosInstance,
  dowellLogoutUrl,
};
