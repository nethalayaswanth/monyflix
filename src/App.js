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
import { Loader } from "./components/spinner";

import Spinner from "./components/spinner";

import { useInView } from "react-intersection-observer";
import { useIsFetching } from "react-query";
import { ModalProvider, useModalState } from "./contexts/modalContext";
import useMedia from "./hooks/useMedia";
import usePrevious from "./hooks/usePrevious";

const Watch = lazy(() => import("./components/watch"));

function App() {
  const useGesture = createUseGesture([scrollAction]);
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  const isFetchingMovie = useIsFetching(["movie", param]);
  const isFetchingMovieVideos = useIsFetching(["videos", param]);

  const fetchingParamMovieData = isFetchingMovie || isFetchingMovieVideos;

  const [paramMovieDataFetched] = usePrevious(fetchingParamMovieData);
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

  const [
    {
      expand,

      expanded,
    },
    dispatch,
  ] = useModalState();

  const device = useMedia();

  const mobile = device === "mobile";

  const [scroll, setScroll] = useState();

  useEffect(() => {
    if (expand || expanded || mobile ) return;
    dispatch({ type: "set enabled", enabled: !scroll });
  }, [dispatch, expand, expanded, mobile, scroll]);

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
          breakPointValues={[6, 6, 4, 3, 1.5, 1.5]}
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
              whileInView={true}
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Comedy"] }}
              title={"Comedy"}
              whileInView={true}
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Family"] }}
              title={"Family"}
              whileInView={true}
              card={"detail"}
              breakPointValues={[6, 6, 4, 3, 1.5, 1.5]}
            />
          </>
        )}
        {loaderCount >= 2 && (
          <>
            {" "}
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["ScienceFiction", "Thriller"] }}
              title={"Sci-Fi"}
              card="landscape"
              breakPointValues={[1]}
              defaultBreakPointValue={1}
              whileInView={true}
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Action"] }}
              title={"Action"}
              whileInView={true}
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Adventure", "Action"] }}
              title={"Adventure"}
              whileInView={true}
              card={"detail"}
              breakPointValues={[6, 6, 4, 3, 1.5, 1.5]}
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
              whileInView={true}
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Mystery", "Crime", "Thriller"] }}
              title={"Mystery"}
              whileInView={true}
              breakPointValues={[1]}
              defaultBreakPointValue={1}
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
              whileInView={true}
            />
            <Section
              query="moviesByGenre"
              queryEnabled={queryEnabled}
              variables={{ genres: ["Documentary"] }}
              title={"Documentary"}
              whileInView={true}
              card={"detail"}
              breakPointValues={[6, 6, 4, 3, 1.5, 1.5]}
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

  const browse = useMatch("/browse");

  const bg = state?.backgroundState || location;

  return (
    <ModalProvider>
      <Suspense fallback={<Spinner />}>
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
