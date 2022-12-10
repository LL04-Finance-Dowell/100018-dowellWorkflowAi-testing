import { createSlice } from "@reduxjs/toolkit";
import {
  createDocument,
  detailDocument,
  drafts,
  mineDocuments,
  rejectedDocuments,
  signDocument,
} from "./asyncThunks";

const initialState = {
  createdDocument: null,
  detailDocument: null,
  signedDocument: null,
  minedDocuments: [],
  rejectedDocuments: null,
  drafts: null,
  status: "idle",
  editorStatus: "idle",
  createDocumentStatus: "idle",
  mineStatus: "idle",
  draftStatu: "idle",
  errorMessage: null,
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createDocument
    builder.addCase(createDocument.pending, (state) => {
      state.editorStatus = "pending";
    });
    builder.addCase(createDocument.fulfilled, (state, action) => {
      state.editorStatus = "succeeded";
      state.createdDocument = action.payload;
      state.minedDocuments = [...(state.minedDocuments || {}), action.payload];
    });
    builder.addCase(createDocument.rejected, (state, action) => {
      state.editorStatus = "failed";
      state.errorMessage = action.payload;
    });
    //detailDocument
    builder.addCase(detailDocument.pending, (state) => {
      state.editorStatus = "pending";
    });
    builder.addCase(detailDocument.fulfilled, (state, action) => {
      state.editorStatus = "succeeded";
      state.detailDocument = action.payload;
    });
    builder.addCase(detailDocument.rejected, (state, action) => {
      state.editorStatus = "failed";
      state.errorMessage = action.payload;
    });
    //signDocument
    builder.addCase(signDocument.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(signDocument.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.signedDocument = action.payload;
    });
    builder.addCase(signDocument.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload;
    });
    //mineDocuments
    builder.addCase(mineDocuments.pending, (state) => {
      state.mineStatus = "pending";
    });
    builder.addCase(mineDocuments.fulfilled, (state, action) => {
      state.mineStatus = "succeeded";
      state.minedDocuments = action.payload;
    });
    builder.addCase(mineDocuments.rejected, (state, action) => {
      state.mineStatus = "failed";
      state.errorMessage = action.payload;
    });
    //rejectedDocuments
    builder.addCase(rejectedDocuments.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(rejectedDocuments.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.rejectedDocuments = action.payload;
    });
    builder.addCase(rejectedDocuments.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload;
    });
    //drafts
    builder.addCase(drafts.pending, (state) => {
      state.draftStatu = "pending";
    });
    builder.addCase(drafts.fulfilled, (state, action) => {
      state.draftStatu = "succeeded";
      state.drafts = action.payload;
    });
    builder.addCase(drafts.rejected, (state, action) => {
      state.draftStatu = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = documentSlice.actions;

export default documentSlice.reducer;
