import { createSlice } from '@reduxjs/toolkit';
import { createGroups, getGroups } from './groupThunk';


const initialState = {
  createGroup: null,
  allGroups: [],
  selectedGroups:[],
  createGroupsStatus: 'idle',
  getGroupsStatus: 'idle',
  errorMessage:null
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setSelectedGroupsMembers: (state, action) => {
      state.selectedGroups = action.payload;
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

export const createGroupInsertId = (state)=>state.groups.createGroup;

export const getGroupsStatus = (state)=>state.groups.getGroupsStatus;

export const selectedGroupMembers = (state)=>state.groups.selectedGroups;

export const { setSelectedGroupsMembers } = groupsSlice.actions;

export default groupsSlice.reducer;
