import React from "react";

import { EpicProvider } from "./context";
import EpicContainer from "./EpicContainer";

export default function Epic(props) {
  return (
    <EpicProvider>
      <EpicContainer {...props} />
    </EpicProvider>
  );
}
