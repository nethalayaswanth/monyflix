import React, { createContext, useContext, useEffect, useState } from "react";

const DocumentInteraction = createContext();

export function DocumentInteractionProvider({ children }) {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    const listener = () => {
      setInteracted(true);
      removeListeners()
    };
    const removeListeners =()=> ["click", "touchdown"].forEach((eventName) => {
      window.removeEventListener(eventName, listener);
    });
    [
      "click",
      "touchdown",
    ].forEach((eventName) => {
      window.addEventListener(eventName,listener );
    });

    return removeListeners;
  });


  return (
    <DocumentInteraction.Provider value={interacted}>{children}</DocumentInteraction.Provider>
  );
}

export function useDocumentInteraction() {
  const context = useContext(DocumentInteraction);
  if (context === undefined) {
    throw new Error(
      "useDocumentInteraction must be used within a DocumentInteractionProvider"
    );
  }

  return context;
}
