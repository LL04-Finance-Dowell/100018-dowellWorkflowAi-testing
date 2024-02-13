// import { httpApiUrlV2 } from '../httpCommon/httpCommon';

// export class WorkflowSettingServices {
//   createWorkflowSettings = (data) => {
//     return httpApiUrlV2.post('settings/', data);
//     // return httpApiUrlV2.post('workflow_ai_setting/', data);
//   };

//   getWorkflowSettings = (wfSettingId) => {
//     return httpApiUrlV2.get(`settings/${wfSettingId}/`);
//   };

//   updateWorkflowSettings = (wfSettingId, data) => {
//     return httpApiUrlV2.put(`settings/${wfSettingId}/`, data);
//   };

//   createWorkflowTeam = (data) => {
//     return httpApiUrlV2.post('settings/', data);
//   };

//   updateWorkflowTeam = (teamId, data) => {
//     return httpApiUrlV2.put(`teams/${teamId}`, data);
//     // teams/<str:team_id>/
//   };

//   // updateEnableDisableProcesses = (data) => {
//   //   return httpApiUrl.post('settings/', data);
//   // };

//   updateWorkflowAISettings = (wfSettingId, data) => {
//     return httpApiUrlV2.put(`settings/${wfSettingId}/`, data);
//     // settings/<str:setting_id> 
//   };

//   getAllTeams = (companyId) => {
//     return httpApiUrlV2.get(`teams/${companyId}/organisations/`);
//   };

//   fetchWorkflowSettings = (companyId) => {
//     return httpApiUrlV2.get(`settings/${companyId}/organisations/`);
//   };

//   fetchWorkflowSettingsData = (companyId, member) => {
//     return httpApiUrlV2.get(`settings/${companyId}?member=${member}`);
//     // return httpApiUrlV2.get(`settings/${companyId}/organisations/?member=${member}`);
//     // settings/<str:company_id>/organisations/?member="member"
//   };
// }


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

  // updateEnableDisableProcesses = (data) => {
  //   return httpApiUrl.post('settings/', data);
  // };

  updateWorkflowAISettings = (data) => {
    return httpApiUrl.post('update-settings/', data);
  };

  getAllTeams = (companyId) => {
    return httpApiUrl.get(`companies/${companyId}/teams/`);
  };

  fetchWorkflowSettings = (companyId) => {
    return httpApiUrl.get(`companies/${companyId}/settings/`);
  };

  fetchWorkflowSettingsData = (companyId, member) => {
    return httpApiUrl.get(`settings/${companyId}?member=${member}`);
  };
}