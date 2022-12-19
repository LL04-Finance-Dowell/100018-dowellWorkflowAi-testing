import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthServices } from "../../services/authServices";

const authServices = new AuthServices();

export const getUserInfo = createAsyncThunk("app/getUser", async (data) => {
  try {
    const res = await authServices.getUserDetail(data);

    window.sessionStorage.setItem("userDetail", JSON.stringify(res.data));

    return res.data;
  } catch (error) {
    console.log(error);
  }
});

export const getUserInfoOther = createAsyncThunk(
  "app/getUserOther",
  async (data) => {
    try {
      const res = await authServices.getUserDetailOther(data);
      window.sessionStorage.setItem("userDetail", JSON.stringify(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "app/getCurrentUser",
  async (data) => {
    try {
      const res = await authServices.getCurrentUser(data);
      window.localStorage.setItem("currentUser", JSON.stringify(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
