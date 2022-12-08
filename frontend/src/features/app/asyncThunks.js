import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthServices } from "../../services/authServices";

const authServices = new AuthServices();

export const getUserInfo = createAsyncThunk("app/getUser", async (data) => {
  try {
    const res = await authServices.getUserDetail(data);

    console.log("userInfo", res.data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
});
