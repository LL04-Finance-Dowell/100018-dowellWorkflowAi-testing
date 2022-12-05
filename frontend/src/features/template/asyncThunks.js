import { createAsyncThunk } from "@reduxjs/toolkit";
import { TemplateServices } from "../../services/templateServices";

const templateServices = new TemplateServices();

export const createTemplate = createAsyncThunk(
  "template/create",
  async (data) => {
    try {
      const res = await templateServices.createTemplate(data);

      if (res.data[0]) {
        window.open(res.data[0].slice(1), "_blank");
      }

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
