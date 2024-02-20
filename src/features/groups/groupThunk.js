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

export const getGroups = createAsyncThunk("groups/getGroups", async (data) => {
  try {
    const res = await groupServices.getAllGroups(data.company_id, data.data_type);
    return res.data;
  } catch (error) {
    console.log(error);
  }
});
