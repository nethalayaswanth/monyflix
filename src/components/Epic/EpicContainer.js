import React, {
  useRef,
  useState,
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { Container, Image, Gradient, Wrapper } from "./views";
import Card from "../Card";
import Youtube from "../Youtube";
import EpicCarousel from "../Carousel/EpicCarousel";
import { useEpicState } from "./context";
import AspectBox from "../AspectBox";
import Description from "./description";
import { useGetMoviesByGenre } from "../../requests/requests";


export default function EpicContainer({ genre }) {
  const [state, dispatch] = useEpicState();
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useGetMoviesByGenre({ genres: [genre] });

  
  const movies = useMemo(() => {
    if (data) {
      var list = [];

      data.pages.forEach(({ MovieGenre: { data } }, i) => {
        list = [...list, ...data];
      });

      return list;
    }
    return [];
  }, [data]);

  const backdropPath = movies[state.id]?.backdropPath;
const posterPath = movies[state.id]?.posterPath;
const title= movies[state.id]?.title

  const id = useMemo(() => {
    if (!movies[state.id]) return null;
    const videos = movies[state.id].videos;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [movies, state.id]);
  return (
    <Container>
      <Wrapper>
        <AspectBox
          style={{
            backgroundColor: "black",
            borderRadius: "initial",
            marginBottom: "80px",
          }}
          epic={true}
        >
          {backdropPath && (
            <Image
              src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
            />
          )}
        </AspectBox>

        <EpicCarousel
          epic={true}
          dark={true}
          style={{
            bottom: "-20px",
            position: "absolute",
            zIndex: 8,
            width: "100%",
          }}
          data={movies}
          loading={status === "loading"}
          hasMore={hasNextPage}
          isFetching={isFetchingNextPage}
          fetchMore={fetchNextPage}
        />
      </Wrapper>
      <AspectBox style={{zIndex:3}} absolute>
        <Gradient />
      </AspectBox>
      {movies[state.id] && (
        <Description movie={movies[state.id]} genre={genre} />
      )}
      {id && state.show && (
        <AspectBox absolute>
          <Youtube id={id} light={false} playOnMount={true} />
        </AspectBox>
      )}
    </Container>
  );
}
