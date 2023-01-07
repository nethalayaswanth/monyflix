import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import ExpandModal from "./expandModal";
import TrailExpandModal from './trail'


const Modal = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  let location = useLocation();

  const [{ activate, parent, activated,expanded }, dispatch] = useModalState();

  

  return parent || param || expanded ? (
    <ErrorBoundary
      //onReset={reset}
      fallbackRender={({ resetErrorBoundary, error }) => {
        return (
          <div>
            There was an error!
            <button onClick={() => resetErrorBoundary()}>Try again</button>
          </div>
        );
      }}
    >
     
      <TrailExpandModal />
    </ErrorBoundary>
  ) : null;



  
     
};

export default Modal;
