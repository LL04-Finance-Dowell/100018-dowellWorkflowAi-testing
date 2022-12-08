import { createAsyncThunk } from "@reduxjs/toolkit";
import { WorkflowServices } from "../../services/workflowServices";
import { setEditorLink } from "../app/appSlice";

const workflowServices = new WorkflowServices();

export const createWorkflow = createAsyncThunk(
  "workflow/create",
  async ({ data, notify, handleAfterCreated }) => {
    try {
      const res = await workflowServices.createWorkflow(data);

      console.log("resssssss1", res.data.workflow.workflows.workflow_title);

      notify(res.data.workflow.workflows.workflow_title);

      handleAfterCreated();

      return res.data.workflow;
    } catch (error) {
      console.log(error);
    }
  }
);

export const mineWorkflow = createAsyncThunk("workflow/mine", async (data) => {
  try {
    const res = await workflowServices.mineWorkflow(data);

    console.log("mine workflow", res.data);

    return res.data.Workflows;
  } catch (error) {
    console.log(error);
  }
});

export const detailWorkflow = createAsyncThunk(
  "workflow/detail",
  async (data, asyncTHunks) => {
    try {
      const res = await workflowServices.detailWorkflow(data);

      console.log("detailWorkflow", res.data);

      asyncTHunks.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
