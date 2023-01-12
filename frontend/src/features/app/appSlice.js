import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import TemplateCard from "../../components/hoverCard/templateCard/TemplateCard";
import DocumnetCard from "../../components/hoverCard/documentCard/DocumentCard";
import WorkflowCard from "../../components/hoverCard/workflowCard/WorkflowCard";
import { notifications } from "../../pages/App/WorkflowApp";

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
  dropdownToggle: false,
  processSteps: [],
  selectedMembersForProcess: [],
  tableOfContentForStep: [],
  notificationsForUser: [
    {
      id: uuidv4(),
      title: "documents",
      cardBgColor: "#1ABC9C",
      card: DocumnetCard,
      items: [{ id: uuidv4() }],
    },
    {
      id: uuidv4(),
      title: "templates",
      cardBgColor: null,
      card: TemplateCard,
      items: [{ id: uuidv4() }],
    },
    {
      id: uuidv4(),
      title: "workflows",
      card: WorkflowCard,
      cardBgColor: null,
      items: [{ id: uuidv4() }],
    },
  ],
  notificationsLoading: true,
  notificationFinalStatus: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setToggleManageFileForm: (state, action) => {
      state.toggleManageFileForm = action.payload;
    },
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
    },
    setEditorLink: (state, action) => {
      state.editorLink = action.payload;
    },
    setWfToDocument: (state, action) => {
      state.wfToDocument = {
        ...state.wfToDocument,
        document: state.currentDocToWfs,
        workflows: state.selectedWorkflowsToDoc,
      };
      state.docCurrentWorkflow = null;
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
      state.dropdownToggle = false;
    },
    setSelectedWorkflowsToDoc: (state, action) => {
      state.selectedWorkflowsToDoc = [
        ...state.selectedWorkflowsToDoc,
        action.payload,
      ];
    },
    removeFromSelectedWorkflowsToDoc: (state, action) => {
      state.selectedWorkflowsToDoc = state.selectedWorkflowsToDoc.filter(
        (item) => item._id !== action.payload
      );
    },
    setDropdowndToggle: (state, action) => {
      state.dropdownToggle = action.payload;
    },
    resetSetWorkflows: (state, action) => {
      state.currentDocToWfs = null;
      state.docCurrentWorkflow = null;
      state.selectedWorkflowsToDoc = [];
      state.wfToDocument = {
        document: null,
        workflows: [],
      };
      state.dropdownToggle = false;
      state.selectedMembersForProcess = [];
      state.processSteps = [];
      state.tableOfContentForStep = [];
    },
    setProcessSteps: (state, action) => {
      state.processSteps = action.payload
    },
    setSelectedMembersForProcess: (state, action) => {
      state.selectedMembersForProcess = [
        ...state.selectedMembersForProcess,
        action.payload,
      ]
    },
    removeFromSelectedMembersForProcess: (state, action) => {
      state.selectedMembersForProcess = state.selectedMembersForProcess.filter(
        (item) => item.username !== action.payload
      );
    },
    updateSingleProcessStep: (state, action) => {
      const currentProcessSteps = [ ...state.processSteps ];

      if (!action.payload.workflow) return state.processSteps = currentProcessSteps;
      
      const foundStepIndex = currentProcessSteps.findIndex(step => step.workflow === action.payload.workflow);
      
      if (foundStepIndex === -1) return state.processSteps = currentProcessSteps;
      
      const currentStepToUpdate = currentProcessSteps[foundStepIndex];
      const updatedStepObj = { ...currentStepToUpdate.steps[action.payload.indexToUpdate], ...action.payload };
      
      delete updatedStepObj.indexToUpdate;
      delete updatedStepObj.workflow;
      delete updatedStepObj.toggleContent;
      
      currentStepToUpdate.steps[action.payload.indexToUpdate] = updatedStepObj;
      
      state.processSteps = currentProcessSteps;
    },
    setTableOfContentForStep: (state, action) => {
      state.tableOfContentForStep = [
        ...state.tableOfContentForStep,
        action.payload,
      ]
    },
    removeFromTableOfContentForStep: (state, action) => {
      state.tableOfContentForStep = state.tableOfContentForStep.filter(
        (content) => content._id !== action.payload
      );
    },
    setNotificationsForUser: (state, action) => {
      state.notificationsForUser = action.payload
    },
    setNotificationsLoading: (state, action) => {
      state.notificationsLoading = action.payload
    },
    setNotificationFinalStatus: (state, action) => {
      state.notificationFinalStatus = action.payload
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
  setDropdowndToggle,
  resetSetWorkflows,
  removeFromSelectedWorkflowsToDoc,
  setProcessSteps,
  setSelectedMembersForProcess,
  removeFromSelectedMembersForProcess,
  updateSingleProcessStep,
  setTableOfContentForStep,
  removeFromTableOfContentForStep,
  setNotificationsForUser,
  setNotificationsLoading,
  setNotificationFinalStatus,
} = appSlice.actions;

export default appSlice.reducer;
