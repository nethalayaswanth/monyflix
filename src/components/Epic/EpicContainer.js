import React, {
  useCallback, useMemo, useState
} from "react";

import { useInView } from "react-intersection-observer";
import { useModalState } from "../../contexts/modalContext";
import useMedia from "../../hooks/useMedia";
import { useMoviesByGenre } from "../../requests/requests";
import AudioControls from "../AudioControls";

import Carousel from "../Carousel";
import ProgressiveImage from "../cachedImage";
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
  } = useMoviesByGenre({ genres, withLandscapePosterPath:true });

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

  

  return (
    <Container >
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
      <CarouselWrapper
        style={{
          zIndex: 8,
        }}
      >
        {/* {movies[state.id] && (
          <Details>
            <Description movie={movies[state.id]} genre={header} />
            {show && <AudioControls cb={handleAudio} audio={audio} />}
          </Details>
        )} */}
        <Carousel
          dark={true}
          data={movies}
          loading={isLoading}
          hasMore={hasNextPage}
          isFetching={isFetchingNextPage}
          fetchMore={fetchNextPage}
          style={{ margin: 0 }}
          card="landscape"
          breakPointValues={[3,4,5,6,7,8,9]}
          onSlideChange={onSlideChange}
          endPadding={true}
        />
      </CarouselWrapper>

      <Gradient />

      {id && (
        <div className="absolute" style={{background:'rgba(0,0,0,0.8)'}}>
         
         
              <Youtube
                id={id}
                play={!play}
                
                audio={audio}
              
              />
          
           
        </div>
      )}
    </Container>
  );
}
