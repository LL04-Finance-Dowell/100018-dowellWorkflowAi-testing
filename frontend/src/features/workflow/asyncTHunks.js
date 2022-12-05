import { createAsyncThunk } from "@reduxjs/toolkit";
import { WorkflowServices } from "../../services/workflowServices";

const workflowServices = new WorkflowServices();

export const createWorkflow = createAsyncThunk(
  "workflow/create",
  async (data) => {
    try {
      const res = await workflowServices.createWorkflow(data);

      console.log("resssssss1", res);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
