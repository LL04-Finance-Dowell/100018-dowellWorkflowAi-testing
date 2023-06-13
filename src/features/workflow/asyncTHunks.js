import { createAsyncThunk } from '@reduxjs/toolkit';
import { WorkflowServices } from '../../services/workflowServices';
import { setCurrentWorkflow, setToggleManageFileForm } from '../app/appSlice';
import { removeFromMinedWf, setAllWorkflows } from './workflowsSlice';
import { v4 as uuidv4 } from 'uuid';
import { changeToTitleCase, productName } from '../../utils/helpers';

const workflowServices = new WorkflowServices();

const filterWorkflows = (workflows, thunkAPI) => {
  let filteredWorkflows = [];

  if (workflows && workflows.length && workflows?.length > 0) {
    const userThunkPortfolioDataTypeState =
      thunkAPI.getState().auth?.userDetail?.portfolio_info?.length > 1
        ? thunkAPI
            .getState()
            .auth?.userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.data_type
        : thunkAPI.getState().auth?.userDetail?.portfolio_info[0]?.data_type;

    filteredWorkflows = workflows
      .filter(
        (item) =>
          (item?.data_type &&
            item?.data_type === userThunkPortfolioDataTypeState) ||
          (item.workflows.data_type &&
            item.workflows.data_type === userThunkPortfolioDataTypeState)
      )
      .map((item) => ({
        ...item,
        workflows: {
          ...item.workflows,
          /* _id: uuidv4(), */
          steps: item.workflows.steps.map((step) => ({
            ...step,
            _id: uuidv4(),
          })),
        },
      }));
  } else {
    filteredWorkflows = [];
  }

  return filteredWorkflows;
};

export const createWorkflow = createAsyncThunk(
  'workflow/create',
  async ({ data, notify, handleAfterCreated }, thunkAPI) => {
    try {
      const res = await workflowServices.createWorkflow(data);

      const existingWorkflows = [...thunkAPI.getState().workflow?.allWorkflows];
      existingWorkflows.push(res.data);
      thunkAPI.dispatch(setAllWorkflows(existingWorkflows));

      notify(changeToTitleCase('successfully created new workflow!'));

      handleAfterCreated();

      return res.data.workflow;
    } catch (error) {
      console.log(error);
    }
  }
);

export const mineWorkflows = createAsyncThunk(
  'workflow/mine',
  async (data, thunkAPI) => {
    try {
      const res = await workflowServices.mineWorkflows(data);

      const workflows = filterWorkflows(res.data.workflow, thunkAPI);

      return workflows;
    } catch (error) {
      console.log(error);
    }
  }
);

export const savedWorkflows = createAsyncThunk(
  'workflow/saved',
  async (data, thunkAPI) => {
    try {
      const res = await workflowServices.savedWorkflows(data);

      const workflows = filterWorkflows(res.data.workflows, thunkAPI);

      return workflows;
    } catch (error) {
      console.log(error);
    }
  }
);

export const detailWorkflow = createAsyncThunk(
  'workflow/detail',
  async (data, asyncTHunks) => {
    try {
      const res = await workflowServices.detailWorkflow(data);

      asyncTHunks.dispatch(setCurrentWorkflow(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
      asyncTHunks.dispatch(setToggleManageFileForm(false));
    }
  }
);

export const updateWorkflow = createAsyncThunk(
  'workflow/update',
  async ({ updateData, notify, handleAfterCreated }, thunkAPI) => {
    try {
      const res = await workflowServices.updateWorkflow(
        updateData.workflow_id,
        updateData
      );

      typeof res.data === 'string' && notify(changeToTitleCase(res.data));

      thunkAPI.dispatch(removeFromMinedWf(updateData.workflow_id));

      handleAfterCreated();

      return res.data.workflow;
    } catch (error) {
      console.log(error);
    }
  }
);

export const allWorkflows = createAsyncThunk(
  'workflow/all',
  async (data, thunkAPI) => {
    try {
      const res = await workflowServices.allWorkflows(
        data.company_id,
        data.data_type
      );

      const workflows = filterWorkflows(res.data.workflows, thunkAPI);

      return workflows;
    } catch (error) {
      console.log(error);
    }
  }
);
