import { createSlice } from "@reduxjs/toolkit";
import {
  createDocument,
  detailDocument,
  savedDocuments,
  mineDocuments,
  rejectedDocuments,
  signDocument,
  contentDocument,
} from "./asyncThunks";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  createdDocument: null,
  detailDocument: null,
  signedDocument: null,
  minedDocuments: [],
  rejectedDocuments: null,
  contentOfDocument: null,
  savedDocumentsItems: [],
  status: "idle",
  editorStatus: "idle",
  createDocumentStatus: "idle",
  mineStatus: "idle",
  savedDocumentsStatus: "idle",
  contentOfDocumentStatus: "idle",
  errorMessage: null,
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setContentOfDocument: (state, action) => {
      state.contentOfDocument = action.payload;
    },
  },
  extraReducers: (builder) => {
    //createDocument
    builder.addCase(createDocument.pending, (state) => {
      state.editorStatus = "pending";
    });
    builder.addCase(createDocument.fulfilled, (state, action) => {
      state.editorStatus = "succeeded";
      state.createdDocument = action.payload;
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
    //savedDocuments
    builder.addCase(savedDocuments.pending, (state) => {
      state.savedDocumentsStatus = "pending";
    });
    builder.addCase(savedDocuments.fulfilled, (state, action) => {
      state.savedDocumentsStatus = "succeeded";
      state.savedDocumentsItems = action.payload;
    });
    builder.addCase(savedDocuments.rejected, (state, action) => {
      state.savedDocumentsStatus = "failed";
      state.errorMessage = action.payload;
    });
    //contentDocumetn
    builder.addCase(contentDocument.pending, (state) => {
      state.contentOfDocumentStatus = "pending";
    });
    builder.addCase(contentDocument.fulfilled, (state, action) => {
      state.contentOfDocumentStatus = "succeeded";
      state.contentOfDocument = action.payload
        ? action.payload.map((item) => typeof item !== "object" ? null : Object.values(item)[0].map(content => ({ ...content, pageNum: Object.keys(item)[0] ,_id: uuidv4() })) ).filter(item => item).flat()
        : [];
    });
    builder.addCase(contentDocument.rejected, (state, action) => {
      state.contentOfDocumentStatus = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setContentOfDocument } = documentSlice.actions;

export default documentSlice.reducer;
