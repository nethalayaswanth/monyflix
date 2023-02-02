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
        <Navbar/>
        <Outlet />
      </div>
    </>
  );
}
