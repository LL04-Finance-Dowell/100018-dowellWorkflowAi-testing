import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, getUserInfo, getUserInfoOther } from "./asyncThunks";

const initialState = {
  userDetail: null,
  currentUser: null,
  session_id: null,
  id: null,
  detailStatus: "idle",
  currentStatus: "idle",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSessionId: (state, action) => {
      state.session_id = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    updateUserDetail: (state, action) => {
      state.userDetail = action.payload
    },
    resetUserDetail: (state, action) => {
      sessionStorage.clear();

      state.id = null;
      state.session_id = null;
      state.userDetail = null;
    }
  },
  extraReducers: (builder) => {
    //getUserInfo
    builder.addCase(getUserInfo.pending, (state) => {
      state.detailStatus = "pending";
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.detailStatus = "succeeded";
      state.userDetail = action.payload;
    });
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.detailStatus = "failed";
      state.errorMessage = action.payload;
    });
    //getUserInfoOther
    builder.addCase(getUserInfoOther.pending, (state) => {
      state.detailStatus = "pending";
    });
    builder.addCase(getUserInfoOther.fulfilled, (state, action) => {
      state.detailStatus = "succeeded";
      state.userDetail = action.payload;
    });
    builder.addCase(getUserInfoOther.rejected, (state, action) => {
      state.detailStatus = "failed";
      state.errorMessage = action.payload;
    });
    //getCurrentUser
    builder.addCase(getCurrentUser.pending, (state) => {
      state.currentUser = "pending";
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.currentUser = "succeeded";
      state.currentUser = action.payload;
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.currentUser = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSessionId, setId, updateUserDetail, resetUserDetail } = appSlice.actions;

export default appSlice.reducer;
