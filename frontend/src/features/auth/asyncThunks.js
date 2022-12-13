import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthServices } from "../../services/authServices";

const authServices = new AuthServices();

export const getUserInfo = createAsyncThunk("app/getUser", async (data) => {
  try {
    const res = await authServices.getUserDetail(data);

    console.log("userInfoooooooooooooooooooooooooooo", res.data);
    window.sessionStorage.setItem("userDetail", JSON.stringify(res.data));

    /*  navigate("/", { replace: true }); */

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

      console.log(
        "userInfoo otherrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
        res.data
      );
      window.sessionStorage.setItem("userDetail", JSON.stringify(res.data));

      /*  navigate("/", { replace: true }); */

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

      console.log("userInfoooooooooooooooooooooooooooo", res.data);
      window.localStorage.setItem("currentUser", JSON.stringify(res.data));
      /*  navigate("/", { replace: true }); */
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const combine = createAsyncThunk(
  "app/combine",
  async ({ dataCurrent, dataInfo, navigate }, asyncTHunks) => {
    try {
      asyncTHunks.dispatch(getCurrentUser(dataCurrent));
      asyncTHunks.dispatch(getUserInfo(dataInfo));

      /*   if (currentUser && userInfo) {
        navigate("/", { replace: true });
      } */
    } catch (error) {
      console.log(error);
    }
  }
);
