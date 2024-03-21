import { createSlice } from '@reduxjs/toolkit';
import { createGroups,editGroups, getGroups } from './groupThunk';


const initialState = {
  createGroup: null,
  UpdateGroup: null,
  allGroups: [],
  selectedGroups:[],
  createGroupsStatus: 'idle',
  updateGroupsStatus: 'idle',
  getGroupsStatus: 'idle',
  errorMessage:null,
  selectedGroupForEdit:null
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setSelectedGroupsMembers: (state, action) => {
      state.selectedGroups = action.payload;
    },
    setSelectedGroupForEdit: (state, action) => {
      state.selectedGroupForEdit = action.payload;
    },
    setUpdatedGroupFlag: (state, action) => {
      state.UpdateGroup= Date.now();
    },
  },
  extraReducers: (builder) => {
    //createGroups
    builder.addCase(createGroups.pending, (state) => {
      state.createGroupsStatus = 'pending';
    });
    builder.addCase(createGroups.fulfilled, (state, action) => {
      state.createGroupsStatus = 'succeeded';
      state.createGroup= action.payload;
    });
    builder.addCase(createGroups.rejected, (state, action) => {
      state.createGroupsStatus = 'failed';
      state.errorMessage = action.payload;
    });
    //UpdateGroups
    builder.addCase(editGroups.pending, (state) => {
      state.updateGroupsStatus = 'pending';
    });
    builder.addCase(editGroups.fulfilled, (state, action) => {
      state.updateGroupsStatus = 'succeeded';
  
    });
    builder.addCase(editGroups.rejected, (state, action) => {
      state.updateGroupsStatus = 'failed';
      state.errorMessage = action.payload;
    });
    //getGroups
    builder.addCase(getGroups.pending, (state) => {
      state.getGroupsStatus = 'pending';
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.getGroupsStatus = 'succeeded';
      state.allGroups = action.payload;
    });
    builder.addCase(getGroups.rejected, (state, action) => {
      state.getGroupsStatus = 'failed';
      state.errorMessage = action.payload;
    });

  
  },
});

export const selectAllGroups = (state)=>state.groups.allGroups;

export const createGroupsStatus = (state)=>state.groups.createGroupsStatus;

export const updateGroupsStatus = (state)=>state.groups.updateGroupsStatus;

export const createGroupInsertId = (state)=>state.groups.createGroup;

export const updateGroupFlag = (state)=>state.groups.UpdateGroup;


export const getGroupsStatus = (state)=>state.groups.getGroupsStatus;

export const selectedGroupMembers = (state)=>state.groups.selectedGroups;

export const selectedGroupForEdit= (state)=>state.groups.selectedGroupForEdit;

export const {setUpdatedGroupFlag, setSelectedGroupsMembers,setSelectedGroupForEdit } = groupsSlice.actions;

export default groupsSlice.reducer;
