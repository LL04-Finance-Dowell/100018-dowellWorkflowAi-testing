import { createSlice } from '@reduxjs/toolkit';
import {
  createWorkflow,
  detailWorkflow,
  mineWorkflows,
  savedWorkflows,
  updateWorkflow,
  allWorkflows,
} from './asyncTHunks';

const initialState = {
  workflow: {},
  workdlowDetail: null,
  updatedWorkflow: null,
  minedWorkflows: [],
  savedWorkflowItems: [],
  allWorkflows: [],
  status: 'idle',
  savedWorkflowStatus: 'idle',
  mineStatus: 'idle',
  workflowDetailStatus: 'idle',
  updateWorkflowStatus: 'idle',
  allWorkflowsStatus: 'idle',
  errorMessage: null,
};

const setStatus = (state, action, statusKey) => {
  state[statusKey] = action.payload ? 'succeeded' : 'failed';
  state.errorMessage = action.payload;
};

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    removeFromMinedWf: (state, action) => {
      state.allWorkflows = state.allWorkflows.filter(
        (item) => item._id !== action.payload
      );
    },
    setAllWorkflows: (state, action) => {
      state.allWorkflows = action.payload;
    },
  },
  extraReducers: (builder) => {
    const createAsyncReducer = (thunk, statusKey, stateKey) => {
      builder
        .addCase(thunk.pending, (state) => {
          state[statusKey] = 'pending';
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state[statusKey] = 'succeeded';
          if (stateKey) {
            state[stateKey] = action.payload;
          }
          if (thunk === createWorkflow || thunk === updateWorkflow) {
            state.minedWorkflows.push(action.payload);
          }
        })
        .addCase(thunk.rejected, (state, action) => {
          state[statusKey] = 'failed';
          state.errorMessage = action.payload;
        });
    };

    createAsyncReducer(createWorkflow, 'status', 'workflow');
    createAsyncReducer(detailWorkflow, 'workflowDetailStatus', 'workdlowDetail');
    createAsyncReducer(mineWorkflows, 'mineStatus', 'minedWorkflows');
    createAsyncReducer(savedWorkflows, 'savedWorkflowStatus', 'savedWorkflowItems');
    createAsyncReducer(updateWorkflow, 'updateWorkflowStatus', 'updatedWorkflow');
    createAsyncReducer(allWorkflows, 'allWorkflowsStatus', 'allWorkflows');
  },
});

export const { removeFromMinedWf, setAllWorkflows } = workflowSlice.actions;

export default workflowSlice.reducer;

