import { createUseGesture, scrollAction } from "@use-gesture/react";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
} from "react-router-dom";

import Epic from "./components/Epic";
import Landing from "./components/Landing";
import Modal from "./components/Modal";
import Section from "./components/Section";
import {
  DetailsSection,
  ExpandCardSection,
  LandScapeSection,
} from "./components/Section/DetailsSection";
import Watch from "./components/watch";

import { ModalProvider, useModalState } from "./contexts/modalContext";

function App() {
  

  const useGesture = createUseGesture([scrollAction]);
  const [{  expand, expanded }, dispatch] =
    useModalState();
  const [scroll, setScroll] = useState();
  useEffect(() => {
    if (expand || expanded) return;
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

      <DetailsSection genres={["Thriller"]} title={"Thrillers"} />
      <Epic genre={["Romance", "Drama"]} title={"Romance"} />
      <Section query={"PLAYING"} title={"Playing Now"} />
      <DetailsSection genres={["Music"]} title={"Music"} />
      <LandScapeSection
        genres={["ScienceFiction", "Thriller"]}
        title={"Sci-Fi"}
      />
      <ExpandCardSection genres={["Horror"]} title={"Horror"} />
      <DetailsSection
        genres={["Thriller", "Crime", "Mystery"]}
        title={"Mystery"}
      />
      <LandScapeSection
        genres={["Documentary", "Mystery"]}
        title={"Documentary"}
      />
      <ExpandCardSection genres={["Comedy", "Drama"]} title={"Comedy"} />
      <DetailsSection genres={["Drama", "Adventure"]} title={"Adventure"} />
    </div>
  );
}

const Index = () => {
  let location = useLocation();
  let state = location?.state;

  const browse = useMatch("/browse");

  const bg = state?.backgroundState || location;

  
  return (
    
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
    
  );
};

export default Index;
