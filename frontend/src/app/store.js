import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "../features/workflow/workflowsSlice";
import templateReducer from "../features/template/templateSlice";
import documentReducer from "../features/document/documentSlice";
import appReducer from "../features/app/appSlice";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    template: templateReducer,
    document: documentReducer,
    app: appReducer,
  },
});
