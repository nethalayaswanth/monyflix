import React, {
  useRef,
  useState,
  createContext,
  useReducer,
  useCallback,
  useContext,
  useMemo,
} from "react";

const CardContext = createContext();

function Reducer(state, action) {
  switch (action.type) {
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
    case "set reset": {
      return {
        ...state,

        miniExpand: false,
        expand: false,
        isHovering: false,
        miniExpanded: false,
        expanded: false,
       activate: false,
        activated: false,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialState = {
  miniExpand: false,
  expand: false,
  isHovering: false,
  miniExpanded: false,
  expanded: false,
  activate: false,
  activated: false,
  movie: null,
};
function CardProvider({ children }) {
  const [currentState, dispatch] = useReducer(Reducer, initialState);

  const state = useMemo(() => currentState, [currentState]);
  const value = { state, dispatch };
  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

function useCardState() {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error("useCardState must be used within a CardProvider");
  }
  const { state, dispatch } = context;
  return [state, dispatch];
}

export { useCardState, CardProvider };
