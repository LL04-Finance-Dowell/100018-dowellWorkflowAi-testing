import { createAsyncThunk } from '@reduxjs/toolkit';
import { TemplateServices } from '../../services/templateServices';
import { setEditorLink } from '../app/appSlice';
import { productName } from '../../utils/helpers';
import { setAllTemplates } from './templateSlice';
import { toast } from 'react-toastify';

const filterTemplates = (templates, thunkAPI) => {
  let filteredTemplates = [];

  const userThunkPortfolioDataTypeState = thunkAPI.getState().auth?.userDetail?.portfolio_info?.length > 1 ?
    thunkAPI.getState().auth?.userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type
    :
    thunkAPI.getState().auth?.userDetail?.portfolio_info[0]?.data_type;

  if (templates && templates.length && templates.length > 0) {
    filteredTemplates = templates.filter(
      (item) =>
        item.data_type &&
        item.data_type ===
        userThunkPortfolioDataTypeState
    );
  } else {
    filteredTemplates = [];
  }

  return filteredTemplates;
};

const templateServices = new TemplateServices();

export const createTemplate = createAsyncThunk(
  'template/create',
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.createTemplate(data);
      const newTemplate = {
        template_name: "New Template",
        newly_created: true,
        _id: res.data._id,
        created_by: thunkAPI.getState().auth?.userDetail?.userinfo?.username,
        data_type: thunkAPI.getState().auth?.userDetail?.portfolio_info?.length > 1 ?
          thunkAPI.getState().auth?.userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type
          :
          thunkAPI.getState().auth?.userDetail?.portfolio_info[0]?.data_type,
        created_on: new Date().toString(),
      }

      const existingTemplates = [...thunkAPI.getState().template?.allTemplates];
      existingTemplates.unshift(newTemplate);
      thunkAPI.dispatch(setAllTemplates(existingTemplates));
      // thunkAPI.dispatch(setEditorLink(res.data.editor_link));

      return res.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.info('Template Creation Failed');
    }
  }
);

export const detailTemplate = createAsyncThunk(
  'template/detail',
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.detailTemplate(data);



      thunkAPI.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const mineTemplates = createAsyncThunk(
  'template/mine',
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.mineTemplates(data);



      const templates = filterTemplates(res.data, thunkAPI);

      return templates;
    } catch (error) {
      console.log(error);
    }
  }
);

export const savedTemplates = createAsyncThunk(
  'template/saved',
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.savedTemplates(data);

      const templates = filterTemplates(res.data.template, thunkAPI);

      return templates;
    } catch (error) {
      console.log(error);
    }
  }
);

export const allTemplates = createAsyncThunk(
  'template/all',
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.allTemplates(
        data.company_id,
        data.data_type
      );
      
      const templates = filterTemplates(res.data.templates , thunkAPI);
     

      return templates;
    } catch (error) {
      console.log(error);
    }
  }
);

export const contentTemplate = createAsyncThunk(
  'template/contentTemplate',
  async (data) => {
    try {
      const res = await templateServices.contentTemplate(data);

      // console.log(res.data)
      return res.data;
    } catch (error) {
      console.log('Content template fetch error: ', error);
    }
  }
);