import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { getItemsCounts } from './asyncThunks';
import {
  permissionArray,

} from '../../components/workflowAiSettings/veriables';

const initialState = {
  errorMessage: null,
  itemsCount: null,
  itemsCountStatus: 'idle',
  errorMessage: null,
  toggleManageFileForm: false,
  currentWorkflow: null,
  editorLink: null,
  docCurrentWorkflow: null,
  selectedWorkflowsToDoc: [],
  currentDocToWfs: null,
  tableOfContentForStep: [],
  themeColor: '#61CE70',
  permissionArray,
  column: [],
  IconColor: '',
  currentMessage:'',   
  creditResponse:[],                           
  userDetailPosition: null,
  languageSelectPosition: null,
  temLoading: false,
  temLoaded: true,
  ArrayofLinks: [],
  ShowProfileSpinner: false,
  ShowDocumentReport: [],
  SingleDocument: [],
  KnowledgeFolders: [],
  DocumentId: '',
  KnowledgeFolderTemplates: [],
  linksFetched: false,
  DetailFetched:false,
  showGeneratedLinksPopup: false,
  popupIsOpen:false,
  legalStatusLoading: true,
  showLegalStatusPopup: false,
  legalTermsAgreed: false,
  dateAgreedToLegalStatus: '',
  legalArgeePageLoading: false,
  adminUser: false,
  adminUserPortfolioLoaded: false,
  selectedPortfolioTypeForWorkflowSettings: null,
  showApiKeyFetchFailureModal: false,
  apiKeyFetchFailureMessage: '',
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
    setError: (state, action) => {
      state.errorMessage = action.payload;

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

    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
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

    setUserDetailPosition: (state, action) => {
      state.userDetailPosition = action.payload;
    },
    setLanguageSelectPosition: (state, action) => {
      state.languageSelectPosition = action.payload;
    },
    setIconColor: (state, action) => {
      state.IconColor = action.payload;
    },
 
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    setcreditResponse: (state, action) => {
      state.creditResponse = action.payload;
    },

    settemLoading: (state, action) => {
      state.temLoading = action.payload;
    },
    settemLoaded: (state, action) => {
      state.temLoaded = action.payload;
    },

    SetArrayofLinks: (state, action) => {
      state.ArrayofLinks = action.payload;
    },
    SetShowDocumentReport: (state, action) => {
      state.ShowDocumentReport = action.payload;
    },
    SetSingleDocument: (state, action) => {
      state.SingleDocument = action.payload;
    },
    SetKnowledgeFolders: (state, action) => {
      state.KnowledgeFolders = action.payload;
    },
    SetDocumentId: (state, action) => {
      state.DocumentId = action.payload;
    },
    SetKnowledgeFoldersTemplates: (state, action) => {
      state.KnowledgeFolderTemplates = action.payload;
    },
    setShowProfileSpinner: (state, action) => {
      state.ShowProfileSpinner = action.payload;
    },

    setShowGeneratedLinksPopup: (state, action) => {
      state.showGeneratedLinksPopup = action.payload;
    },
  
  
    setPopupIsOpen: (state, action) => {
      state.popupIsOpen = action.payload;
    },
    setLinksFetched: (state, action) => {
      state.linksFetched = action.payload;
    },
    setDetailFetched: (state, action) => {
      state.DetailFetched = action.payload;
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

   
    setShowApiKeyFetchFailureModal: (state, action) => {
      state.showApiKeyFetchFailureModal = action.payload;
    },
    setApiKeyFetchFailureMessage: (state, action) => {
      state.apiKeyFetchFailureMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getItemsCounts.rejected, (state, action) => {
      state.itemsCountStatus = 'error';
      state.errorMessage = "Cannot fetch the data of this document, please try again later";
    });

    //getItemsCount
    builder.addCase(getItemsCounts.pending, (state) => {
      state.itemsCountStatus = 'pending';
    });
    builder.addCase(getItemsCounts.fulfilled, (state, action) => {
      state.itemsCountStatus = 'succeeded';
      state.itemsCount = action.payload;
    });
    // builder.addCase(getItemsCounts.rejected, (state, action) => {
    //   state.itemsCountStatus = 'error';
    //   state.errorMessage = action.payload;
    // });
  },
});

// Action creators are generated for each case reducer function
export const {
  setToggleManageFileForm,
  setEditorLink,
  setCurrentWorkflow,
  setDropdowndToggle,

  removeFromSelectedWorkflowsToDoc,
  removeFromSelectedWorkflowsToDocGroup,
  setCurrentMessage,
  setcreditResponse,
  setPopupIsOpen,
  setThemeColor,
  setPermissionArray,
  setFetchedPermissionArray,
  setUserDetailPosition,
  setShowProfileSpinner,
  setLanguageSelectPosition,
  setIconColor,
  settemLoading,
  SetArrayofLinks,
  setShowGeneratedLinksPopup,
  SetShowDocumentReport,
  SetSingleDocument,
  SetKnowledgeFolders,
  SetDocumentId,
  SetKnowledgeFoldersTemplates,
  setDetailFetched,
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
  setApiKeyFetchFailureMessage,
  setShowApiKeyFetchFailureModal,
  setError,
  setNotificationsForUser,
  setAllProcesses
} = appSlice.actions;

export default appSlice.reducer;
