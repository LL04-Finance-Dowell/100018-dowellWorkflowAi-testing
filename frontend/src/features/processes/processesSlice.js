import { createSlice } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from 'uuid';
import { processesInWorkflowAIArray,teamsInWorkflowAI} from "../../components/workflowAiSettings/veriables";
const initialState = {

  currentWorkflow: null,
  docCurrentWorkflow: null,
  selectedWorkflowsToDoc: [],
  currentDocToWfs: null,
  wfToDocument: {
    document: null,
    workflows: [],
  },
  tableOfContentForStep: [],
  continents: [],
  continentsLoaded: false,
  column: [],
  IconColor: '',
  currentMessage:'',   
  creditResponse:[],                           
  userDetailPosition: null,
  adminUser: false,
  adminUserPortfolioLoaded: false,
  selectedPortfolioTypeForWorkflowSettings: null,
  teamsInWorkflowAI,
    dropdownToggle : false,
    selectedMembersForProcess : [],
    processSteps : [],

    membersSetForProcess : false,
    teamMembersSelectedForProcess : [],
    userMembersSelectedForProcess : [],
    publicMembersSelectedForProcess : [],
    teamsSelectedSelectedForProcess : [],
    savedProcessConfigured : false,
    allowErrorChecksStatusUpdateForNewProcess : false,
    newProcessErrorMessage : null,
    errorsCheckedInNewProcess : false,
    processesLoading: true,
    processesLoaded: false,
    allProcesses: [],
    CopyProcess: [],
    ProcessDetail:[],
    settingProccess: processesInWorkflowAIArray,
    updateProccess: processesInWorkflowAIArray, 
}

export const processesSlice = createSlice({
  name: 'processes',
  initialState,
  reducers: {
    setContinents: (state, action) => {
        state.continents = action.payload;
      },
      setContinentsLoaded: (state, action) => {
        state.continentsLoaded = action.payload;
      },
      setSelectedWorkflowsToDoc: (state, action) => {
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
          return void (state.processSteps = currentProcessSteps);
  
        const foundStepIndex = currentProcessSteps.findIndex(
          (step) => step.workflow === action.payload.workflow
        );
  
        if (foundStepIndex === -1)
          return void (state.processSteps = currentProcessSteps);
  
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
      setPublicMembersSelectedForProcess: (state, action) => {
        state.publicMembersSelectedForProcess = [
          ...state.publicMembersSelectedForProcess,
          action.payload,
        ];
      },
      setTableOfContentForStep: (state, action) => {
        state.tableOfContentForStep = [
          ...state.tableOfContentForStep,
          action.payload,
        ];
      },
      setTeamMembersSelectedForProcess: (state, action) => {
        state.teamMembersSelectedForProcess = [
          ...state.teamMembersSelectedForProcess,
          action.payload,
        ];
      },
      setUserMembersSelectedForProcess: (state, action) => {
        state.userMembersSelectedForProcess = [
          ...state.userMembersSelectedForProcess,
          action.payload,
        ];
      },
      setWfToDocument: (state, action) => {
        state.wfToDocument = {
          ...state.wfToDocument,
          document: state.currentDocToWfs,
          workflows: state.selectedWorkflowsToDoc,
        };
        state.docCurrentWorkflow = null;
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
        state.savedProcessConfigured = false;
        state.allowErrorChecksStatusUpdateForNewProcess = false;
        state.newProcessErrorMessage = null;
        state.errorsCheckedInNewProcess = false;
      },
      setAllProcesses: (state, action) => {
        state.allProcesses = action.payload;
      },
      setProcessesLoading: (state, action) => {
        state.processesLoading = action.payload;
      },
      setProcessesLoaded: (state, action) => {
        state.processesLoaded = action.payload;
      },
      SetCopyProcess: (state, action) => {
        state.CopyProcess = action.payload;
      },
      SetProcessDetail: (state, action) => {
        state.ProcessDetail = action.payload;
      },
      setSettingProccess: (state, { payload: { payload, type } }) => {
      
        switch (type) {
          case 'p_title':
            state.settingProccess[0].children[4].column =
              state.settingProccess[0].children[4].column.map((col) => {
                const pItem = payload.find(
                  (item) =>
                    item.content.includes(col.proccess_title) ||
                    item._id === col.pItemId
                );
  
               
  
                return pItem.content.includes('set display name')
                  ? {
                      // todo fix this up
                      ...col,
                      pItemId: pItem._id,
                    }
                  : {
                      ...col,
                      former_title: pItem.content.split(' (')[0],
                      proccess_title: pItem.content.split(' (')[1].slice(0, -1),
                      pItemId: pItem._id,
                    };
                // return col;
              });
            break;
          case 'docs':
            state.settingProccess[0].children[4].column[0].items = [...payload];
            break;
          case 'temps':
            state.settingProccess[0].children[4].column[1].items = [...payload];
            break;
          case 'wrkfs':
            state.settingProccess[0].children[4].column[2].items = [...payload];
            break;
          case 'nota':
            state.settingProccess[0].children[4].column[3].items = [...payload];
            break;
          case 'recs':
            state.settingProccess[0].children[4].column[4].items = [...payload];
            break;
          case 'app':
            state.settingProccess[0].children[4].column[5].items = [...payload];
            break;
          case 'eval':
            state.settingProccess[0].children[4].column[6].items = [...payload];
            break;
          case 'reps':
            state.settingProccess[0].children[4].column[7].items = [...payload];
            break;
          case 'rights':
            let rights = [];
            switch (payload.toLowerCase()) {
              case 'view':
                rights = ['view'];
                break;
              case 'add/edit':
                rights = ['view', 'use', 'add', 'make copy'];
                break;
              case 'delete':
                rights = [
                  'view',
                  'use',
                  'add',
                  'make copy',
                  'edit',
                  'disable',
                  'enable',
                ];
                break;
              case 'admin':
                rights = [
                  'view',
                  'use',
                  'add',
                  'make copy',
                  'edit',
                  'disable',
                  'enable',
                  'languages',
                  'admin',
                ];
                break;
              default:
                throw new Error('THIS IS IMPOSSIBLE!');
            }
            state.settingProccess[0].children[2].column[0].items = rights.map(
              (right) => ({ _id: uuidv4(), content: right, isSelected: false })
            );
            break;
          default:
            return state;
        }
      },
      setSettingProccessTeams: (state, action) => {
        state.settingProccess[0].children[0].column[0].items = [
          ...action.payload,
        ];
      },
      setSettingProccessPortfolios: (state, action) => {
        state.settingProccess[0].children[0].column[1].items = [
          ...action.payload,
        ];
      },
      setUpdateProccess: (state, action) => {
        state.settingProccess = state.settingProccess.map((item) => ({
          ...item,
          children: action.payload,
        }));
      },
      setUpdateProccessApi: (state, action) => {
        
        state.settingProccess = state.settingProccess.map((item) => ({
          ...item,
          children: [item.children[0], ...action.payload],
        }));
      },
      setProccess: (state, action) => {
        state.proccess = action.payload;
      },
      setTeamsInWorkflowAI: (state, action) => {
        state.teamsInWorkflowAI = state.teamsInWorkflowAI.map((item) => ({
          ...item,
          children: action.payload,
        }));
      },
      // *setTeamInWorkflowAITeams sets the individual item in items
      setTeamInWorkflowAITeams: (state, action) => {
        if(state.teamsInWorkflowAI[0]){
          state.teamsInWorkflowAI[0].children[0].column[0].items = [
            ...state.teamsInWorkflowAI[0].children[0].column[0].items,
            action.payload,
          ];
        }
      },
      setPortfoliosInWorkflowAITeams: (state, action) => {
        switch (action.payload.type) {
          case 'normal':
            if(!state.teamsInWorkflowAI[0]) return
            state.teamsInWorkflowAI[0].children[1].column[0].items = [
              ...action.payload.payload,
            ];
            break;
          case 'single':
            if(!state.teamsInWorkflowAI[0]) return
            state.teamsInWorkflowAI[0].children[1].column[0].items =
              state.teamsInWorkflowAI[0].children[1].column[0].items.map(
                (item) => {
                  let modItem = {};
                  for (let i = 0; i < action.payload.payload.length; i++) {
                    if (item._id === action.payload.payload[i]._id) {
                      modItem = { ...item, isSelected: true };
                      break;
                    } else modItem = { ...item, isSelected: false };
                  }
  
                  return modItem;
                }
              );
            break;
          case 'filter':
            if(!state.teamsInWorkflowAI[0]) return
            state.teamsInWorkflowAI[0].children[1].column[0].items =
              state.teamsInWorkflowAI[0].children[1].column[0].items.map(
                (item) => ({ ...item, isShow: false })
              );
  
            state.teamsInWorkflowAI[0].children[1].column[0].items =
              state.teamsInWorkflowAI[0].children[1].column[0].items.map(
                (item) => {
                  let modItem = {};
                  if (action.payload.payload.length) {
                    for (let i = 0; i < action.payload.payload.length; i++) {
                      if (item.content === action.payload.payload[i]) {
                        modItem = { ...item, isShow: true };
                        break;
                      } else modItem = { ...item, isShow: false };
                    }
                  } else {
                    modItem = { ...item, isShow: false };
                  }
  
                  return modItem;
                }
              );
            break;
          default:
            return state;
        }
      },
  
      setColumn: (state, action) => {
        state.column = action.payload;
      },
      setProcessName: (state, action) => {
        state.ProcessName = action.payload;
      },
      removeFromTableOfContentForStep: (state, action) => {
        const updatedTableOfContents = state.tableOfContentForStep.filter(
          (content) => {
            if (
              content.id === action.payload.id &&
              content.stepIndex === action.payload.stepIndex
            )
              return null;
            return content;
          }
        );
        state.tableOfContentForStep = updatedTableOfContents.filter(
          (content) => content
        );
      },
      setMembersSetForProcess: (state, action) => {
        state.membersSetForProcess = action.payload;
      },
      setUpdateInWorkflowAITeams: (state, action) => {
        let modItem = [];
  
        if (action.payload) {
          const extractedContent = action.payload.extractTeamContent(
            action.payload.item
          );
  
          for (let i = 0; i < extractedContent.length; i++) {
            const _mId = action.payload.item._id;
            const _id = uuidv4();
            const title =
              i === 0
                ? 'Name'
                : i === 1
                ? 'Code'
                : i === 2
                ? 'Specification'
                : i === 3
                ? 'Details'
                : i === 4
                ? 'Universal code'
                : '';
            modItem.push({
              _id,
              _mId,
              content: { content: extractedContent[i], title },
            });
          }
        }
        state.teamsInWorkflowAI[0].children[2].column[0].items = modItem;
      },
  
      // *setTeamsInWorkflowAITeams sets the entire items array
      setTeamsInWorkflowAITeams: (state, action) => {
        state.teamsInWorkflowAI[0].children[0].column[0] = {
          ...state.teamsInWorkflowAI[0].children[0].column[0],
          items: action.payload,
        };
      },
      setTeamsSelectedSelectedForProcess: (state, action) => {
        state.teamsSelectedSelectedForProcess = [
          ...state.teamsSelectedSelectedForProcess,
          action.payload,
        ];
      },
      removeFromTeamsSelectedSelectedForProcess: (state, action) => {
        const updatedTeamsForProcess =
          state.teamsSelectedSelectedForProcess.filter((team) => {
            if (
              team._id === action.payload._id &&
              team.stepIndex === action.payload.stepIndex &&
              team.selectedFor === action.payload.selectedFor
            )
              return null;
            return team;
          });
        state.teamsSelectedSelectedForProcess = updatedTeamsForProcess.filter(
          (team) => team
        );
      },
      removeFromTeamMembersSelectedForProcess: (state, action) => {
        const updatedTeamMembersForProcess =
          state.teamMembersSelectedForProcess.filter((currentMember) => {
            if (
              currentMember.member === action.payload.member &&
              currentMember.portfolio === action.payload.portfolio &&
              currentMember.stepIndex === action.payload.stepIndex
            )
              return null;
            return currentMember;
          });
        state.teamMembersSelectedForProcess = updatedTeamMembersForProcess.filter(
          (member) => member
        );
      },
      removeFromUserMembersSelectedForProcess: (state, action) => {
        const updatedUserMembersForProcess =
          state.userMembersSelectedForProcess.filter((currentMember) => {
            if (
              currentMember.member === action.payload.member &&
              currentMember.portfolio === action.payload.portfolio &&
              currentMember.stepIndex === action.payload.stepIndex
            )
              return null;
            return currentMember;
          });
        state.userMembersSelectedForProcess = updatedUserMembersForProcess.filter(
          (member) => member
        );
      },

      setInBatchPublicMembersSelectedForProcess: (state, action) => {
    
        state.publicMembersSelectedForProcess = action.payload
      },
     resetPublicMembersSelectedForProcess: (state) => {
        state.publicMembersSelectedForProcess = [];
      },
      removeFromPublicMembersSelectedForProcess: (state, action) => {
        const updatedPublicMembersForProcess =
          state.publicMembersSelectedForProcess.filter((currentMember) => {
            if (
              currentMember.member === action.payload.member &&
              currentMember.portfolio === action.payload.portfolio &&
              currentMember.stepIndex === action.payload.stepIndex
            )
              return null;
            return currentMember;
          });
        state.publicMembersSelectedForProcess =
          updatedPublicMembersForProcess.filter((member) => member);
      },
      setShowProcessNameModal: (state, action) => {
        state.ShowProcessNameModal = action.payload;
      },
      setshowsProcessDetailPopup: (state, action) => {
        state.showsProcessDetailPopup = action.payload;
      },
      setSavedProcessConfigured: (state, action) => {
        state.savedProcessConfigured = action.payload;
      },
      setAllowErrorChecksStatusUpdateForNewProcess: (state, action) => {
        state.allowErrorChecksStatusUpdateForNewProcess = action.payload;
      },
      setNewProcessErrorMessage: (state, action) => {
        state.newProcessErrorMessage = action.payload;
      },
      setErrorsCheckedInNewProcess: (state, action) => {
        state.errorsCheckedInNewProcess = action.payload;
      },
  }
})

export const {
  setSavedProcessConfigured,
  setNewProcessErrorMessage,
    resetSetWorkflows,
    setContinents,
    setContinentsLoaded,
    setDocCurrentWorkflow,
    setPublicMembersSelectedForProcess,
    setTeamMembersSelectedForProcess,
    setUserMembersSelectedForProcess,
    setSelectedWorkflowsToDoc,
  setCurrentDocToWfs,
  setWfToDocument,
  setProcessSteps,
  setSelectedMembersForProcess,
  removeFromSelectedMembersForProcess,
  updateSingleProcessStep,
  setTableOfContentForStep,
  removeFromTableOfContentForStep,
  setMembersSetForProcess,
  setSettingProccess,
  setSettingProccessTeams,
  setSettingProccessPortfolios,
  setColumn,
  setProccess,
  setUpdateProccess,
  setTeamsInWorkflowAI,
  setTeamInWorkflowAITeams,
  setTeamsInWorkflowAITeams,
  setPortfoliosInWorkflowAITeams,
  setUpdateInWorkflowAITeams,
  setProcessName,
  setUpdateProccessApi,
  setTeamsSelectedSelectedForProcess,
  removeFromTeamsSelectedSelectedForProcess,
  removeFromTeamMembersSelectedForProcess,
  removeFromUserMembersSelectedForProcess,
  removeFromPublicMembersSelectedForProcess,
  setProcessesLoading,
  setProcessesLoaded,
  setAllProcesses,
  settemLoaded,
  setShowProcessNameModal,
  SetCopyProcess,
  SetProcessDetail,
  setshowsProcessDetailPopup,
  setAllowErrorChecksStatusUpdateForNewProcess,
  setErrorsCheckedInNewProcess,
  resetPublicMembersSelectedForProcess,
  setInBatchPublicMembersSelectedForProcess
} = processesSlice.actions;

export default processesSlice.reducer;