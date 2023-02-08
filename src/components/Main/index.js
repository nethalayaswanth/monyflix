import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import Modal from "../Modal";
import Navbar from "../Navbar";

export function Main() {
  
  return (
    <>
      <Modal />

      <div
        id="app"
        className="App"
        style={{
          position: "static",
          overflow: "hidden",
          zindex: 0,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Navbar />
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary, error }) => {
            console.warn(error);
            return (
              <div>
                There was an error!
                <button onClick={() => resetErrorBoundary()}>Try again</button>
              </div>
            );
          }}
        >
          <Outlet />
        </ErrorBoundary>
      </div>
    </>
  );
}
