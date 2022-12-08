import { createSlice } from "@reduxjs/toolkit";
import { createWorkflow, detailWorkflow, mineWorkflow } from "./asyncTHunks";

const initialState = {
  workflow: {},
  editorLink: null,
  minedWorkflows: [],
  status: "idle",
  mineStatus: "idle",
  editorStatus: "idle",
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
      state.minedWorkflows = action.payload;
    });
    builder.addCase(mineWorkflow.rejected, (state, action) => {
      state.mineStatus = "failed";
      state.errorMessage = action.payload;
    });
    //detailWorkflow
    builder.addCase(detailWorkflow.pending, (state) => {
      state.editorStatus = "pending";
    });
    builder.addCase(detailWorkflow.fulfilled, (state, action) => {
      state.editorStatus = "succeeded";
      state.editorLink = action.payload;
    });
    builder.addCase(detailWorkflow.rejected, (state, action) => {
      state.editorStatus = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = workflowSlice.actions;

export default workflowSlice.reducer;
