import { createAsyncThunk } from "@reduxjs/toolkit";
import { GroupServices } from "../../services/groupServices";

const groupServices = new GroupServices();

export const createGroups = createAsyncThunk(
  "groups/createGroups",
  async (data) => {
    try {
      const res = await groupServices.createGroups(data.company_id,data.payload);
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const editGroups = createAsyncThunk(
  "groups/editGroups",
  async (data) => {
    try {
      const res = await groupServices.updateGroups(data.company_id,data.payload);
      if (res) {
        return res;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getGroups = createAsyncThunk("groups/getGroups", async (data) => {
  try {
    const res = await groupServices.getAllGroups(data.company_id, data.data_type);
    return res.data;
  } catch (error) {
    console.log(error);
  }
});
