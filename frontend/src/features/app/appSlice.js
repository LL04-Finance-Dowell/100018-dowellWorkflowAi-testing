import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  toggleManageFileForm: false,
  currentWorkflow: null,
  editorLink: null,
  docCurrentWorkflow: null,
  selectedWorkflowsToDoc: [],
  currentDocToWfs: null,
  wfToDocument: {
    document: null,
    workflows: [],
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setToggleManageFileForm: (state, action) => {
      state.toggleManageFileForm = action.payload;
    },
    setCurrentWorkflow: (state, action) => {
      console.log("sssssss", action.payload);
      state.currentWorkflow = action.payload;
    },
    setEditorLink: (state, action) => {
      state.editorLink = action.payload;
    },
    setWfToDocument: (state, action) => {
      state.wfToDocument = {
        ...state.wfToDocument,
        document: state.docCurrentWorkflow,
        workflows: state.selectedWorkflowsToDoc,
      };
      state.docCurrentWorkflow = state.selectedWorkflowsToDoc[0];
    },
    setDocCurrentWorkflow: (state, action) => {
      state.docCurrentWorkflow = {
        ...action.payload,
        workflows: {
          ...action.payload.workflows,
          steps: action.payload.workflows.steps.map((step) => ({
            ...step,
            toggleContent: false,
            _id: uuidv4(),
          })),
        },
      };
    },
    setCurrentDocToWfs: (state, action) => {
      state.currentDocToWfs = action.payload;
      state.docCurrentWorkflow = null;
      state.selectedWorkflowsToDoc = [];
      state.wfToDocument = {
        document: null,
        workflows: [],
      };
    },
    setSelectedWorkflowsToDoc: (state, action) => {
      state.selectedWorkflowsToDoc = [
        ...state.selectedWorkflowsToDoc,
        action.payload,
      ];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setToggleManageFileForm,
  setEditorLink,
  setCurrentWorkflow,
  setDocCurrentWorkflow,
  setSelectedWorkflowsToDoc,
  setCurrentDocToWfs,
  setWfToDocument,
} = appSlice.actions;

export default appSlice.reducer;
