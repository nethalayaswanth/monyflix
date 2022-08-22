import React, {
  useRef,
  useState,
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { gql, useQuery } from "@apollo/client";

import { useGetLatestMovie } from "../../requests/requests";
import styled, { css } from "styled-components";
import AspectBox from "../AspectBox";
import Card from "../Card";
import Youtube from "../Youtube";

import {
  Container,
  Picture,
  Wrapper,
  Gradient,
  TopGradient,Scroll,
  Down,
} from "./styles";
import Shimmer from "../shimmer";

const Landing = () => {
  const { data, loading, error } = useGetLatestMovie();

  const scrollRef = useRef();

  // const movie = useMemo(() => {

  //   return { movie, backdropPath };
  // }, [data]);

  const movie = data?.latestMovie;
  const backdropPath = movie?.backdropPath;
  const posterPath = movie?.posterPath;

  const id = useMemo(() => {
    if (!data) return null;
    const videos = data.latestMovie.videos;
    if (!videos) return null;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [data]);

  const handleClick = useCallback(() => {
    const len = Math.abs(window.scrollX - scrollRef.current.scrollHeight);
    window.scrollBy({
      top: len,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Container ref={scrollRef}>
      <Picture
        style={{
          backgroundColor: "black",
          borderRadius: "initial",
          marginBottom: 0,
          zIndex: 0,
          padding: "20px",
        }}
        epic={true}
      >
        {
          <picture>
            <source
              srcSet={`https://image.tmdb.org/t/p/original/${posterPath}`}
              media="(max-width:739px)"
            />
            <source
              srcSet={`https://image.tmdb.org/t/p/original/${backdropPath}`}
              media="(min-width:740px)"
            />
            <img
              className="absolute"
              style={{ objectFit: "contain" }}
              src={`https://image.tmdb.org/t/p/original/${posterPath}`}
              alt=""
            />
          </picture>
        }
      </Picture>

      <div className="absolute">
        <Gradient />
        <TopGradient/>
      </div>
      {id && (
        <div className="absolute">
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              position: "relative",
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
                aspectRatio: 16 / 9,
              }}
            >
              <Youtube
                id={id}
                playOnMount
                light={false}
                interectionOptions={{
                  rootMargin: "0px 0px 0px 0px",
                  threshold: 0.9,
                }}
              />
            </div>
          </div>
        </div>
      )}
      <Scroll onClick={handleClick}>
        <Down />
      </Scroll>
    </Container>
  );
};

export default Landing;
