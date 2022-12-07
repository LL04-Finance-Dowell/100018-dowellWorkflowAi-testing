import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggleManageFileForm: false,
  editorLink: null,
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
});

// Action creators are generated for each case reducer function
export const { setToggleManageFileForm, setEditorLink } = appSlice.actions;

export default appSlice.reducer;
