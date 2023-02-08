import { useRef, useState } from "react";

import Epic from "../Epic";

import Landing from "../Landing";
import { Section } from "../Section";
import { Loader } from "../spinner";

import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { useScrollPosition } from "../../hooks/useScrollPosition";

const Container = styled.div`
  margin-top: calc(-1 * var(--nav-height));
`;

export default function Background() {
  // const [searchParams, setSearchParams] = useParamState();

  // const param = searchParams.get("mv");

  // const isFetchingMovie = useIsFetching(["movie", param]);
  // const isFetchingMovieVideos = useIsFetching(["videos", param]);

  // const fetchingParamMovieData = isFetchingMovie || isFetchingMovieVideos;

  // const paramMovieDataFetched = usePrevious(fetchingParamMovieData);

  // const queryEnabled = !fetchingParamMovieData ;

  const [loaderCount, setLoaderCount] = useState(0);

  const { ref: inViewRef } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 350px 0px",
    onChange: (inview) => {
      if (inview) {
        setLoaderCount((c) => c + 1);
      }
    },
  });

  const containerRef = useRef();
  useScrollPosition({
    onScrollChange: ({ prevPos, currPos, scrolling }) => {
      const container = containerRef.current.style;

      container.pointerEvents = scrolling ? "none" : "auto";
    },
  });

  return (
    <Container ref={containerRef}>
      <Landing />
      <Section query="trendingMovies" title={"Trending"} />
      <Section title={"Popular"} variables={{ type: "Popular" }} />
      <Section
        title={"Upcoming"}
        card={"detail"}
        variables={{ type: "Upcoming", titlePoster: true }}
      />

      {loaderCount >= 1 && (
        <>
          <Epic
            variables={{ genres: ["Romance"],adult:false }}
            title={"Love & Romance"}
          />
          <Section variables={{ genres: ["Drama"] }} title={"Drama"} />
          <Section variables={{ genres: ["Adventure"] }} title={"Adventure"} />
          <Section
            variables={{ genres: ["Action"], titlePoster: true }}
            title={"Action"}
            card={"detail"}
          />
        </>
      )}
      {loaderCount >= 2 && (
        <>
          <Section
            variables={{ genres: ["ScienceFiction"], titlePoster: true }}
            title={"Sci-Fi"}
            key={"Sci-Fi"}
            card="landscape"
            cardHover={false}
          />
          <Section
            variables={{ genres: ["Comedy"] }}
            title={"Comedy"}
            key={"comedy"}
          />
          <Section
            variables={{ genres: ["Family"], titlePoster: true }}
            title={"Family"}
            key={"family"}
            card={"detail"}
          />
        </>
      )}
      {loaderCount >= 3 && (
        <>
          <Epic
            key={"thrillers"}
            variables={{ genres: ["Thrillers"] }}
            title={"Thrillers"}
          />
          <Section
            variables={{ genres: ["Horror"] }}
            title={"Horror"}
            key={"horror"}
          />
          <Section
            variables={{
              genres: ["Mystery", "Crime", "Thriller"],
              titlePoster: true,
            }}
            title={"Mystery"}
            card={"landscape"}
            key={"mystery"}
            cardHover={false}
          />
        </>
      )}
      {loaderCount >= 4 && (
        <>
          <Section
            title={"Top Rated"}
            key={"Top Rated"}
            variables={{ type: "Top Rated", sortBy: "Rating" }}
          />
          <Section
            variables={{ genres: ["History", "War"] }}
            title={"History"}
            key={"history"}
          />
          <Section
            variables={{ genres: ["Documentary"], titlePoster: true }}
            title={"Documentary"}
            card={"detail"}
            key={"documentary"}
          />
        </>
      )}
      {loaderCount < 5 && <Loader ref={inViewRef} />}
    </Container>
  );
}
