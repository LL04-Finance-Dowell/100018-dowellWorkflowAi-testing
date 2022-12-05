import { httpWorkflow } from "../httpCommon/httpCommon";

export class WorkflowServices {
  createWorkflow = (data) => {
    return httpWorkflow.post("/", data);
  };
}
