import { createSlice } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from 'uuid';
import DocumentCard from "../../components/hoverCard/documentCard/DocumentCard";
import TemplateCard from "../../components/hoverCard/templateCard/TemplateCard";
import WorkflowCard from "../../components/hoverCard/workflowCard/WorkflowCard";

const initialState = {
  notificationsForUser: [
    {
      id: uuidv4(),
      title: 'documents',
      cardBgColor: '#1ABC9C',
      card: DocumentCard,
      items: [],
    },
    {
      id: uuidv4(),
      title: 'templates',
      cardBgColor: null,
      card: TemplateCard,
      items: [],
    },
    {
      id: uuidv4(),
      title: 'workflows',
      card: WorkflowCard,
      cardBgColor: null,
      items: [],
    },
  ],
  notificationsLoading: true,
  notificationFinalStatus: null,
  notificationsLoaded: false,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationsForUser: (state, action) => {
        state.notificationsForUser = action.payload;
    },
    setNotificationsLoading: (state, action) => {
      state.notificationsLoading = action.payload;
    },
    setNotificationFinalStatus: (state, action) => {
      state.notificationFinalStatus = action.payload;
    },
    setNotificationsLoaded: (state, action) => {
      state.notificationsLoaded = action.payload;
    },
  }
})

export const {
  setNotificationsForUser,
  setNotificationsLoading,
  setNotificationFinalStatus,
  setNotificationsLoaded,
} = notificationSlice.actions;

export default notificationSlice.reducer;