import { createAsyncThunk } from "@reduxjs/toolkit";
import { TemplateServices } from "../../services/templateServices";
import { setToggleEditor, setEditorLink } from "../app/appSlice";

const templateServices = new TemplateServices();

export const createTemplate = createAsyncThunk(
  "template/create",
  async (data, thunkAPI) => {
    try {
      const res = await templateServices.createTemplate(data);

      thunkAPI.dispatch(setEditorLink(res.data[0].slice(1)));

      return res.data[0].slice(1);
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

      console.log("dataaaaaaaa", res.data[0]);

      thunkAPI.dispatch(setEditorLink(res.data[0].slice(1)));

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const mineTemplates = createAsyncThunk("template/mine", async (data) => {
  try {
    const res = await templateServices.mineTemplates(data);

    console.log("ress", res.data.slice(0, 3));

    return res.data.slice(0, 3);
  } catch (error) {
    console.log(error);
  }
});
