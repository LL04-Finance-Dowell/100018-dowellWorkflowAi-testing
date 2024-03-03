import { createAsyncThunk } from '@reduxjs/toolkit';
import { WorkflowServices } from '../../services/workflowServices';
import { setCurrentWorkflow, setToggleManageFileForm } from '../app/appSlice';
import { removeFromMinedWf, setAllWorkflows } from './workflowsSlice';
// import { v4 as uuidv4 } from 'uuid';
import { changeToTitleCase, productName } from '../../utils/helpers';
import { toast } from 'react-toastify';

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
    
    // // console.log('user thunk portfolio', userThunkPortfolioDataTypeState);
    filteredWorkflows = workflows
      .filter(
        (item) =>
          (
            (item?.data_type &&
              item?.data_type === userThunkPortfolioDataTypeState) ||
            (item.workflows.data_type &&
              item.workflows.data_type === userThunkPortfolioDataTypeState)
          ) &&
          // extra conditions to prevent the app from crashing due to unregular workflow structure
          item.workflows &&
          item.workflows.steps &&
          item.workflows.workflow_title
      )
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
      // console.log(error);
      toast.info('Workflow Creation Failed');

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
      // console.log(error);
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
      // console.log(error);
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
      // console.log(error);
      asyncTHunks.dispatch(setToggleManageFileForm(false));
    }
  }
);

export const updateWorkflow = createAsyncThunk(
  'workflow/update',
  async ({ newData, notify, handleAfterCreated }, thunkAPI) => {
    try {
      const res = await workflowServices.updateWorkflowNew(
        newData._id,
        newData
      );
        // console.log("the res is ", res)
      typeof res.data === 'string' && notify(changeToTitleCase(res.data));

      // thunkAPI.dispatch(removeFromMinedWf(updateData.workflow_id));

      handleAfterCreated();

      return res.data.workflow;
    } catch (error) {
      // console.log(error);
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
      // console.log(error);
    }
  }
);
