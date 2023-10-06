import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  document: null,
  workflow: null,
  processStep: null,
  startSelectDocument: false,
  startSelectWorkflow: false,
  startConnectWorkflow: false
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
    },
    setProcessStepCopy: (state, action) =>{
      state.processStep = action.payload;
    },
    startCopyingDocument:(state, action) =>{
      state.startSelectDocument= true
    },
    startCopyingWorkflow: (state, action) =>{
      state.startSelectWorkflow = true
    },
    startConnecting: (state, action)=>{
      state.startConnectWorkflow= true
    },
    resetCopyData: (state, action)=>{
      state.document = null;
      state.workflow = null;
      state.processStep = null;
      state.startSelectDocument = false;
      state.startSelectWorkflow = false;
      state.startConnectWorkflow = false
    }
  }
});

export const { setCopiedDocument, setCopiedWorkflow,setProcessStepCopy, startConnecting, startCopyingDocument, startCopyingWorkflow, resetCopyData } = copiedProcessSlice.actions;

export default copiedProcessSlice.reducer;
