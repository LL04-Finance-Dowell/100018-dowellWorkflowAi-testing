import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import TemplateCard from "../../components/hoverCard/templateCard/TemplateCard";
import DocumnetCard from "../../components/hoverCard/documentCard/DocumentCard";
import WorkflowCard from "../../components/hoverCard/workflowCard/WorkflowCard";
import {
  processesInWorkflowAIArray,
  permissionArray,
  teamsInWorkflowAI,
} from "../../components/workflowAiSettings/veriables";
import { getItemsCounts } from "./asyncThunks";

const initialState = {
  itemsCount: null,
  itemsCountStatus: "idle",
  errorMessage: null,
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
      items: [],
    },
    {
      id: uuidv4(),
      title: "templates",
      cardBgColor: null,
      card: TemplateCard,
      items: [],
    },
    {
      id: uuidv4(),
      title: "workflows",
      card: WorkflowCard,
      cardBgColor: null,
      items: [],
    },
  ],
  notificationsLoading: true,
  notificationFinalStatus: null,
  membersSetForProcess: false,
  notificationsLoaded: false,
  continents: [],
  continentsLoaded: false,
  themeColor: "#61CE70",
  settingProccess: processesInWorkflowAIArray,
  updateProccess: processesInWorkflowAIArray,
  permissionArray,
  teamsInWorkflowAI,
  column: [],
  proccess: [],
  userDetailPosition: null,
  teamsSelectedSelectedForProcess: [],
  teamMembersSelectedForProcess: [],
  userMembersSelectedForProcess: [],
  publicMembersSelectedForProcess: [],
  processesLoading: true,
  processesLoaded: false,
  allProcesses: [],
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
      /*  state.selectedWorkflowsToDoc = [
        ...state.selectedWorkflowsToDoc,
        action.payload,
      ]; */
      const isInclude = state.selectedWorkflowsToDoc.find(
        (item) => item._id === action.payload._id
      );

      if (isInclude) {
        state.selectedWorkflowsToDoc = state.selectedWorkflowsToDoc.map(
          (item) =>
            item._id === action.payload._id
              ? {
                  ...item,
                  isSelected: item.isSelected ? !item.isSelected : true,
                }
              : item
        );
      } else {
        state.selectedWorkflowsToDoc = [
          ...state.selectedWorkflowsToDoc,
          action.payload,
        ];
      }
    },
    removeFromSelectedWorkflowsToDoc: (state, action) => {
      state.selectedWorkflowsToDoc = state.selectedWorkflowsToDoc.filter(
        (item) => item._id !== action.payload
      );
    },
    removeFromSelectedWorkflowsToDocGroup: (state) => {
      state.selectedWorkflowsToDoc = state.selectedWorkflowsToDoc.filter(
        (item) => item?.isSelected !== true
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
      state.membersSetForProcess = false;
      state.teamMembersSelectedForProcess = [];
      state.userMembersSelectedForProcess = [];
      state.publicMembersSelectedForProcess = [];
      state.teamsSelectedSelectedForProcess = [];
    },
    setProcessSteps: (state, action) => {
      state.processSteps = action.payload;
    },
    setSelectedMembersForProcess: (state, action) => {
      state.selectedMembersForProcess = [
        ...state.selectedMembersForProcess,
        action.payload,
      ];
    },
    removeFromSelectedMembersForProcess: (state, action) => {
      state.selectedMembersForProcess = state.selectedMembersForProcess.filter(
        (item) => item.username !== action.payload
      );
    },
    updateSingleProcessStep: (state, action) => {
      const currentProcessSteps = [...state.processSteps];

      if (!action.payload.workflow)
        return (state.processSteps = currentProcessSteps);

      const foundStepIndex = currentProcessSteps.findIndex(
        (step) => step.workflow === action.payload.workflow
      );

      if (foundStepIndex === -1)
        return (state.processSteps = currentProcessSteps);

      const currentStepToUpdate = currentProcessSteps[foundStepIndex];
      const updatedStepObj = {
        ...currentStepToUpdate.steps[action.payload.indexToUpdate],
        ...action.payload,
      };

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
      ];
    },
    removeFromTableOfContentForStep: (state, action) => {
      const updatedTableOfContents = state.tableOfContentForStep.filter(
        (content) => {
          if (content._id === action.payload.id && content.stepIndex === action.payload.stepIndex) return null
          return content
        }
      );
      state.tableOfContentForStep = updatedTableOfContents.filter(content => content)
    },
    setNotificationsForUser: (state, action) => {
      state.notificationsForUser = action.payload;
    },
    setNotificationsLoading: (state, action) => {
      state.notificationsLoading = action.payload;
    },
    setNotificationFinalStatus: (state, action) => {
      state.notificationFinalStatus = action.payload;
    },
    setMembersSetForProcess: (state, action) => {
      state.membersSetForProcess = action.payload;
    },
    setNotificationsLoaded: (state, action) => {
      state.notificationsLoaded = action.payload;
    },
    setContinents: (state, action) => {
      state.continents = action.payload;
    },
    setContinentsLoaded: (state, action) => {
      state.continentsLoaded = action.payload;
    },
    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
    },
    setSettingProccess: (state, action) => {
      state.settingProccess = state.settingProccess.map((item) => ({
        ...item,
        children:
          item.children.length === 3
            ? [...item.children, action.payload]
            : item.children.map((child, index) =>
                index === 3 ? action.payload : child
              ),
      }));
    },
    setUpdateProccess: (state, action) => {
      state.settingProccess = state.settingProccess.map((item) => ({
        ...item,
        children: action.payload,
      }));
    },
    setUpdateProccessApi: (state, action) => {
      console.log("settingProccesssettingProccess", action.payload);
      state.settingProccess = state.settingProccess.map((item) => ({
        ...item,
        children: [item.children[0], ...action.payload],
      }));
    },
    setColumn: (state, action) => {
      state.column = action.payload;
    },
    setProccess: (state, action) => {
      state.proccess = action.payload;
    },
    setPermissionArray: (state, action) => {
      state.permissionArray = state.permissionArray.map((item) => ({
        ...item,
        children: action.payload,
      }));
    },
    setTeamsInWorkflowAI: (state, action) => {
      state.teamsInWorkflowAI = state.teamsInWorkflowAI.map((item) => ({
        ...item,
        children: action.payload,
      }));
    },
    setUserDetailPosition: (state, action) => {
      state.userDetailPosition = action.payload;
    },
    setTeamsSelectedSelectedForProcess: (state, action) => {
      state.teamsSelectedSelectedForProcess = [
        ...state.teamsSelectedSelectedForProcess,
        action.payload,
      ]
    },
    removeFromTeamsSelectedSelectedForProcess: (state, action) => {
      const updatedTeamsForProcess = state.teamsSelectedSelectedForProcess.filter(
        (team) => {
          if (team.id === action.payload.id && team.stepIndex === action.payload.stepIndex) return null
          return team
        }
      );
      state.teamsSelectedSelectedForProcess = updatedTeamsForProcess.filter(team => team);
    },
    setTeamMembersSelectedForProcess: (state, action) => {
      state.teamMembersSelectedForProcess = [
        ...state.teamMembersSelectedForProcess,
        action.payload,
      ];
    },
    removeFromTeamMembersSelectedForProcess: (state, action) => {
      const updatedTeamMembersForProcess = state.teamMembersSelectedForProcess.filter(
        (currentMember) => {
          if (currentMember.member === action.payload.member && currentMember.portfolio === action.payload.portfolio && currentMember.stepIndex === action.payload.stepIndex) return null
          return currentMember
        }
      );
      state.teamMembersSelectedForProcess = updatedTeamMembersForProcess.filter(member => member)
    },
    setUserMembersSelectedForProcess: (state, action) => {
      state.userMembersSelectedForProcess = [
        ...state.userMembersSelectedForProcess,
        action.payload,
      ];
    },
    removeFromUserMembersSelectedForProcess: (state, action) => {
      const updatedUserMembersForProcess = state.userMembersSelectedForProcess.filter(
        (currentMember) => {
          if (currentMember.member === action.payload.member && currentMember.portfolio === action.payload.portfolio && currentMember.stepIndex === action.payload.stepIndex) return null
          return currentMember
        }
      );
      state.userMembersSelectedForProcess = updatedUserMembersForProcess.filter(member => member)
    },
    setPublicMembersSelectedForProcess: (state, action) => {
      state.publicMembersSelectedForProcess = [
        ...state.publicMembersSelectedForProcess,
        action.payload,
      ];
    },
    removeFromPublicMembersSelectedForProcess: (state, action) => {
      const updatedPublicMembersForProcess = state.publicMembersSelectedForProcess.filter(
        (currentMember) => {
          if (currentMember.member === action.payload.member && currentMember.portfolio === action.payload.portfolio && currentMember.stepIndex === action.payload.stepIndex) return null
          return currentMember
        }
      );
      state.publicMembersSelectedForProcess = updatedPublicMembersForProcess.filter(member => member)
    },
    setProcessesLoading: (state, action) => {
      state.processesLoading = action.payload
    },
    setProcessesLoaded: (state, action) => {
      state.processesLoaded = action.payload
    },
    setAllProcesses: (state, action) => {
      state.allProcesses = action.payload
    },
  },
  extraReducers: (builder) => {
    //getItemsCount
    builder.addCase(getItemsCounts.pending, (state) => {
      state.itemsCountStatus = "pending";
    });
    builder.addCase(getItemsCounts.fulfilled, (state, action) => {
      state.itemsCountStatus = "succeeded";
      state.itemsCount = action.payload;
    });
    builder.addCase(getItemsCounts.rejected, (state, action) => {
      state.itemsCountStatus = "error";
      state.errorMessage = action.payload;
    });
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
  removeFromSelectedWorkflowsToDocGroup,
  setProcessSteps,
  setSelectedMembersForProcess,
  removeFromSelectedMembersForProcess,
  updateSingleProcessStep,
  setTableOfContentForStep,
  removeFromTableOfContentForStep,
  setNotificationsForUser,
  setNotificationsLoading,
  setNotificationFinalStatus,
  setMembersSetForProcess,
  setNotificationsLoaded,
  setContinents,
  setContinentsLoaded,
  setThemeColor,
  setSettingProccess,
  setColumn,
  setProccess,
  setUpdateProccess,
  setPermissionArray,
  setTeamsInWorkflowAI,
  setUserDetailPosition,
  setUpdateProccessApi,
  setTeamsSelectedSelectedForProcess,
  setTeamMembersSelectedForProcess,
  setUserMembersSelectedForProcess,
  setPublicMembersSelectedForProcess,
  removeFromTeamsSelectedSelectedForProcess,
  removeFromTeamMembersSelectedForProcess,
  removeFromUserMembersSelectedForProcess,
  removeFromPublicMembersSelectedForProcess,
  setProcessesLoading,
  setProcessesLoaded,
  setAllProcesses,
} = appSlice.actions;

export default appSlice.reducer;
