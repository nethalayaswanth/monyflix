import { gql, useQuery } from "@apollo/client";

import styled from "styled-components";
import Section from "./components/Section";
import Youtube from "./components/Youtube";
import Epic from "./components/Epic";
import Landing from "./components/Landing";
import { AppProvider, useAppState } from "./contexts/appContext";
import { ModalProvider } from "./contexts/modalContext";
import Modal from "./components/Modal";
import Watch from "./components/watch";
import { useTransition, animated } from "react-spring";
import { useModalState } from "./contexts/modalContext";
import {
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
  useNavigate,
  useParams,
  BrowserRouter,
  Navigate,
  useMatch,
} from "react-router-dom";
import { createUseGesture, scrollAction } from "@use-gesture/react";
import { useEffect, useRef, useState } from "react";

function App() {
  const match = useMatch("/browse");

  const useGesture = createUseGesture([scrollAction]);
  const [{ activate, parent, activated,expand,expanded }, dispatch] = useModalState();
  const [scroll, setScroll] = useState();
  useEffect(() => {
    if(expand || expanded) return
    dispatch({ type: "set enabled", enabled: !scroll });
  }, [dispatch, expand, expanded, scroll]);
  useGesture(
    {
      onScrollStart: (state) => {
        setScroll(state.scrolling);
      },
      onScrollEnd: (state) => {
        setScroll(false);
      },
    },
    {
      target: window,
      eventOptions: { passive: true },
    }
  );

  return (
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
      <Landing />

      <Section query={"POPULAR"} title={"Popular"} />
      <Section query={"UPCOMING"} title={"Upcoming"} />
      <Section query={"PLAYING"} title={"Playing Now"} />
      <Epic genre={"Drama"} />
    </div>
  );
}

const Index = () => {
  let location = useLocation();
  let state = location?.state;

  const browse = useMatch("/browse");

  const bg = state?.backgroundState || location;

  const transitions = useTransition(bg, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },

    delay: 200,
  });
  return (
    <AppProvider>
      <ModalProvider>
        <Routes location={bg}>
          <Route path="/">
            <Route index element={<Navigate to="/browse" />} />
            <Route path="browse">
              <Route index element={<App />} />
            </Route>

            <Route path="watch">
              <Route path=":id" element={<Watch />} />
            </Route>

            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        </Routes>

        {browse && (
          <Routes>
            <Route path="/browse" element={<Modal />} />
          </Routes>
        )}
      </ModalProvider>
    </AppProvider>
  );
};

export default Index;
