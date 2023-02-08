import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";

const ModalStateContext = createContext();
const ModalDispatchContext = createContext();

const initialState = {
  parent: null,
  details: false,
  movie: null,
  param: null,
  cardState: null,
  small: false,
  collapsed: false,
  expanded: false,
};

function Reducer(state, action) {
  switch (action.type) {
    case "set modal": {
      const updates = action.callback?.(state);

      const temp = { ...state, ...action.payload, ...updates };

      const collapsed = temp.cardState === "collapsed";
      const small = temp.cardState === "mini";
      const expanded = temp.cardState === "expanded";
      return {
        ...temp,
        collapsed,
        small,
        expanded,
      };
    }
    case "modal callback": {
      const updates = action.callback?.(state);
      return {
        ...state,
        ...updates,
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
        cardState: null,
      };

      const collapsed = temp.cardState === "collapsed";
      const small = temp.cardState === "mini";
      const expanded = temp.cardState === "expanded";
      return {
        ...temp,
        collapsed,
        small,
        expanded,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ModalProvider({ children }) {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const stateRef = useRef(state);

  stateRef.current = state;
  const value = [state, dispatch];

  value.state = state;
  value.dispatch = dispatch;

  const _refProps = useMemo(() => {
    const refProps = [stateRef, dispatch];
    refProps.stateRef = stateRef;
    refProps.dispatch = dispatch;
    return refProps;
  }, []);
  return (
    <ModalStateContext.Provider value={value}>
      <ModalDispatchContext.Provider value={_refProps}>
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
