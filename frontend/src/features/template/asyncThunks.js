import { createAsyncThunk } from "@reduxjs/toolkit";
import { TemplateServices } from "../../services/templateServices";
import { setToggleEditor, setEditorLink } from "../app/appSlice";

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

      let templates = res.data.filter(
        (item) =>
          item.data_type ===
          thunkAPI.getState().auth?.userDetail?.portfolio_info?.data_type
      );

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

      let templates = res.data.filter(
        (item) =>
          item.data_type ===
          thunkAPI.getState().auth?.userDetail?.portfolio_info?.data_type
      );

      return templates;
    } catch (error) {
      console.log(error);
    }
  }
);
