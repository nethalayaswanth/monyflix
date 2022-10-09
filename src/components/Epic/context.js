
import React, { createContext, useContext, useReducer } from "react";


const EpicContext = createContext();

function Reducer(state, action) {
  switch (action.type) {
    case "set state": {
      return { ...state, ...action.payload };
    }
    case "play": {
      return { ...state, play: true };
    }
    case "show": {
      return { ...state, show: true };
    }
    case "hide": {
      return { ...state, show: false, play: false };
    }
    case "pause": {
      return { ...state, pause: false };
    }
    case "set image": {
      return { ...state, img: action.img };
    }
    case "set current": {
      return { ...state, id: action.id };
    }
    case "set video": {
      return { ...state, img: action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialState = {
  play: false,
  show: true,
  img: null,
  video: null,
  title: "",
  overview: "",
  id: 0,
};
function EpicProvider({ children }) {

  const [state, dispatch] = useReducer(Reducer, initialState);

  const value = { state, dispatch };
  return (
    <EpicContext.Provider value={value}>{children}</EpicContext.Provider>
  );
}

function useEpicState() {
  const context = useContext(EpicContext);
  if (context === undefined) {
    throw new Error("useEpicState must be used within a EpicProvider");
  }
  const { state, dispatch } = context;
  return [state,dispatch] ;
}

export { useEpicState, EpicProvider };

