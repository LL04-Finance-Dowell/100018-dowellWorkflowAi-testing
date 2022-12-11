import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import { UserContextProvider } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto"; // Defaults to weight 400.
import { AppContextProvider } from "./contexts/AppContext";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <UserContextProvider>
            <AppContextProvider>
              <App />
            </AppContextProvider>
            <ToastContainer />
          </UserContextProvider>
        </PersistGate>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
