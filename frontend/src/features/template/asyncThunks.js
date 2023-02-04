import { createAsyncThunk } from "@reduxjs/toolkit";
import { TemplateServices } from "../../services/templateServices";
import { setToggleEditor, setEditorLink } from "../app/appSlice";

const filterTemplates = (templates, thunkAPI) => {
  let filteredTemplates = [];

  if (templates && templates.length && templates.length > 0) {
    filteredTemplates = templates.filter(
      (item) =>
        item.data_type &&
        item.data_type ===
          thunkAPI.getState().auth?.userDetail?.portfolio_info[0]?.data_type
    );
  } else {
    filteredTemplates = [];
  }

  return filteredTemplates;
};

const templateServices = new TemplateServices();

export const createTemplate = createAsyncThunk(
  "template/create",
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.createTemplate(data);

      thunkAPI.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const detailTemplate = createAsyncThunk(
  "template/detail",
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.detailTemplate(data);

      console.log("template data detail", res.data);

      thunkAPI.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const mineTemplates = createAsyncThunk(
  "template/mine",
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.mineTemplates(data);

      console.log("mine teplatessssssssss", res.data);

      const templates = filterTemplates(res.data, thunkAPI);

      return templates;
    } catch (error) {
      console.log(error);
    }
  }
);

export const savedTemplates = createAsyncThunk(
  "template/saved",
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.savedTemplates(data);

      const templates = filterTemplates(res.data, thunkAPI);

      return templates;
    } catch (error) {
      console.log(error);
    }
  }
);

export const allTemplates = createAsyncThunk(
  "template/all",
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.allTemplates(data);

      const templates = filterTemplates(res.data.templates, thunkAPI);

      return templates;
    } catch (error) {
      console.log(error);
    }
  }
);
