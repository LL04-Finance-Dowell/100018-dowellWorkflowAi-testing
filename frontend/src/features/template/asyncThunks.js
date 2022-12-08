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

export const mineTemplates = createAsyncThunk("template/mine", async (data) => {
  try {
    const res = await templateServices.mineTemplates(data);

    console.log("mine teplatessssssssss", res.data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
});

/* export const draftsTemplate = createAsyncThunk(
  "template/drafts",
  async (data) => {
    try {
      const res = await templateServices.draftsTemplate(data);

      console.log("ressssssssssssssss", res.data.slice(0, 3));

      return res.data.slice(0, 3);
    } catch (error) {
      console.log(error);
    }
  }
);
 */
