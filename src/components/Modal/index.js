import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";

import Modal from './modal'


const ModalWrapper = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  let location = useLocation();

  const [{ activate, parent, activated,expand }, dispatch] = useModalState();

  const mount=parent || param || expand
  

  return  mount? (
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
      <Modal />
    </ErrorBoundary>
  ) : null;



  
     
};

export default ModalWrapper;
