import { createAsyncThunk } from '@reduxjs/toolkit';
import { WorkflowSettingServices } from '../../services/workflowSettingServices';
import { setUpdateProccessApi } from '../processes/processesSlice';


const workflowSettingServices = new WorkflowSettingServices();

export const createWorkflowSettings = createAsyncThunk(
  'settings/create',
  async (data, thunkAPI) => {
    try {
      const res = await workflowSettingServices.createWorkflowSettings(data);

      if (res.data) {
        thunkAPI.dispatch(
          setUpdateProccessApi(res.data?.workflow_setting.processes[0].process)
        );

        return res.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getWorkflowSettings = createAsyncThunk(
  'settings/get',
  async (data) => {
    try {
      const res = await workflowSettingServices.getWorkflowSettings(data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateWorkflowSettings = createAsyncThunk(
  'settings/update',
  async (data) => {
    try {
      const res = await workflowSettingServices.updateWorkflowSettings(data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
