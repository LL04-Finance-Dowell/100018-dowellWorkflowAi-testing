import { createSlice } from "@reduxjs/toolkit";
import { createWorkflow } from "./asyncTHunks";

const initialState = {
  workflow: {},
  status: "idle",
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
  },
});

// Action creators are generated for each case reducer function
export const {} = workflowSlice.actions;

export default workflowSlice.reducer;
