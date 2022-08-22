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

import { Container,Carousel, Image, Gradient, Wrapper } from "./views";
import Card from "../Card";
import {Youtube} from "../Youtube";
import EpicCarousel from "../Carousel/EpicCarousel";
import { useEpicState } from "./context";
import AspectBox from "../AspectBox";
import Description from "./description";
import { useGetMoviesByGenre } from "../../requests/requests";
import Shimmer from "../shimmer";
import useMedia from "../../hooks/useMedia";
import { useModalState } from "../../contexts/modalContext";
export default function EpicContainer({ genre ,title:header}) {
  const [state, dispatch] = useEpicState();
  
  console.log(header);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useGetMoviesByGenre({ genres: genre });

  
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
    if(!videos) return null
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [movies, state.id]);

  const device = useMedia(
  );

  const mobile = device === "mobile";
  const desktop = device === "desktop"; 

  const [{activated,expand}]=useModalState()

  const play = activated || expand ;

  return (
    <Container>
      <div
        style={{
          borderRadius: "initial",
          width: "100%",
        }}
      >
        {backdropPath && (
          <Shimmer
            style={{ objectFit: "cover", objectPosition: "50% 0%" }}
            src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
          />
        )}
      </div>
      <Carousel
        style={{
          zIndex: 8,
        }}
      >
        {movies[state.id] && (
          <Description movie={movies[state.id]} genre={header} />
        )}
        <EpicCarousel
          epic={true}
          dark={true}
          data={movies}
          loading={status === "loading"}
          hasMore={hasNextPage}
          isFetching={isFetchingNextPage}
          fetchMore={fetchNextPage}
          style={{ margin: 0 }}
        />
      </Carousel>

      <Gradient />

      {id && state.show && (
        <div className="absolute">
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              position: "relative",
              marginTop: "-10vh",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                overflow: "hidden",
                transform: "translate(-50%,-50%)",
                height: "100%",
                ...(!desktop ? { aspectRatio: 16 / 9 } : { width: "100%" }),
              }}
            >
              <Youtube
                id={id}
                playOnMount={!play}
                light={false}
                interectionOptions={{
                  rootMargin: "200px 0px 200px 0px",
                  threshold: 0.7,
                }}
              />
            </div>
          </div>
        </div>
        // <AspectBox absolute>
        //   <Youtube id={id} light={false} playOnMount={true} />
        // </AspectBox>
      )}
    </Container>
  );
}
