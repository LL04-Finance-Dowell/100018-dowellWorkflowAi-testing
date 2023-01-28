import { createAsyncThunk } from "@reduxjs/toolkit";
import { WorkflowSettingServices } from "../../services/workflowSettingServices";

const workflowSettingServices = new WorkflowSettingServices();

export const createWorkflowSettings = createAsyncThunk(
  "settings/create",
  async (data) => {
    try {
      const res = await workflowSettingServices.createWorkflowSettings(data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getWorkflowSettings = createAsyncThunk(
  "settings/get",
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
  "settings/update",
  async (data) => {
    try {
      const res = await workflowSettingServices.updateWorkflowSettings(data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
