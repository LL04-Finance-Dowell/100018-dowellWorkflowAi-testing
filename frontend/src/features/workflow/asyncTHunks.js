import { createAsyncThunk } from "@reduxjs/toolkit";
import { WorkflowServices } from "../../services/workflowServices";

const workflowServices = new WorkflowServices();

export const createWorkflow = createAsyncThunk(
  "workflow/create",
  async ({ data, notify }) => {
    try {
      const res = await workflowServices.createWorkflow(data);

      console.log("resssssss1", res.data.workflow.workflows.workflow_title);

      notify(res.data.workflow.workflows.workflow_title);

      return res.data.workflow;
    } catch (error) {
      console.log(error);
    }
  }
);
