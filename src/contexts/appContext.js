import React, { createContext, useContext, useReducer } from "react";

const AppContext = createContext();

function Reducer(state, action) {
  switch (action.type) {
    case "set modalOpen": {
      return { ...state, isModalOpen: action.isModalOpen };
    }

    case "set modalActivated": {
      return { ...state, isModalActive: action.isModalActive };
    }

    case "set modalReset": {
      return { ...state, isModalActive: false, isModalOpen: false };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialState = {
  isModalOpen: false,
  isModalActive:false

};
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppProvider");
  }
  const { state, dispatch } = context;
  return [state, dispatch];
}

export { useAppState, AppProvider };

