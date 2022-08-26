import React, {
  useCallback, useMemo, useRef,
  useState
} from "react";

import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getMovieDetails, getVideosById, useGetLatestMovie } from "../../requests/requests";
import AudioControls from "../AudioControls";
import Video from "../CroppedVideo";
import { Youtube } from "../Youtube";

import { useModalState } from "../../contexts/modalContext";
import useMedia from "../../hooks/useMedia";
import Description from "../Epic/description";
import { Details } from "../Epic/views";
import {
  Container, Down, Gradient, Picture, Scroll
} from "./styles";

const Landing = () => {
  const { data, loading, error } = useGetLatestMovie();

  const scrollRef = useRef();

     

     
     

  const movie = data?.latestMovie;
  const backdropPath = movie?.images?.filePath;
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


    const { ref, inView, entry } = useInView({
      threshold: 0.95,
    });

  const refcb = useCallback(
    (node) => {
      scrollRef.current = node;
      if (typeof ref === "function") {
        ref(node);
        return;
      }
      if (ref && ref.current) {
        ref.current = node;
      }
      
    },
    [ref]
  );

  const handleScroll = useCallback((e) => {
    e.stopPropagation()
    const { bottom } = scrollRef.current.getBoundingClientRect();
    const len = Math.abs(window.scrollX - bottom);
    window.scrollBy({
      top: len,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  

  const device = useMedia( );

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const [{ activated, expand },dispatch] = useModalState();

  const play = activated || expand;

 

  let [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const handlePrefetch = useCallback(async () => {
    const types = ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"];
    const id = movie?.id;
    await queryClient.prefetchQuery(["movie", id], async () =>
      getMovieDetails({ id: id })
    );
    await queryClient.prefetchQuery(["videos", id, types], async () =>
      getVideosById({ id: id, types })
    );
  }, [movie, queryClient]);

  const handleClick = useCallback(() => {
    dispatch({
      type: "set modal",
      ...(!activated && { scroll: window.scrollY }),
    });
    handlePrefetch();
    setSearchParams({ mv: movie.id });
  }, [movie, handlePrefetch, setSearchParams]);

  
     
  const [audio, setAudio] = useState(false);
  const [show, setShow] = useState();

  const showCb = useCallback(({ show }) => {
    setShow(show);
  }, []);

  const handleAudio = useCallback(() => {
    setAudio((x) => !x);
  }, []);


  return (
    <Container onClick={handleClick}  ref={refcb}>
      <Picture
        style={{
          backgroundColor: "black",
          borderRadius: "initial",
          marginBottom: 0,
          zIndex: 0,
          padding: "20px",
        }}
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
              src={`https://image.tmdb.org/t/p/original/${posterPath}`}
              alt=""
            />
          </picture>
        }
      </Picture>

      <div
        style={{
          zIndex: 5,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
        className="absolute"
      >
        <Gradient style={{ zIndex: 1 }} />

        {(show || desktop) && (
          <Details style={{ zIndex: 2, height: "18vw", paddingBottom: "10vh" }}>
            <Description movie={movie} />
            {show && <AudioControls cb={handleAudio} audio={audio} />}
          </Details>
        )}
      </div>
      {id && (
        <div
          style={{
            width: "100%",
            height: "100%",
            aspectRatio: "19/10",
            maxHeight: "800px",
            zIndex: 2,
            position: "absolute",
            backgroundColor: "transparent",
          }}
        >
          <Video show={show}>
            {" "}
            <Youtube
              id={id}
              play={!play}
              light={false}
              audio={audio}
              cb={showCb}
              visible={inView}
            />
          </Video>
        </div>
      )}

      <Scroll onClick={handleScroll}>
        <Down />
      </Scroll>
    </Container>
  );
};

export default Landing;
