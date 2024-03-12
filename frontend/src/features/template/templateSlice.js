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

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setAllTemplates: (state, action) => {
      state.allTemplates = action.payload;
    },
  },
  extraReducers: (builder) => {
    //createTemplate
    builder.addCase(createTemplate.pending, (state) => {
      state.editorStatus = 'pending';
    });
    builder.addCase(createTemplate.fulfilled, (state, action) => {
      state.editorStatus = 'succeeded';
      state.templateEditor = action.payload;
    });
    builder.addCase(createTemplate.rejected, (state, action) => {
      state.editorStatus = 'failed';
      state.errorMessage = action.payload;
    });
    //detailTemplate
    builder.addCase(detailTemplate.pending, (state) => {
      state.editorStatus = 'pending';
    });
    builder.addCase(detailTemplate.fulfilled, (state, action) => {
      state.editorStatus = 'succeeded';
      state.detailTemplate = action.payload;
    });
    builder.addCase(detailTemplate.rejected, (state, action) => {
      state.editorStatus = 'failed';
      state.errorMessage = action.payload;
    });
    //mineTemplates
    builder.addCase(mineTemplates.pending, (state) => {
      state.mineStatus = 'pending';
    });
    builder.addCase(mineTemplates.fulfilled, (state, action) => {
      state.mineStatus = 'succeeded';
      state.minedTemplates = action.payload;
    });
    builder.addCase(mineTemplates.rejected, (state, action) => {
      state.mineStatus = 'failed';
      state.errorMessage = action.payload;
    });
    //savedTemplates
    builder.addCase(savedTemplates.pending, (state) => {
      state.savedTemplatesItemsStatus = 'pending';
    });
    builder.addCase(savedTemplates.fulfilled, (state, action) => {
      state.savedTemplatesItemsStatus = 'succeeded';
      state.savedTemplatesItems = action.payload;
    });
    builder.addCase(savedTemplates.rejected, (state, action) => {
      state.savedTemplatesItemsStatus = 'failed';
      state.errorMessage = action.payload;
    });
    //allTemplates
    builder.addCase(allTemplates.pending, (state) => {
      state.allTemplatesStatus = 'pending';
    });
    builder.addCase(allTemplates.fulfilled, (state, action) => {
      state.allTemplatesStatus = 'succeeded';
      state.allTemplates = action.payload;
    });
    builder.addCase(allTemplates.rejected, (state, action) => {
      state.allTemplatesStatus = 'failed';
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setAllTemplates } = templateSlice.actions;

export default templateSlice.reducer;