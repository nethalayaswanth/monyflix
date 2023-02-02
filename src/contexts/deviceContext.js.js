import React, { createContext, useContext } from "react";
import useMedia from "../hooks/useBreakpoint";

const DeviceContext = createContext();

function DeviceProvider({ children }) {
  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  return (
    <DeviceContext.Provider value={{ mobile, desktop }}>
      {children}
    </DeviceContext.Provider>
  );
}

function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a ModalProvider");
  }

  return context;
}

export {useDevice,DeviceProvider}