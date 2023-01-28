import { httpApiUrl } from "../httpCommon/httpCommon";

export class WorkflowSettingServices {
  createWorkflowSettings = (data) => {
    return httpApiUrl.post("workflow_ai_setting/", data);
  };

  getWorkflowSettings = (data) => {
    return httpApiUrl.post("get_WFAI_setting/", data);
  };

  updateWorkflowSettings = (data) => {
    return httpApiUrl.post("update_WFAI_setting/", data);
  };
}
