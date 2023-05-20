import { createSlice } from "@reduxjs/toolkit";
import {
  createWorkflowSettings,
  updateWorkflowSettings,
  getWorkflowSettings,
} from "./asyncThunks";

const initialState = {
  createWorkflowSettings: null,
  getWorkflowSettings: null,
  updateWorkflowSettings: null,
  createStatus: "idle",
  getStatus: "idle",
  updateStatus: "idle",
  errorMessage: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createWorkflowSettings
    builder.addCase(createWorkflowSettings.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createWorkflowSettings.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      state.createWorkflowSettings = action.payload;
    });
    builder.addCase(createWorkflowSettings.rejected, (state, action) => {
      state.createStatus = "failed";
      state.errorMessage = action.payload;
    });
    //getWorkflowSettings
    builder.addCase(getWorkflowSettings.pending, (state) => {
      state.getStatus = "pending";
    });
    builder.addCase(getWorkflowSettings.fulfilled, (state, action) => {
      state.getStatus = "succeeded";
      state.getWorkflowSettings = action.payload;
    });
    builder.addCase(getWorkflowSettings.rejected, (state, action) => {
      state.getStatus = "failed";
      state.errorMessage = action.payload;
    });
    //updateWorkflowSettings
    builder.addCase(updateWorkflowSettings.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateWorkflowSettings.fulfilled, (state, action) => {
      state.updateStatus = "succeeded";
      state.updateWorkflowSettings = action.payload;
    });
    builder.addCase(updateWorkflowSettings.rejected, (state, action) => {
      state.updateStatus = "failed";
      state.errorMessage = action.payload;
    });
  },
});

export const {} = settingsSlice.actions;

export default settingsSlice.reducer;
