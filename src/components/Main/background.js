import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Epic from "../Epic";

import Landing from "../Landing";
import Modal from "../Modal";
import { Section } from "../Section";
import { FullLoader, Loader } from "../spinner";

import { useInView } from "react-intersection-observer";
import { useIsFetching } from "react-query";
import { ParamProvider, useParamState } from "../../contexts/paramContext";
import usePrevious from "../../hooks/usePrevious";
import { getGenreIds } from "../../requests/requests";

export default function Background() {
  const [searchParams, setSearchParams] = useParamState();

  const param = searchParams.get("mv");

  const isFetchingMovie = useIsFetching(["movie", param]);
  const isFetchingMovieVideos = useIsFetching(["videos", param]);

  const fetchingParamMovieData = isFetchingMovie || isFetchingMovieVideos;

  const paramMovieDataFetched = usePrevious(fetchingParamMovieData);

  const queryEnabled = paramMovieDataFetched || !param;

  const [loaderCount, setLoaderCount] = useState(0);

  const { ref: inViewRef } = useInView({
    threshold: 0.5,
    onChange: (inview) => {
      if (inview) {
        setLoaderCount((c) => c + 1);
      }
    },
  });



  return (
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
    
          <Epic
            genres={getGenreIds(["Romance", "Drama"])}
            title={"Love & Romance"}
          />
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
            variables={getGenreIds(["Comedy"])}
            title={"Comedy"}
            whileInView
          />
          <Section
            query="moviesByGenre"
            queryEnabled={queryEnabled}
            variables={getGenreIds(["Family"])}
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
            variables={getGenreIds(["Action", "Comedy"])}
            title={"sci-fi"}
            card="landscape"
            whileInView
            titleCard
          />
          <Section
            query="moviesByGenre"
            queryEnabled={queryEnabled}
            variables={getGenreIds(["Action"])}
            title={"Action"}
            whileInView
          />
          <Section
            query="moviesByGenre"
            queryEnabled={queryEnabled}
            variables={getGenreIds(["Adventure", "Comedy"])}
            title={"Adventure"}
            whileInView
            card={"detail"}
          />
        </>
      )}
      {loaderCount >= 3 && (
        <>
    
          <Epic genres={getGenreIds(["Epic"])} title={"Thrillers"} />
          <Section
            query="moviesByGenre"
            queryEnabled={queryEnabled}
            variables={getGenreIds(["Horror"]) }
            title={"Horror"}
            whileInView
          />
          <Section
            query="moviesByGenre"
            queryEnabled={queryEnabled}
            variables={getGenreIds(["Mystery", "Crime", "Thriller"])}
            title={"Mystery"}
            whileInView
            card={"landscape"}
          />
        </>
      )}
      {loaderCount >= 3 && (
        <>
       
          <Section
            query="moviesByGenre"
            queryEnabled={queryEnabled}
            variables={getGenreIds( ["History", "War"] )}
            title={"History"}
            whileInView
          />
          <Section
            query="moviesByGenre"
            queryEnabled={queryEnabled}
            variables={getGenreIds( ["Documentary"] )}
            title={"Documentary"}
            whileInView
            card={"detail"}
          />
        </>
      )}
      {loaderCount < 3 && <Loader ref={inViewRef} />}
    </>
  );
}
