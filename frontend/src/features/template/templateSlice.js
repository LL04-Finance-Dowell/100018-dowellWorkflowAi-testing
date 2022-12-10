import { createSlice } from "@reduxjs/toolkit";
import {
  createTemplate,
  mineTemplates,
  detailTemplate,
  draftsTemplate,
} from "./asyncThunks";

const initialState = {
  templateEditor: null,
  detailTemplate: null,
  minedTemplates: [],
  /* draftsTemlateItems: [], */
  status: "idle",
  editorStatus: "idle",
  mineStatus: "idle",
  draftsTemplateStatu: "idle",
  errorMessage: null,
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  extraReducers: (builder) => {
    //createTemplate
    builder.addCase(createTemplate.pending, (state) => {
      state.editorStatus = "pending";
    });
    builder.addCase(createTemplate.fulfilled, (state, action) => {
      state.editorStatus = "succeeded";
      state.templateEditor = action.payload;
      state.minedTemplates = [...(state.minedTemplates || {}), action.payload];
    });
    builder.addCase(createTemplate.rejected, (state, action) => {
      state.editorStatus = "failed";
      state.errorMessage = action.payload;
    });
    //detailTemplate
    builder.addCase(detailTemplate.pending, (state) => {
      state.editorStatus = "pending";
    });
    builder.addCase(detailTemplate.fulfilled, (state, action) => {
      state.editorStatus = "succeeded";
      state.detailTemplate = action.payload;
    });
    builder.addCase(detailTemplate.rejected, (state, action) => {
      state.editorStatus = "failed";
      state.errorMessage = action.payload;
    });
    //mineTemplates
    builder.addCase(mineTemplates.pending, (state) => {
      state.mineStatus = "pending";
    });
    builder.addCase(mineTemplates.fulfilled, (state, action) => {
      state.mineStatus = "succeeded";
      state.minedTemplates = action.payload;
    });
    builder.addCase(mineTemplates.rejected, (state, action) => {
      state.mineStatus = "failed";
      state.errorMessage = action.payload;
    });
    /*   //draftsTemplate
    builder.addCase(draftsTemplate.pending, (state) => {
      state.draftsTemplateStatu = "pending";
    });
    builder.addCase(draftsTemplate.fulfilled, (state, action) => {
      state.draftsTemplateStatu = "succeeded";
      state.draftsTemlateItems = action.payload;
    });
    builder.addCase(draftsTemplate.rejected, (state, action) => {
      state.draftsTemplateStatu = "failed";
      state.errorMessage = action.payload;
    }); */
  },
});

// Action creators are generated for each case reducer function
export const {} = templateSlice.actions;

export default templateSlice.reducer;
