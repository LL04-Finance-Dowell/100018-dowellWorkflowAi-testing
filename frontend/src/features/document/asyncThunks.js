import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocumentServices } from "../../services/documentServices";
import { setEditorLink } from "../app/appSlice";

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
    console.log("inseideeee");

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

      let documents = [];

      if (res.data.documents?.length > 0) {
        documents = res.data.documents.filter(
          (item) =>
            item.data_type ===
            thunkAPI.getState().auth?.userDetail?.portfolio_info?.data_type
        );
      } else {
        documents = [];
      }

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

export const drafts = createAsyncThunk("document/drafts", async (data) => {
  try {
    const res = await documentServices.drafts(data);
    console.log("inseideeee");

    console.log("document", res.data);

    return res.data.documents;
  } catch (error) {
    console.log(error);
  }
});

export const contentDocument = createAsyncThunk(
  "document/contentDocument",
  async (data) => {
    try {
      const res = await documentServices.contentDocument(data);

      console.log("contentdocument", res.data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
