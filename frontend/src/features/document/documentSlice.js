import { createSlice } from "@reduxjs/toolkit";
import { createDocument } from "./asyncThunks";

const initialState = {
  document: null,
  status: "idle",
  errorMessage: null,
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //createDocument
    builder.addCase(createDocument.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(createDocument.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.document = action.payload;
    });
    builder.addCase(createDocument.rejected, (state, action) => {
      state.status = "failed";
      state.errorMessage = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = documentSlice.actions;

export default documentSlice.reducer;
