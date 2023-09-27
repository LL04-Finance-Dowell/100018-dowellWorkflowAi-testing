import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  document: null,
  workflow: null
};

export const copiedProcessSlice = createSlice({
  name: "copiedProcess",
  initialState,
  reducers: {
    setCopiedDocument: (state, action) => {
      state.document = action.payload;
    },
    setCopiedWorkflow: (state, action) => {
      state.workflow = action.payload;
    }
  }
});

export const { setCopiedDocument, setCopiedWorkflow } = copiedProcessSlice.actions;

export default copiedProcessSlice.reducer;
