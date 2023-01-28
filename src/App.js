import { createUseGesture, scrollAction } from "@use-gesture/react";
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
  useSearchParams
} from "react-router-dom";

import Epic from "./components/Epic";
import Landing from "./components/Landing";
import Modal from "./components/Modal";
import { Section } from "./components/Section";
import { Loader, FullLoader } from "./components/spinner";

import Spinner from "./components/spinner";

import { useInView } from "react-intersection-observer";
import { useIsFetching } from "react-query";
import { ModalProvider, useModalState } from "./contexts/modalContext";
import useMedia from "./hooks/useMedia";
import usePrevious from "./hooks/usePrevious";
import { TrailSection } from "./components/Section/trail";
import { useScroll } from "./hooks/useScroll";

const Watch = lazy(() => import("./components/watch"));

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  const isFetchingMovie = useIsFetching(["movie", param]);
  const isFetchingMovieVideos = useIsFetching(["videos", param]);

  const fetchingParamMovieData = isFetchingMovie || isFetchingMovieVideos;

  const paramMovieDataFetched = usePrevious(fetchingParamMovieData);
  
  const queryEnabled = paramMovieDataFetched || !param;

  const {
    ref: inViewRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.5,
  });

  const [loaderCount, setLoaderCount] = useState(0);
  useLayoutEffect(() => {
    if (inView) {
      setLoaderCount((c) => c + 1);
    }
  }, [inView]);


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
      <>
        <Landing queryEnabled={queryEnabled} />
        <Section
          query="trendingMovies"
          queryEnabled={queryEnabled}
          title={"Trending"}
        />
        <Section
          query="moviesByType"
          queryEnabled={queryEnabled}
          title={"Popular"}
          variables={{ type: "POPULAR" }}
        />
        <Section
          query="moviesByType"
          queryEnabled={queryEnabled}
          title={"Upcoming"}
          card={"detail"}
          variables={{ type: "UPCOMING" }}
        />

        {loaderCount >= 1 && (
          <>
            <Epic genres={["Romance", "Drama"]} title={"Love & Romance"} />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Drama"] }}
              title={"Drama"}
              whileInView
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Comedy"] }}
              title={"Comedy"}
              whileInView
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Family"] }}
              title={"Family"}
              whileInView
              card={"detail"}
            />
          </>
        )}
        {loaderCount >= 2 && (
          <>
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Action",'Comedy'] }}
              title={"sci-fi"}
              card="landscape"
              whileInView
              titleCard
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Action"] }}
              title={"Action"}
              whileInView
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Adventure", "Action"] }}
              title={"Adventure"}
              whileInView
              card={"detail"}
            />
          </>
        )}
        {loaderCount >= 3 && (
          <>
            {" "}
            <Epic genres={["Thriller"]} title={"Thrillers"} />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Horror"] }}
              title={"Horror"}
              whileInView
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Mystery", "Crime", "Thriller"] }}
              title={"Mystery"}
              whileInView
              card={"landscape"}
            />
          </>
        )}
        {loaderCount >= 3 && (
          <>
            {" "}
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["History", "War"] }}
              title={"History"}
              whileInView
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Documentary"] }}
              title={"Documentary"}
              whileInView
              card={"detail"}
            />
          </>
        )}
        {loaderCount < 3 && <Loader ref={inViewRef} />}
      </>
    </div>
  );
}

const Index = () => {
  let location = useLocation();
  let state = location?.state;

  const bg = state?.backgroundState || location;

  return (
    <ModalProvider>
      <Suspense fallback={<FullLoader />}>
        <Routes>
          <Route path="/browse" element={<Modal />} />
        </Routes>

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
      </Suspense>
    </ModalProvider>
  );
};

export default Index;
