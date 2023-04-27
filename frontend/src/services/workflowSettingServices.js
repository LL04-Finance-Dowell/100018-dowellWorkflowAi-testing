import { httpApiUrl } from '../httpCommon/httpCommon';

export class WorkflowSettingServices {
  createWorkflowSettings = (data) => {
    return httpApiUrl.post('workflow_ai_setting/', data);
  };

  getWorkflowSettings = (wfSettingId) => {
    return httpApiUrl.get(`workflow-settings/${wfSettingId}/`);
  };

  updateWorkflowSettings = (wfSettingId, data) => {
    return httpApiUrl.put(`workflow-settings/${wfSettingId}/`, data);
  };

  createWorkflowTeam = (data) => {
    return httpApiUrl.post('teams/', data);
  };

  updateWorkflowTeam = (data) => {
    return httpApiUrl.post('update-to-teams/', data);
  };

  updateEnableDisableProcesses = (data) => {
    return httpApiUrl.post('settings/', data);
  };

  getAllTeams = (companyId) => {
    return httpApiUrl.get(`companies/${companyId}/teams/`);
  };
}
