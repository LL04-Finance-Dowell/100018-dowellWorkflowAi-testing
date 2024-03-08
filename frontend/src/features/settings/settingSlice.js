import { createSlice } from '@reduxjs/toolkit';
import {
  createWorkflowSettings,
  updateWorkflowSettings,
  getWorkflowSettings,
} from './asyncThunks';

const initialState = {
  createWorkflowSettings: null,
  getWorkflowSettings: null,
  updateWorkflowSettings: null,
  createStatus: 'idle',
  getStatus: 'idle',
  updateStatus: 'idle',
  errorMessage: null,
};

const setStatus = (state, action, statusKey) => {
  state[statusKey] = action.payload ? 'succeeded' : 'failed';
  state.errorMessage = action.payload;
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const createAsyncReducer = (thunk, statusKey) => {
      builder
        .addCase(thunk.pending, (state) => {
          state[statusKey] = 'pending';
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state[statusKey] = 'succeeded';
          state[thunk.name] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state[statusKey] = 'failed';
          state.errorMessage = action.payload;
        });
    };

    createAsyncReducer(createWorkflowSettings, 'createStatus');
    createAsyncReducer(getWorkflowSettings, 'getStatus');
    createAsyncReducer(updateWorkflowSettings, 'updateStatus');
  },
});

export default settingsSlice.reducer;

