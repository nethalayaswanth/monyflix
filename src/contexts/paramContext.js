import React, { createContext, useContext, useReducer } from "react";
import { useSearchParams } from "react-router-dom";

const paramStateContext = createContext();
const paramDispatchContext = createContext();



function ParamProvider({ children }) {
let [searchParams, setSearchParams] = useSearchParams();

  const value = [searchParams, setSearchParams];
  value.state = searchParams;
  value.dispatch = setSearchParams;

  return (
    <paramStateContext.Provider value={value}>
      <paramDispatchContext.Provider value={setSearchParams}>
        {children}
      </paramDispatchContext.Provider>
    </paramStateContext.Provider>
  );
}

function useParamState() {
  const context = useContext(paramStateContext);
  if (context === undefined) {
    throw new Error("useParamState must be used within a ParamProvider");
  }

  return context;
}

function useParamDispatch() {
  const context = useContext(paramDispatchContext);
  if (context === undefined) {
    throw new Error("useParamDispatch must be used within a ParamProvider");
  }

  return context;
}

export { useParamState, useParamDispatch, ParamProvider };
