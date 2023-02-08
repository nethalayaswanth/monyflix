import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { EpicProvider } from "./context";
import EpicContainer from "./EpicContainer";

export default function Epic(props) {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary, error }) => {
        console.warn(error);
        return (
          null
        );
      }}
    >
      <EpicProvider>
        <EpicContainer {...props} />
      </EpicProvider>
    </ErrorBoundary>
   
  );
}
