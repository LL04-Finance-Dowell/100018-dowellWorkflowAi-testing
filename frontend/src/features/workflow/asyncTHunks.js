import { createAsyncThunk } from "@reduxjs/toolkit";
import { WorkflowServices } from "../../services/workflowServices";
import { setCurrentWorkflow, setToggleManageFileForm } from "../app/appSlice";
import { removeFromMinedWf } from "./workflowsSlice";

const workflowServices = new WorkflowServices();

export const createWorkflow = createAsyncThunk(
  "workflow/create",
  async ({ data, notify, handleAfterCreated }) => {
    try {
      const res = await workflowServices.createWorkflow(data);

      console.log("resssssss1", res.data);

      notify(res.data.workflow.workflows.workflow_title);

      handleAfterCreated();

      return res.data.workflow;
    } catch (error) {
      console.log(error);
    }
  }
);

export const mineWorkflow = createAsyncThunk(
  "workflow/mine",
  async (data, thunkAPI) => {
    try {
      const res = await workflowServices.mineWorkflow(data);

      console.log(
        "mine workflowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        res.data
      );

      let workflows = [];

      if (res.data.workflow?.length > 0) {
        workflows = res.data.workflow.filter(
          (item) =>
            item.workflows.data_type ===
            thunkAPI.getState().auth?.userDetail?.portfolio_info?.data_type
        );
      } else {
        workflows = [];
      }

      return workflows;
    } catch (error) {
      console.log(error);
    }
  }
);

export const detailWorkflow = createAsyncThunk(
  "workflow/detail",
  async (data, asyncTHunks) => {
    try {
      const res = await workflowServices.detailWorkflow(data);

      console.log("detailWorkflow", res.data.workflow);

      asyncTHunks.dispatch(setCurrentWorkflow(res.data.workflow));

      return res.data.workflow;
    } catch (error) {
      console.log(error);
      asyncTHunks.dispatch(setToggleManageFileForm(false));
    }
  }
);

export const updateWorkflow = createAsyncThunk(
  "workflow/update",
  async ({ updateData, handleAfterCreated }, thunkAPI) => {
    try {
      const res = await workflowServices.updateWorkflow(updateData);

      console.log("updateWorkflow", res.data.workflow);

      thunkAPI.dispatch(removeFromMinedWf(updateData.workflow_id));

      handleAfterCreated();

      return res.data.workflow;
    } catch (error) {
      console.log(error);
    }
  }
);
