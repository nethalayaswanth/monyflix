import React, { createContext, useContext, useMemo, useReducer } from "react";

const ModalContext = createContext();

const initialState = {
  miniExpand: false,
  expand: false,
  parent: null,
  isHovering: false,
  miniExpanded: false,
  expanded: false,
  activate: false,
  activated: false,
  details:false,
  movie: null,
  param: null,
  enabled: true,
  scroll:null
};

function Reducer(state, action) {
  switch (action.type) {
    case "set modal": {
      return {
        ...state,
       ...action.payload
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
        expanded: false,
      };
    }

    case "set reset": {
      return {
        ...state,

        miniExpand: false,
        expand: false,
        parent: null,
        isHovering: false,
        miniExpanded: false,
        expanded: false,
        activate: false,
        activated: false,
        details:false,
        movie: null,
        param: null,
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
  const [currentState, dispatch] = useReducer(Reducer, initialState);

  const state = useMemo(() => currentState, [currentState]);
  const value = { state, dispatch };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

function useModalState() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModalState must be used within a ModalProvider");
  }
  const { state, dispatch } = context;
  return [state, dispatch];
}

export { useModalState, ModalProvider };

