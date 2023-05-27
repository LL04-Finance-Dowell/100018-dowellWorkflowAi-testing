import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import TemplateCard from '../../components/hoverCard/templateCard/TemplateCard';
import DocumnetCard from '../../components/hoverCard/documentCard/DocumentCard';
import WorkflowCard from '../../components/hoverCard/workflowCard/WorkflowCard';
import {
  processesInWorkflowAIArray,
  permissionArray,
  teamsInWorkflowAI,
} from '../../components/workflowAiSettings/veriables';
import { getItemsCounts } from './asyncThunks';

const initialState = {
  itemsCount: null,
  itemsCountStatus: 'idle',
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
      title: 'documents',
      cardBgColor: '#1ABC9C',
      card: DocumnetCard,
      items: [],
    },
    {
      id: uuidv4(),
      title: 'templates',
      cardBgColor: null,
      card: TemplateCard,
      items: [],
    },
    {
      id: uuidv4(),
      title: 'workflows',
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
  themeColor: '#61CE70',
  settingProccess: processesInWorkflowAIArray,
  updateProccess: processesInWorkflowAIArray,
  permissionArray,
  teamsInWorkflowAI,
  column: [],
  proccess: [],
  IconColor: '',

  userDetailPosition: null,
  languageSelectPosition: null,
  teamsSelectedSelectedForProcess: [],
  teamMembersSelectedForProcess: [],
  userMembersSelectedForProcess: [],
  publicMembersSelectedForProcess: [],
  processesLoading: true,
  processesLoaded: false,
  allProcesses: [],
  ArrayofLinks: [],

CopyProcess:[],

  linksFetched: false,
  showGeneratedLinksPopup: false,

  legalStatusLoading: true,
  showLegalStatusPopup: false,
  legalTermsAgreed: false,
  dateAgreedToLegalStatus: '',
  legalArgeePageLoading: false,
  adminUser: false,
  adminUserPortfolioLoaded: false,
  selectedPortfolioTypeForWorkflowSettings: null,
  savedProcessConfigured: false,
};

export const appSlice = createSlice({
  name: 'app',
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
      state.savedProcessConfigured = false;
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
    setTableOfContentForStep: (state, action) => {
      state.tableOfContentForStep = [
        ...state.tableOfContentForStep,
        action.payload,
      ];
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
    setSettingProccess: (state, { payload: { payload, type } }) => {
      console.log('payL: ', payload);
      switch (type) {
        case 'p_title':
          state.settingProccess[0].children[4].column =
            state.settingProccess[0].children[4].column.map((col) => {
              const pItem = payload.find(
                (item) =>
                  item.content.includes(col.proccess_title) ||
                  item._id === col.pItemId
              );

              console.log('pItem: ', pItem);
              return pItem.content.includes('set display name')
                ? {
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
      console.log('settingProccesssettingProccess', action.payload);
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
    setFetchedPermissionArray: (state, action) => {
      action.payload.forEach((item) => {
        state.permissionArray[0].children =
          state.permissionArray[0].children.map((child) =>
            child._id === item.boxId
              ? {
                  ...child,
                  column: child.column.map((col) =>
                    col.proccess_title === item.title
                      ? {
                          ...col,
                          items: col.items.map((cItem) =>
                            cItem._id === item._id
                              ? {
                                  ...cItem,
                                  isSelected: true,
                                  content: item.content,
                                }
                              : cItem
                          ),
                        }
                      : col
                  ),
                }
              : child
          );
      });
      return state;
    },
    setTeamsInWorkflowAI: (state, action) => {
      state.teamsInWorkflowAI = state.teamsInWorkflowAI.map((item) => ({
        ...item,
        children: action.payload,
      }));
    },
    // *setTeamInWorkflowAITeams sets the individual item in items
    setTeamInWorkflowAITeams: (state, action) => {
      state.teamsInWorkflowAI[0].children[0].column[0].items = [
        ...state.teamsInWorkflowAI[0].children[0].column[0].items,
        action.payload,
      ];
    },
    setPortfoliosInWorkflowAITeams: (state, action) => {
      switch (action.payload.type) {
        case 'normal':
          state.teamsInWorkflowAI[0].children[1].column[0].items = [
            ...action.payload.payload,
          ];
          break;
        case 'single':
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
    setUserDetailPosition: (state, action) => {
      state.userDetailPosition = action.payload;
    },
    setLanguageSelectPosition: (state, action) => {
      state.languageSelectPosition = action.payload;
    },
    setIconColor: (state, action) => {
      state.IconColor = action.payload;
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
    setTeamMembersSelectedForProcess: (state, action) => {
      state.teamMembersSelectedForProcess = [
        ...state.teamMembersSelectedForProcess,
        action.payload,
      ];
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
    setUserMembersSelectedForProcess: (state, action) => {
      state.userMembersSelectedForProcess = [
        ...state.userMembersSelectedForProcess,
        action.payload,
      ];
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
    setPublicMembersSelectedForProcess: (state, action) => {
      state.publicMembersSelectedForProcess = [
        ...state.publicMembersSelectedForProcess,
        action.payload,
      ];
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
    setProcessesLoading: (state, action) => {
      state.processesLoading = action.payload;
    },
    setProcessesLoaded: (state, action) => {
      state.processesLoaded = action.payload;
    },
    setAllProcesses: (state, action) => {
      state.allProcesses = action.payload;
    },
    SetArrayofLinks: (state, action) => {
      state.ArrayofLinks = action.payload;
    },
    SetCopyProcess: (state, action) => {
      state.CopyProcess = action.payload;
    },

    setShowGeneratedLinksPopup: (state, action) => {
      state.showGeneratedLinksPopup = action.payload;
    },
    setLinksFetched: (state, action) => {
      state.linksFetched = action.payload;
    },

    setLegalStatusLoading: (state, action) => {
      state.legalStatusLoading = action.payload;
    },
    setShowLegalStatusPopup: (state, action) => {
      state.showLegalStatusPopup = action.payload;
    },
    setLegalTermsAgreed: (state, action) => {
      state.legalTermsAgreed = action.payload;
    },
    setDateAgreedToLegalStatus: (state, action) => {
      state.dateAgreedToLegalStatus = action.payload;
    },
    setLegalAgreePageLoading: (state, action) => {
      state.legalArgeePageLoading = action.payload;
    },
    setAdminUser: (state, action) => {
      state.adminUser = action.payload;
    },
    setAdminUserPortfolioLoaded: (state, action) => {
      state.adminUserPortfolioLoaded = action.payload;
    },
    setSelectedPortfolioTypeForWorkflowSettings: (state, action) => {
      state.selectedPortfolioTypeForWorkflowSettings = action.payload;
    },
    updateSingleTableOfContentRequiredStatus: (state, action) => {
      const currentTableOfContents = state.tableOfContentForStep;
      if (
        !action.payload ||
        !action.payload.hasOwnProperty('workflow') ||
        !action.payload.hasOwnProperty('stepIndex') ||
        !action.payload.hasOwnProperty('id')
      )
        return void (state.tableOfContentForStep = currentTableOfContents);

      const foundContentIndex = currentTableOfContents.findIndex(
        (content) =>
          content.stepIndex === action.payload.stepIndex &&
          content.workflow === action.payload.workflow &&
          content.id === action.payload.id
      );
      if (foundContentIndex === -1)
        return void (state.tableOfContentForStep = currentTableOfContents);

      const updatedContent = {
        ...currentTableOfContents[foundContentIndex],
        required: action.payload.value,
      };
      currentTableOfContents[foundContentIndex] = updatedContent;

      state.tableOfContentForStep = currentTableOfContents;
    },
    setSavedProcessConfigured: (state, action) => {
      state.savedProcessConfigured = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getItemsCount
    builder.addCase(getItemsCounts.pending, (state) => {
      state.itemsCountStatus = 'pending';
    });
    builder.addCase(getItemsCounts.fulfilled, (state, action) => {
      state.itemsCountStatus = 'succeeded';
      state.itemsCount = action.payload;
    });
    builder.addCase(getItemsCounts.rejected, (state, action) => {
      state.itemsCountStatus = 'error';
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
  setSettingProccessTeams,
  setSettingProccessPortfolios,
  setColumn,
  setProccess,
  setUpdateProccess,
  setPermissionArray,
  setFetchedPermissionArray,
  setTeamsInWorkflowAI,
  setTeamInWorkflowAITeams,
  setTeamsInWorkflowAITeams,
  setPortfoliosInWorkflowAITeams,
  setUpdateInWorkflowAITeams,
  setUserDetailPosition,

  setLanguageSelectPosition,
  setIconColor,
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
  SetArrayofLinks,
  SetCopyProcess,
  setShowGeneratedLinksPopup,
  setLinksFetched,
  setLegalStatusLoading,
  setShowLegalStatusPopup,
  setLegalTermsAgreed,
  setDateAgreedToLegalStatus,
  setLegalAgreePageLoading,
  setAdminUser,
  setAdminUserPortfolioLoaded,
  setSelectedPortfolioTypeForWorkflowSettings,
  updateSingleTableOfContentRequiredStatus,
  setSavedProcessConfigured,
} = appSlice.actions;

export default appSlice.reducer;
