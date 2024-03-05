import { createSlice } from '@reduxjs/toolkit';
import {
  createTemplate,
  mineTemplates,
  detailTemplate,
  savedTemplates,
  allTemplates,
} from './asyncThunks';

const initialState = {
  templateEditor: null,
  detailTemplate: null,
  minedTemplates: [],
  savedTemplatesItems: [],
  allTemplates: [],
  status: 'idle',
  editorStatus: 'idle',
  mineStatus: 'idle',
  savedTemplatesItemsStatus: 'idle',
  allTemplatesStatus: 'idle',
  errorMessage: null,
};

const setStatus = (state, action, statusKey) => {
  state[statusKey] = action.payload ? 'succeeded' : 'failed';
  state.errorMessage = action.payload;
};

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setAllTemplates: (state, action) => {
      state.allTemplates = action.payload;
    },
  },
  extraReducers: (builder) => {
    const createAsyncReducer = (thunk, statusKey) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.editorStatus = 'pending';
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.editorStatus = 'succeeded';
          state.templateEditor = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.editorStatus = 'failed';
          state.errorMessage = action.payload;
        });
    };

    // createAsyncReducer function to reduce repetitive logic in adding async reducers
    createAsyncReducer(createTemplate, 'editorStatus');
    createAsyncReducer(detailTemplate, 'editorStatus');
    createAsyncReducer(mineTemplates, 'mineStatus');
    createAsyncReducer(savedTemplates, 'savedTemplatesItemsStatus');
    createAsyncReducer(allTemplates, 'allTemplatesStatus');
  },
});

export const { setAllTemplates } = templateSlice.actions;

export default templateSlice.reducer;