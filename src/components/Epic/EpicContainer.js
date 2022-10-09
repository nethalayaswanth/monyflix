import React, {
  useCallback, useMemo, useState
} from "react";

import { useInView } from "react-intersection-observer";
import { useModalState } from "../../contexts/modalContext";
import useMedia from "../../hooks/useMedia";
import { useMoviesByGenre } from "../../requests/requests";
import AudioControls from "../AudioControls";

import Carousel from "../Carousel";
import ProgressiveImage from "../ProgressiveImage";
import { Youtube } from "../Youtube";
import { useEpicState } from "./context";
import Description from "./description";
import {
  Carousel as CarouselWrapper,
  Container,
  Details,
  Gradient
} from "./views";
import Video from "../CroppedVideo";

export default function EpicContainer({ genres, title: header }) {
  const [state, dispatch] = useEpicState();

  

  const onSlideChange = useCallback(({activeIndex}) => {

    console.log(activeIndex);
    
    dispatch({
      type: "set state",
      payload: {
        id: activeIndex,
      },
    });
  }, [dispatch]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    status,
  } = useMoviesByGenre({ genres });

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
  const title = movies[state.id]?.title;

  
  console.log(movies[state.id]);
   const original = backdropPath
     ? `https://image.tmdb.org/t/p/original/${backdropPath}`
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

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const [{ activated, expand }] = useModalState();

  const play = activated || expand;

  const [audio, setAudio] = useState(false);
  const [show, setShow] = useState();

  const showCb = useCallback(({ show }) => {
    setShow(show);
  }, []);

  const handleAudio = useCallback(() => {
    setAudio((x) => !x);
  }, []);

  const {
    ref: elRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.7,
  });

  return (
    <Container ref={elRef}>
      <div
        style={{
          borderRadius: "initial",
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
      <CarouselWrapper
        style={{
          zIndex: 8,
        }}
      >
        {movies[state.id] && (
          <Details>
            <Description movie={movies[state.id]} genre={header} />
            {show && <AudioControls cb={handleAudio} audio={audio} />}
          </Details>
        )}
        <Carousel
          dark={true}
          data={movies}
          loading={isLoading}
          hasMore={hasNextPage}
          isFetching={isFetchingNextPage}
          fetchMore={fetchNextPage}
          style={{ margin: 0 }}
          card="card"
          breakPointValues={[9, 8, 7, 6, 4, 3]}
          onSlideChange={onSlideChange}
          centerSlides={true}
          endPadding={true}
        />
      </CarouselWrapper>

      <Gradient />

      {id && (
        <div className="absolute" style={{background:'rgba(0,0,0,0.8)'}}>
         
            <Video style={{height:'90%'}}>
              <Youtube
                id={id}
                play={!play}
                light={false}
                interectionOptions={{
                  rootMargin: "200px 0px 200px 0px",
                  threshold: 0.7,
                }}
                audio={audio}
                cb={showCb}
                visible={inView}
              />
              </Video>
           
        </div>
      )}
    </Container>
  );
}
