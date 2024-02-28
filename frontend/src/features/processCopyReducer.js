import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  document: null,
  workflow: null,
  processStep: null,
  startSelectDocument: false,
  startSelectWorkflow: false,
  startConnectWorkflow: false,
  whichApproval : 'Document',
  showHighlight: false
};

export const copiedProcessSlice = createSlice({
  name: "copiedProcess",
  initialState,
  reducers: {
    setWhichApproval: (state, action)=>{
      state.whichApproval = action.payload
    },
    // setCopiedDocument: (state, action) => {
    //   state.document = action.payload;
    // },
    
    setCopiedDocument: (state, action) => {
      return {
        ...state,
        document: action.payload
      };
    },
    
    // setCopiedWorkflow: (state, action) => {
    //   state.workflow = action.payload;
    // },

    setCopiedWorkflow: (state, action) => {
      return {
        ...state,
        workflow: action.payload
      };
    },

    // setProcessStepCopy: (state, action) =>{
    //   state.processStep = action.payload;
    // },

    setProcessStepCopy: (state, action) => {
      return {
        ...state,
        processStep: action.payload
      };
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
    },

    toggleHighlight: (state, action)=>{
      state.showHighlight = !state.showHighlight
    }
  }
});

export const { setWhichApproval,setCopiedDocument, setCopiedWorkflow,setProcessStepCopy, startConnecting, startCopyingDocument, startCopyingWorkflow, resetCopyData, toggleHighlight } = copiedProcessSlice.actions;

export default copiedProcessSlice.reducer;
