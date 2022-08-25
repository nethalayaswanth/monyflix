
import React, { createContext, useContext, useReducer } from "react";


const EpicContext = createContext();

function Reducer(state, action) {
  switch (action.type) {
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
    case "set_image": {
      return { ...state, img: action.img};
    }
    case "set_current": {
      return { ...state, id:action.id};
    }
    case "set_video": {
      return { ...state, img: action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialState={
    play:false,
    show:true,
    img:null,
    video:null,
    title:'',
    overview:'',
    id:null,
    
}
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
