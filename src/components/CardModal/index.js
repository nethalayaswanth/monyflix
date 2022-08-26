import React, {
  forwardRef, useCallback, useLayoutEffect, useMemo, useState
} from "react";
import { useQueryClient } from "react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AspectBox from "../AspectBox";
   
import { useModalState } from "../../contexts/modalContext";
import {
  useGetRecommendedMovies, useGetSimilarMovies, useGetVideosById, useMovieDetails
} from "../../requests/requests";
import ExpandSlide from "../ExpandCard/expandSlide";
import ModalSection from "../ModalSection";
import Youtube from "../Youtube";
import {
  Adult, Button, Close, Content, Description, Divider, Genres, Header, Image, InlineFlex, Item, ModalWrapper, Open, Overview, Spacer, Title, Up
} from "./styles";

import { animated, useSpring } from "react-spring";

import useMedia from "../../hooks/useMedia";
import AudioControls from "../AudioControls";
import Video from "../CroppedVideo";
import DetailsCard from "../DetailsCard";
import ProgressiveImage from "../ProgressiveImage";
import Section from "../Section/DetailsSection";
import timeConversion from "./utils";
import { useInView } from "react-intersection-observer";
const CardModal = forwardRef(({ style, width,}, ref) => {
  const [
    {
      movie,
      param,
      activate,
      activated,
      miniExpand,
      miniExpanded,
      expand,
      expanded,
    },
    dispatch,
  ] = useModalState();

  const {
    data: movieDetails,
    isLoading: movieDetailsLoading,
    refetch: movieDetailsRefetch,
    status: movieDetailStatus,
    error,
  } = useMovieDetails({ id: movie?.id || param });

  const queryClient = useQueryClient();

  const {
    data,

    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useGetSimilarMovies({ id: movie?.id || param });

  const recommendedMovies= useGetRecommendedMovies({ id: movie?.id || param });
  

  const movies = useMemo(() => {
    if (data) {
      var list = [];

      data.pages.forEach(({ similarMovies: { data } }, i) => {
        list = [...list, ...data];
      });

      return list;
    }
    return [];
  }, [data]);

  const recommendedmovies = useMemo(() => {
    const data = recommendedMovies?.data;
    if (data) {
      var list = [];

      data.pages.forEach(({ recommendedMovies: { data } }, i) => {
        list = [...list, ...data];
      });

      return list;
    }
    return [];
  }, [recommendedMovies?.data]);
  let [searchParams, setSearchParams] = useSearchParams();

  let location = useLocation();
  let navigate = useNavigate();

  const handleExpand = useCallback(
    (e) => {
      e.stopPropagation();
      setSearchParams(
        { mv: movie?.id },
        {
          state: { backgroundLocation: location, miniModal: true },
        }
      );
    },
    [location, movie, setSearchParams]
  );

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      const param = searchParams.get("mv");

      if (param) {
        searchParams.delete("mv");
        setSearchParams(searchParams);
      }
    },
    [searchParams, setSearchParams]
  );

  const {
    isLoading,
    error: videoError,
    data: videoData,
    isFetching: videoFetching,
  } = useGetVideosById({
    id: movie?.id || param,
    types: ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"],
  });

  const id = useMemo(() => {
    
    if (!movieDetails) return null;
    const videos = movieDetails.movie.videos;
    if (!videos) return null;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [movieDetails]);

  const current = movieDetails?.movie || movie;
  const year = current?.releaseDate.split("-")[0];
  const genres = movieDetails?.movie.genres;
  const runTime = movieDetails?.movie.runtime;




  const posterPath = current
    ? `https://image.tmdb.org/t/p/original/${current?.posterPath}`
    : null;
  const placeholderPoster = movie
    ? `https://image.tmdb.org/t/p/w500/${current?.posterPath}`
    : null;
  const backDropPath = current
    ? `https://image.tmdb.org/t/p/original/${current?.backdropPath}`
    : null;
  const placeHolderBackDropPath = current
    ? `https://image.tmdb.org/t/p/w300/${current?.backdropPath}`
    : null;

  const [{ opacity }, api] = useSpring(() => {
    return {
      from: {
        opacity: 1,
      },
    };
  });

  useLayoutEffect(() => {
    if (miniExpand && activate) {
      api.start({
        opacity: 0,
      });
    }
    if (!miniExpand && !activate) {
      api.start({
        opacity: 1,
      });
    }
  }, [activate, api, miniExpand]);

   const [overlay, setOverlay] = useState();

   useLayoutEffect(() => {
     let timeout;
     if (!expand || miniExpand) {
       setOverlay(expand);
       return;
     }
     timeout = setTimeout(() => {
       setOverlay(expand);
     }, 200);
     return () => {
       clearTimeout(timeout);
     };
   }, [expand, miniExpand]);

  useLayoutEffect(() => {
    if (overlay && expanded) return;
    if (!miniExpand && overlay) {
      api.start({ opacity: 0 });
    }
    if (!overlay && expanded) {
      console.log("kingis");
      api.start({
        opacity: 1,
      });
    }
  }, [api, overlay, expanded, miniExpand]);

  const handleSimilarMovieclick = useCallback(() => {
    dispatch({ type: "set reset" });
     window.scrollTo({
       top: 0,
       left: 0,
       behavior: "smooth",
     });
  }, [dispatch]);

  const device = useMedia();

  const {
    ref: elRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.95,
    rootMargin: "100px 0px 100px 0px",
  });
  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const [audio, setAudio] = useState(false);
  const [show, setShow] = useState();

  const showCb = useCallback(({ show }) => {
    setShow(show);
  }, []);

  const handleAudio = useCallback(() => {
    setAudio((x) => !x);
  }, []);

 
  return (
    <ModalWrapper
      ref={ref}
      id="card-modal"
      style={{
        backgroundColor:
          !miniExpand &&
          expand &&
          opacity.to({ range: [0.8, 0.2], output: ["transparent", "white"] }),
        ...(!expanded && { boxShadow: "unset" }),
      }}
    >
      <animated.div
        style={{
          opacity: opacity.to({
            range: [1, 0.2],
            output: [1, 0],
          }),
          width: "100%",
          height: "100%",
          ...(overlay && {
            position: "absolute",
            top: 0,
            left: 0,
          }),
        }}
      >
        <AspectBox potrait>
          <Image
            style={{ width: "100%", height: "100%", Zindex: 5 }}
            src={posterPath}
            alt={``}
          />
        </AspectBox>
      </animated.div>
      <animated.div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: opacity.to({ range: [0.8, 0.2], output: [0, 1] }),
          ...(expand && !desktop && { minHeight: "100vh" }),
          ...(!expand && { position: "absolute" }),
        }}
      >
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 2,
              aspectRatio: 19 / 10,
            }}
            ref={elRef}
          >
            <animated.div
              style={{
                width,
                aspectRatio: 19 / 10,
                maxHeight: "min(800px,100vh)",
                zIndex: 2,
                position: "absolute",
                backgroundColor: "transparent",
              }}
            >
              {id && (
                <Video show={show} crop={false}>
                  <Youtube
                    id={id}
                    light={false}
                    play={true}
                    audio={audio}
                    cb={showCb}
                    visible={inView}
                  />
                </Video>
              )}
              {
                <>
                  {(expand || expanded) && (
                    <Button onClick={handleClose}>
                      <Close style={{ fill: "white" }} />
                    </Button>
                  )}
                  {show && (
                    <Button
                      onClick={handleAudio}
                      style={{ bottom: 0, top: "auto" }}
                    >
                      <AudioControls audio={audio} />
                    </Button>
                  )}
                </>
              }
            </animated.div>
          </div>

          <div style={{ zIndex: 1, width: "100%", aspectRatio: 19 / 10 }}>
            <ProgressiveImage
              style={{
                width: "100%",
                Zindex: 5,
                position: "relative",
                aspectRatio: 19 / 10,
              }}
              src={backDropPath}
              placeholderSrc={placeHolderBackDropPath}
              alt={``}
            />
          </div>
        </>

        <animated.div
          style={{
            position: "relative",
            zIndex: 3,
            backgroundColor: "inherit",
            flex: "auto",
            opacity: opacity.to({ range: [0.6, 0.4, 0], output: [0, 1, 1] }),
          }}
        >
          {
            <>
              <Content expand={expand} style={{}}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: desktop ? "row" : "column",
                  }}
                >
                  <Description expand={expand}>
                    <Header>
                      <Title expand={expand}>{current.title}</Title>
                    </Header>
                    <InlineFlex>
                      <Item>{year}</Item>
                      {runTime && <Item>{timeConversion(runTime)}</Item>}
                      <Adult>{current.adult ? "U/A 13+" : "U/A 18+"}</Adult>
                    </InlineFlex>
                    <Overview className={expand && "expand"}>
                      {current.overview}
                    </Overview>
                    {/* <Spacer /> */}
                  </Description>
                  {genres && (expand || expanded) && (
                    <Genres>
                      <span
                        key={"genres"}
                        style={{ ...(!desktop && { fontWeight: 600 }) }}
                      >
                        Genres:
                      </span>
                      {genres.map((genre, i) => {
                        const last = i === genres.length - 1;
                        return (
                          <span key={i}>
                            {`${genre}`}
                            {!last && ","}
                          </span>
                        );
                      })}
                    </Genres>
                  )}
                </div>

                <Spacer />
                <Divider />
                {!(expand || expanded) && (
                  <>
                    <Open>
                      <Up onClick={handleExpand} />
                    </Open>
                  </>
                )}
              </Content>
              {videoData && (expand || expanded) && (
                <div style={{ flexGrow: 2, flexShrink: 0, flexBasis: "auto" }}>
                  {videoData.videosById.clip.length !== 0 && (
                    <ModalSection
                      data={videoData.videosById.clip}
                      title="Clips"
                    />
                  )}
                  {videoData.videosById.trailer.length !== 0 && (
                    <ModalSection
                      data={videoData.videosById.trailer}
                      title="Trailers"
                    />
                  )}
                  {videoData.videosById.bts.length !== 0 && (
                    <ModalSection
                      data={videoData.videosById.bts}
                      title="Behind The Scenes"
                    />
                  )}
                  {videoData.videosById.featurette.length !== 0 && (
                    <ModalSection
                      data={videoData.videosById.featurette}
                      title={"Featurette"}
                    />
                  )}
                  {videoData.videosById.bloopers.length !== 0 && (
                    <ModalSection
                      data={videoData.videosById.bloopers}
                      title="Bloopers"
                    />
                  )}
                  {!recommendedMovies.isLoading && recommendedMovies?.data && (
                    <Section
                      title="Recommended"
                      movies={recommendedmovies}
                      loading={recommendedMovies.status === "loading"}
                      hasMore={recommendedMovies.hasNextPage}
                      isFetching={recommendedMovies.isFetchingNextPage}
                      fetchMore={recommendedMovies.fetchNextPage}
                      slidesPerView={"auto"}
                    >
                      <DetailsCard onClick={handleSimilarMovieclick} />
                    </Section>
                  )}
                  {data && (
                    <ModalSection
                      title="More Like This"
                      data={movies}
                      loading={status === "loading"}
                      hasMore={hasNextPage}
                      isFetching={isFetchingNextPage}
                      fetchMore={fetchNextPage}
                    >
                      <ExpandSlide onClick={handleSimilarMovieclick} />
                    </ModalSection>
                  )}
                </div>
              )}
            </>
          }
        </animated.div>
      </animated.div>
    </ModalWrapper>
  );
});

export default CardModal;
