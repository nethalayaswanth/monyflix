import React, { createContext, useContext, useReducer } from "react";

const ModalStateContext = createContext();
const ModalDispatchContext = createContext();

const initialState = {
  expand: false,
  parent: null,
  details: false,
  movie: null,
  param: null,
  cardState: null,
  mini: false,
  collapsed: null,
};

function Reducer(state, action) {
  
  switch (action.type) {
    case "set modal": {
    const updates= action.callback?.(state);

    const temp = { ...state, ...action.payload, ...updates };

    const collapsed=temp.cardState==='collapsed'
    const small = temp.cardState === "mini";
    const expanded = temp.cardState === "expanded";
      return {
        ...temp,collapsed,small,expanded
      };
    }
    case "modal callback": {
    const updates =  action.callback?.(state);
      return {
        ...state,
        ...updates,
      };
    }
    case "set movie": {
      return { ...state, movie: action.movie };
    }
    case "set movieDetails": {
      return {
        ...state,
        movie: { ...state.movie, ...action.movie },
        activate: action.activate,
      };
    }
    case "set hovering": {
      return { ...state, isHovering: action.isHovering };
    }
    case "set miniExpanded": {
      return {
        ...state,
        miniExpanded: action.miniExpanded,
      };
    }

    case "set expand": {
      return {
        ...state,
        expand: action.expand,
      };
    }
    case "set expanded": {
      return {
        ...state,
        expanded: action.expanded,
      };
    }
    case "set miniExpand": {
      return {
        ...state,
        miniExpand: action.miniExpand,
      };
    }

    case "set activate": {
      return {
        ...state,
        activate: action.activate,
      };
    }
    case "set activated": {
      return {
        ...state,
        activated: action.activated,
      };
    }
    case "set paramModal": {
      return {
        ...state,
        activated: action.activated,
        param: action.param,
        expand: action.expand,
      };
    }
    case "set enabled": {
      return {
        ...state,
        enabled: action.enabled,
      };
    }

    case "reset paramModal": {
      return {
        ...state,
        activated: false,
        param: null,
        expand: false,
        collapseMini:false

      };
    }

    case "set reset": {

      const temp = {
        ...state,

        miniExpand: false,
        expand: false,
        parent: null,
        movie: null,
        param: null,
        mini: false,
        showMini: false,
        cardState:null
      };

       const collapsed = temp.cardState === "collapsed";
       const small = temp.cardState === "mini";
       const expanded = temp.cardState === "expanded";
      return {
       ...temp,collapsed,small,expanded
      };
    }

    case "set parent": {
      return {
        ...state,

        parent: action.parent,
      };
    }

    case "set param": {
      return {
        ...state,

        param: action.param,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ModalProvider({ children }) {
  const [state, dispatch] = useReducer(Reducer, initialState);

  
  const value = [state, dispatch];
  value.state = state;
  value.dispatch = dispatch;

  return (
    <ModalStateContext.Provider value={value}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
}

function useModalState() {
  const context = useContext(ModalStateContext);
  if (context === undefined) {
    throw new Error("useModalState must be used within a ModalProvider");
  }

  return context;
}

function useModalDispatch() {
  const context = useContext(ModalDispatchContext);
  if (context === undefined) {
    throw new Error("useModalDispatch must be used within a ModalProvider");
  }

  return context;
}

export { useModalState, useModalDispatch, ModalProvider };
