import { httpApiUrl, httpWorkflow,httpWorkflowNew } from '../httpCommon/httpCommon';

export class WorkflowServices {
  createWorkflow = (data) => {
    return httpWorkflow.post('/', data);
  };

  mineWorkflows = (data) => {
    return httpWorkflow.post('/mine/', data);
  };

  detailWorkflow = (workflowId) => {
    return httpWorkflow.get(`/${workflowId}/`);
  };
  updateWorkflow = (workflowId, data) => {
    return httpWorkflow.put(`/${workflowId}/`, data);
  };
  savedWorkflows = (data) => {
    return httpWorkflow.post('/saved/', data);
  };
  allWorkflows = (companyId, dataType) => {
    return httpApiUrl.get(`/companies/${companyId}/workflows/?data_type=${dataType}`);
  };
  
  ////new update for workflow
updateWorkflowNew = (workflowId, data) => {
  return httpWorkflowNew.put(`/${workflowId}/`, data);
};
}


