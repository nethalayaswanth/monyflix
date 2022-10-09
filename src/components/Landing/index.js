import React, {
  lazy,
  Suspense, useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import useMedia from "../../hooks/useMedia";
import {
  getMovieDetails, useGetVideosById, useLatestMovie
} from "../../requests/requests";
import AudioControls from "../AudioControls";
import Video from "../CroppedVideo";


import { useModalState } from "../../contexts/modalContext";

import Description from "../Epic/description";
import { Details } from "../Epic/views";
import ProgressiveImage from "../ProgressiveImage";
import { Container, Down, Gradient, Picture, Scroll } from "./styles";


const types = ["CLIP", "TRAILER", "TEASER", "BLOOPERS", "BTS", "FEATURETTE"];

const Youtube=lazy(()=>{ return import("../Youtube")})

const Landing = ({ queryEnabled}) => {
  const movieData = useLatestMovie({ queryOptions: { enabled:!!queryEnabled } });

  const movie = movieData?.data?.latestMovie;
  const backdropPath = movie?.images?.filePath;
  const posterPath = movie?.posterPath;

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const src = desktop ? backdropPath : posterPath;

  const original = src ? `https://image.tmdb.org/t/p/original${src}` : null;
  const preview = src ? `https://image.tmdb.org/t/p/w300${src}` : null;

  const videoData = useGetVideosById({
    id: movie?.id,
    types,
    queryOptions: {
      enabled: !!movie?.id,
    },
  });

  const videos = videoData?.data?.videosById;

  const scrollRef = useRef();

  const id = useMemo(() => {
    if (!videos) return null;

    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];
    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [videos]);

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
    e.stopPropagation();
    const { bottom } = scrollRef.current.getBoundingClientRect();
    const len = Math.abs(window.scrollX - bottom);
    window.scrollBy({
      top: len,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const [{ activated, expand }, dispatch] = useModalState();

  const play = activated || expand;

  let [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();


  useEffect(() => {
    const id = movie?.id;
    if (!id) return;
    (async () => {
      await queryClient.prefetchQuery(["movie", id], async () =>
        getMovieDetails({ id: id })
      );
    })();
  }, [movie?.id, queryClient]);

  const handleClick = useCallback(() => {
    dispatch({
      type: "set modal",
      ...(!activated && { scroll: window.scrollY }),
    });

    setSearchParams({ mv: movie.id });
  }, [activated, dispatch, movie?.id, setSearchParams]);

  const [audio, setAudio] = useState(false);
  const [show, setShow] = useState();

  const showCb = useCallback(({ show }) => {
    setShow(show);
  }, []);

  const handleAudio = useCallback(() => {
    setAudio((x) => !x);
  }, []);

  return (
    <Container onClick={handleClick} ref={refcb}>
      <Picture
        style={{
          backgroundColor: "black",
          borderRadius: "initial",
          marginBottom: 0,
          zIndex: 0,
          padding: "20px",
        }}
      >
        <ProgressiveImage
          className="absolute"
          original={original}
          preview={preview}
          alt=""
        />
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
            <Suspense fallback={<div></div>}>
              <Youtube
                id={id}
                play={!play}
                light={false}
                audio={audio}
                cb={showCb}
                visible={inView}
              />
            </Suspense>
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
