/* import { configureStore } from "@reduxjs/toolkit";
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
}); */
import workflowReducer from "../features/workflow/workflowsSlice";
import templateReducer from "../features/template/templateSlice";
import documentReducer from "../features/document/documentSlice";
import appReducer from "../features/app/appSlice";
import authReducer from "../features/auth/authSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";

import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  workflow: workflowReducer,
  template: templateReducer,
  document: documentReducer,
  app: appReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
