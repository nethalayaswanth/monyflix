import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";

import ModalWrapper from "./modal";

const Modal= () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");


  const [{ parent, collapsed,expanded,small, }, dispatch] = useModalState();

  const mount =  parent || collapsed ||small || param || expanded 

  return mount ? (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary, error }) => {
        return (
          <div>
            There was an error!
            <button onClick={() => resetErrorBoundary()}>Try again</button>
          </div>
        );
      }}
    >
      <ModalWrapper />
    </ErrorBoundary>
  ) : null;
};

export default Modal;
