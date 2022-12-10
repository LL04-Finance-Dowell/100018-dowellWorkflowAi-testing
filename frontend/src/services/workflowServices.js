import { httpWorkflow } from "../httpCommon/httpCommon";

export class WorkflowServices {
  createWorkflow = (data) => {
    return httpWorkflow.post("/", data);
  };

  mineWorkflow = (data) => {
    return httpWorkflow.post("/mine", data);
  };

  detailWorkflow = (data) => {
    return httpWorkflow.post("/detail", data);
  };
  updateWorkflow = (data) => {
    return httpWorkflow.post("/update", data);
  };
}
