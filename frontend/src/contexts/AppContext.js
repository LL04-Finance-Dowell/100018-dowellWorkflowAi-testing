import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [toggleNewFileForm, setToggleNewFileForm] = useState(null);

  return (
    <AppContext.Provider value={{ toggleNewFileForm, setToggleNewFileForm }}>
      {children}
    </AppContext.Provider>
  );
};
