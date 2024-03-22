import { httpApiUrlV2 } from '../httpCommon/httpCommon';

export class WorkflowSettingServices {
  createWorkflowSettings = (data) => {
    return httpApiUrlV2.post('settings/', data);
    // return httpApiUrlV2.post('settings/', data);
    // return httpApiUrlV2.post('workflow_ai_setting/', data);
  };

  getWorkflowSettings = (settingId) => {
    return httpApiUrlV2.get(`settings/${settingId}/`);
  };

  updateWorkflowSettings = (settingId, data) => {
    return httpApiUrlV2.put(`settings/${settingId}/`, data);
  };

  createWorkflowTeam = (data) => {
    return httpApiUrlV2.post('teams/', data);
  };

  updateWorkflowTeam = (teamId, data) => {
    return httpApiUrlV2.put(`teams/${teamId}`, data);
    // teams/<str:team_id>/
  };

  // updateEnableDisableProcesses = (data) => {
  //   return httpApiUrl.post('settings/', data);
  // };

  updateWorkflowAISettings = (settingId, data) => {
    // return httpApiUrlV2.put(`settings/${settingId}/`, data);
    return httpApiUrlV2.put(`settings/64f7b5bcc72975ac5f765d33/`, data);
    // settings/<str:setting_id> 
  };

  getAllTeams = (companyId, dataType) => {
    return httpApiUrlV2.get(`teams/${companyId}/organisations/?data_type=${dataType}`);
  };

  fetchWorkflowSettings = (companyId) => {
    return httpApiUrlV2.get(`/settings/${companyId}/organisations/`);
  };

  fetchWorkflowSettingsData = (companyId, member) => {
    return httpApiUrlV2.get(`/settings/${companyId}/organisations/?member=${member}/`);
    // return httpApiUrlV2.get(`settings/${companyId}/organisations/?member=${member}`);
    // settings/<str:company_id>/organisations/?member="member"
    // {{base_url}}/settings/:company_id/?created_by
  };
}