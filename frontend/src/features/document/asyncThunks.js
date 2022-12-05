import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocumentServices } from "../../services/documentServices";

const documentServices = new DocumentServices();

export const createDocument = createAsyncThunk(
  "document/create",
  async (data) => {
    try {
      const res = await documentServices.createDocument(data);
      console.log("inseideeee");

      console.log("document", res.data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
