import { createSlice } from "@reduxjs/toolkit";
import {
  createWorkflow,
  detailWorkflow,
  mineWorkflows,
  savedWorkflows,
  updateWorkflow,
  allWorkflows,
} from "./asyncTHunks";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  workflow: {},
  workdlowDetail: null,
  updatedWorkflow: null,
  minedWorkflows: [],
  savedWorkflowItems: [],
  allWorkflows: [],
  status: "idle",
  savedWorkflowStatus: "idle",
  mineStatus: "idle",
  workflowDetailStatus: "idle",
  updateWorkflowStatus: "idle",
  allWorkflowsStatus: "idle",
  errorMessage: null,
};

const userDetail = sessionStorage.getItem("userDetail")
  ? JSON.parse(sessionStorage.getItem("userDetail"))
  : null;

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    removeFromMinedWf: (state, action) => {
      state.allWorkflows = state.allWorkflows.filter(
        (item) => item._id !== action.payload
      );
    },
    setAllWorkflows: (state, action) => {
      state.allWorkflows = action.payload
    },
  },
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
    //mineWorkflows
    builder.addCase(mineWorkflows.pending, (state) => {
      state.mineStatus = "pending";
    });
    builder.addCase(mineWorkflows.fulfilled, (state, action) => {
      state.mineStatus = "succeeded";
      state.minedWorkflows = action.payload;
    });
    builder.addCase(mineWorkflows.rejected, (state, action) => {
      state.mineStatus = "failed";
      state.errorMessage = action.payload;
    });
    //savedWorkflows
    builder.addCase(savedWorkflows.pending, (state) => {
      state.savedWorkflowStatus = "pending";
    });
    builder.addCase(savedWorkflows.fulfilled, (state, action) => {
      state.savedWorkflowStatus = "succeeded";
      state.savedWorkflowItems = action.payload;
    });
    builder.addCase(savedWorkflows.rejected, (state, action) => {
      state.savedWorkflowStatus = "failed";
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
      state.minedWorkflows = [...state.minedWorkflows, action.payload];
    });
    builder.addCase(updateWorkflow.rejected, (state, action) => {
      state.updateWorkflowStatus = "failed";
      state.errorMessage = action.payload;
    });
    //allWorkflows
    builder.addCase(allWorkflows.pending, (state) => {
      state.allWorkflowsStatus = "pending";
    });
    builder.addCase(allWorkflows.fulfilled, (state, action) => {
      state.allWorkflowsStatus = "succeeded";
      state.allWorkflows = action.payload;
    });
    builder.addCase(allWorkflows.rejected, (state, action) => {
      state.allWorkflowsStatus = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { removeFromMinedWf, setAllWorkflows } = workflowSlice.actions;

export default workflowSlice.reducer;
