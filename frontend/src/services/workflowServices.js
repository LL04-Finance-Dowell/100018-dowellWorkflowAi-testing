import { httpWorkflow } from "../httpCommon/httpCommon";

export class WorkflowServices {
  createWorkflow = (data) => {
    return httpWorkflow.post("/", data);
  };

  mineWorkflows = (data) => {
    return httpWorkflow.post("/mine/", data);
  };

  detailWorkflow = (data) => {
    return httpWorkflow.post("/detail/", data);
  };
  updateWorkflow = (data) => {
    return httpWorkflow.post("/update/", data);
  };
  savedWorkflows = (data) => {
    return httpWorkflow.post("/saved/", data);
  };
  allWorkflows = (data) => {
    return httpWorkflow.post("/all/", data);
  };
}
