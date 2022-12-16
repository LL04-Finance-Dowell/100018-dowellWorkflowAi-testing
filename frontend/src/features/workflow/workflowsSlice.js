import { createSlice } from "@reduxjs/toolkit";
import {
  createWorkflow,
  detailWorkflow,
  mineWorkflow,
  updateWorkflow,
} from "./asyncTHunks";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  workflow: {},
  workdlowDetail: null,
  updatedWorkflow: null,
  minedWorkflows: [],
  status: "idle",
  mineStatus: "idle",
  workflowDetailStatus: "idle",
  updateWorkflowStatus: "idle",
  errorMessage: null,
};

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createWorkflow
    builder.addCase(createWorkflow.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(createWorkflow.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.workflow = action.payload;
      state.minedWorkflows.push(action.payload);
    });
    builder.addCase(createWorkflow.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload;
    });
    //mineWorkflow
    builder.addCase(mineWorkflow.pending, (state) => {
      state.mineStatus = "pending";
    });
    builder.addCase(mineWorkflow.fulfilled, (state, action) => {
      state.mineStatus = "succeeded";
      state.minedWorkflows = action.payload.workflow
        ? action.payload.workflow.map((item) => ({
            ...item,
            workflows: {
              ...item.workflows,
              /* _id: uuidv4(), */
              steps: item.workflows.steps.map((step) => ({
                ...step,
                _id: uuidv4(),
              })),
            },
          }))
        : [];
    });
    builder.addCase(mineWorkflow.rejected, (state, action) => {
      state.mineStatus = "failed";
      state.errorMessage = action.payload;
    });
    //detailWorkflow
    builder.addCase(detailWorkflow.pending, (state) => {
      state.workflowDetailStatus = "pending";
    });
    builder.addCase(detailWorkflow.fulfilled, (state, action) => {
      state.workflowDetailStatus = "succeeded";
      state.workdlowDetail = action.payload;
    });
    builder.addCase(detailWorkflow.rejected, (state, action) => {
      state.workflowDetailStatus = "failed";
      state.errorMessage = action.payload;
    });
    //updateWorkflow
    builder.addCase(updateWorkflow.pending, (state) => {
      state.updateWorkflowStatus = "pending";
    });
    builder.addCase(updateWorkflow.fulfilled, (state, action) => {
      state.updateWorkflowStatus = "succeeded";
      state.updatedWorkflow = action.payload;
      state.minedWorkflows = state.minedWorkflows.map((item) =>
        item._id === action.payload.workflow_id
          ? {
              ...item,
              workflows: {
                ...item.workflows,
                workflow_title: action.payload.workflow_title,
                steps: action.payload.steps,
              },
            }
          : item
      );
    });
    builder.addCase(updateWorkflow.rejected, (state, action) => {
      state.updateWorkflowStatus = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = workflowSlice.actions;

export default workflowSlice.reducer;
