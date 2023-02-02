import React, { useCallback, useMemo } from "react";

import useMedia from "../../hooks/useBreakpoint";
import { useMoviesByGenre } from "../../requests/requests";

import ProgressiveImage from "../cachedImage";
import Carousel from "../Carousel";
import { Youtube } from "../Youtube";
import { useEpicState } from "./context";
import {
  Carousel as CarouselWrapper,
  Container,
  Gradient,
  MetaWrapper,
} from "./views";

import { Details } from "../Landing/Details";
import { useDevice } from "../../contexts/deviceContext.js";

export default function EpicContainer({ genres, title: header }) {
  const [state, dispatch] = useEpicState();

  const onSlideChange = useCallback(
    ({ activeIndex }) => {
      dispatch({
        type: "set state",
        payload: {
          id: activeIndex,
        },
      });
    },
    [dispatch]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    status,
  } = useMoviesByGenre({ genres, withLandscapePosterPath: true });

  const movies = useMemo(() => {
    if (data) {
      var list = [];
      data.pages.forEach(({ data }, i) => {
        list = [...list, ...data];
      });
      return list;
    }
    return [];
  }, [data]);

  const movie = movies[state.id];
  const backdropPath = movie?.backdropPath;
  const posterPath = movie?.posterPath;
  const title = movie?.title;

  const original = backdropPath
    ? `https://image.tmdb.org/t/p/w780/${backdropPath}`
    : null;
  const preview = backdropPath
    ? `https://image.tmdb.org/t/p/w300/${backdropPath}`
    : null;

  const id = useMemo(() => {
    if (!movies[state.id]) return null;
    const videos = movies[state.id].videos;
    if (!videos) return null;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [movies, state.id]);

 
  return (
    <Container>
      <div
        style={{
          width: "100%",
          zIndex: 0,
        }}
      >
        {backdropPath && (
          <ProgressiveImage
            style={{ objectFit: "cover", objectPosition: "50% 0%" }}
            original={original}
            preview={preview}
          />
        )}
      </div>
      <MetaWrapper>
        <div className="flex-row">
          {movie && (
            <Details
              trigger={movie?.title}
              title={movie?.title}
              overview={movie?.overview}
            />
          )}
          {id && <Youtube id={id} play={true} audio={true} />}
        </div>
      </MetaWrapper>
      <CarouselWrapper
        style={{
          zIndex: 10,
        }}
      >
        <Carousel
          dark={true}
          data={movies}
          loading={isLoading}
          hasMore={hasNextPage}
          isFetching={isFetchingNextPage}
          fetchMore={fetchNextPage}
          style={{ margin: 0 }}
          card="epic"
          cardHover={false}
          onSlideChange={onSlideChange}
          endPadding={true}
        />
      </CarouselWrapper>
      <Gradient />
    </Container>
  );
}
