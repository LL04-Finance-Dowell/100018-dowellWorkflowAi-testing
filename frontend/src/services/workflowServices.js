import { httpWorkflow } from "../httpCommon/httpCommon";

export class WorkflowServices {
  createWorkflow = (data) => {
    return httpWorkflow.post("/", data);
  };

  mineWorkflows = (data) => {
    return httpWorkflow.post("/mine/", data);
  };

  detailWorkflow = (workflowId) => {
    return httpWorkflow.get(`/${workflowId}/`);
  };
  updateWorkflow = (data) => {
    return httpWorkflow.post("/update/", data);
  };
  savedWorkflows = (data) => {
    return httpWorkflow.post("/saved/", data);
  };
  allWorkflows = (companyId) => {
    return httpWorkflow.get(`/org/${companyId}/`);
  };
}
