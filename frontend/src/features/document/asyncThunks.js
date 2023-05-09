import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocumentServices } from "../../services/documentServices";
import { setEditorLink } from "../app/appSlice";

const filterDocuments = (documents, thunkAPI) => {
  let filteredDocuments = [];

  if (documents && documents.length && documents?.length > 0) {
    filteredDocuments = documents.filter(
      (item) =>
        item.data_type &&
        item.data_type ===
          thunkAPI.getState().auth?.userDetail?.portfolio_info[0]?.data_type
    );
  } else {
    filteredDocuments = [];
  }

  return filteredDocuments;
};

const documentServices = new DocumentServices();

export const createDocument = createAsyncThunk(
  "document/create",
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.createDocument(data);

      thunkAPI.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const detailDocument = createAsyncThunk(
  "document/detail",
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.detailDocument(data);

      thunkAPI.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const signDocument = createAsyncThunk("document/sign", async (data) => {
  try {
    const res = await documentServices.signDocument(data);

    console.log("document", res.data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
});

export const mineDocuments = createAsyncThunk(
  "document/mine",
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.mineDocuments(data);
      console.log("inseideeee");

      console.log("mine document", res.data);

      const documents = filterDocuments(res.data.documents, thunkAPI);

      return documents;
    } catch (error) {
      console.log(error);
    }
  }
);

export const rejectedDocuments = createAsyncThunk(
  "document/rejected",
  async (data) => {
    try {
      const res = await documentServices.rejectedDocuments(data);
      console.log("inseideeee");

      console.log("document", res.data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const savedDocuments = createAsyncThunk(
  "document/saved",
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.savedDocuments(data);
      console.log("inseideeee");

      const documents = filterDocuments(res.data.documents, thunkAPI);

      return documents;
    } catch (error) {
      console.log(error);
    }
  }
);

export const contentDocument = createAsyncThunk(
  "document/contentDocument",
  async (data) => {
    try {
      const res = await documentServices.contentDocument(data);

      console.log("contentdocument", res.data);

      return res.data;
    } catch (error) {
      console.log("Content document fetch error: ", error);
    }
  }
);

export const allDocuments = createAsyncThunk(
  "document/all",
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.allDocuments(data);

      const documents = filterDocuments(res.data.documents.reverse().filter(document => document.document_state !== "trash"), thunkAPI);

      return documents;
    } catch (error) {
      console.log(error);
    }
  }
);
