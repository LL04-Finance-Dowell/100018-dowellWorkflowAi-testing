import { createSlice } from "@reduxjs/toolkit";
import { createTemplate, mineTemplates } from "./asyncThunks";

const initialState = {
  template: null,
  miningTemplates: [],
  status: "idle",
  errorMessage: null,
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createTemplate
    builder.addCase(createTemplate.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(createTemplate.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.template = action.payload;
    });
    builder.addCase(createTemplate.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload;
    });
    //mineTemplates
    builder.addCase(mineTemplates.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(mineTemplates.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.miningTemplates = action.payload;
    });
    builder.addCase(mineTemplates.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = templateSlice.actions;

export default templateSlice.reducer;
