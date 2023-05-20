import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppServices } from "../../services/appServices";

const appServices = new AppServices();

export const getItemsCounts = createAsyncThunk(
  "app/getItemsCount",
  async (data) => {
    try {
      const res = await appServices.getItemsCounts(data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
