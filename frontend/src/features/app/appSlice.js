import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo } from "./asyncThunks";

const initialState = {
  toggleManageFileForm: false,
  editorLink: null,
  userInfo: null,
  userStatus: "idle",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setToggleManageFileForm: (state, action) => {
      state.toggleManageFileForm = action.payload;
    },
    setEditorLink: (state, action) => {
      state.editorLink = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getUserInfo
    builder.addCase(getUserInfo.pending, (state) => {
      state.userStatus = "pending";
    });
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.userStatus = "succeeded";
      state.userInfo = action.payload;
    });
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.userStatus = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setToggleManageFileForm, setEditorLink } = appSlice.actions;

export default appSlice.reducer;
