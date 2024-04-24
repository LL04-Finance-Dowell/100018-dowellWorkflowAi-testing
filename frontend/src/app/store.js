import workflowReducer from "../features/workflow/workflowsSlice";
import templateReducer from "../features/template/templateSlice";
import documentReducer from "../features/document/documentSlice";
import appReducer from "../features/app/appSlice";
import authReducer from "../features/auth/authSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import settingsReducer from "../features/settings/settingSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storageSession from "redux-persist/lib/storage/session";

import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

///process copy reducer
import processCopyReducer from "../features/processCopyReducer";
//groups
import groupsReducer from "../features/groups/groupsSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import continentReducer from "../features/continents/continentsSlice";
import processesReducer from "../features/processes/processesSlice";

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
  settings: settingsReducer,
  favorites: favoritesReducer,
  copyProcess : processCopyReducer,
  groups:groupsReducer,
  notification: notificationReducer,
  processes: processesReducer,
  continent: continentReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
