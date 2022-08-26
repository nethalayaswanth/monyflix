import React, {
  forwardRef, useCallback, useMemo, useState
} from "react";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import AspectBox from "../AspectBox";

import { useModalState } from "../../contexts/modalContext";
import {
  useGetRecommendedMovies,
  useGetSimilarMovies,
  useGetVideosById,
  useMovieDetails,
} from "../../requests/requests";
import ExpandSlide from "../ExpandCard/expandSlide";
import ModalSection from "../ModalSection";
import Youtube from "../Youtube";
import {
  Adult,
  Button,
  Close,
  Content,
  Description,
  Divider,
  Genres,
  Header,
  InlineFlex,
  Item,
  ModalWrapper,
  Overview,
  Spacer,
  Title,
  Tagline,
} from "./styles";

import { useInView } from "react-intersection-observer";
import { animated } from "react-spring";
import useMedia from "../../hooks/useMedia";
import AudioControls from "../AudioControls";
import Video from "../CroppedVideo";
import DetailsCard from "../DetailsCard";
import ProgressiveImage from "../ProgressiveImage";
import Section from "../Section/DetailsSection";
import timeConversion from "./utils";
const ParamCardModal = forwardRef(({ style, width }, ref) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [
    {
      movie,
      activate,
      activated,
      miniExpand,
      miniExpanded,
      param,
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
  } = useGetSimilarMovies({ id: param });
  const recommendedMovies = useGetRecommendedMovies({ id: param });
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

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch({ type: "set expand", expand: false });
    },
    [dispatch]
  );

  const {
    isLoading,
    error: videoError,
    data: videoData,
    isFetching: videoFetching,
  } = useGetVideosById({
    id: param,
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

  const current = movieDetails?.movie;
  const year = current?.releaseDate.split("-")[0];
  const genres = movieDetails?.movie.genres;
  const runTime = movieDetails?.movie.runtime;

   
   const backDropPath = current?.backdropPath;

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const {
    ref: elRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.95,
    rootMargin: "100px 0px 100px 0px",
  });
  const [audio, setAudio] = useState(false);
  const [show, setShow] = useState();

  const showCb = useCallback(({ show }) => {
    setShow(show);
  }, []);

  const handleAudio = useCallback(() => {
    setAudio((x) => !x);
  }, []);

  const handleSimilarMovieclick = useCallback(() => {
    dispatch({ type: "set reset" });
    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: "smooth",
    // });
  }, [dispatch]);

  
  return (
    <ModalWrapper ref={ref} id="card-param-modal">
      <animated.div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
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
              height: "auto",
              aspectRatio: 16 / 9,
            }}
            ref={elRef}
          >
            <animated.div
              style={{ width, position: "relative", height: "100%" }}
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
                  <Button onClick={handleClose}>
                    <Close style={{ fill: "white" }} />
                  </Button>
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
          <AspectBox style={{ zIndex: 1 }}>
            <ProgressiveImage
              style={{ width: "100%", height: "100%", Zindex: 5 }}
              src={backDropPath}
              alt={``}
            />
          </AspectBox>
        </>

        <div
          style={{
            position: "relative",
            zIndex: 3,
            backgroundColor: "inherit",
            flex: "auto",
          }}
        >
          {
            <>
              {
                <Content expand={expand}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: desktop ? "row" : "column",
                    }}
                  >
                    <Description expand={expand}>
                      <Header>
                        <Title>{current?.title}</Title>
                      </Header>
                      <InlineFlex>
                        <Item>{year}</Item>
                        {runTime && <Item>{timeConversion(runTime)}</Item>}
                        <Adult>{current?.adult ? "U/A 13+" : "U/A 18+"}</Adult>
                      </InlineFlex>
                      {/* <Spacer /> */}
                      <Overview className={expand && "expand"}>
                        {current?.overview}
                      </Overview>
                      {(expand|| expanded )&& current?.tagline && <Tagline>{`"${current?.tagline}"`}</Tagline>}
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
                  <Divider />
                  <Spacer />
                </Content>
              }
              {(expand || expanded) && (
                <div style={{ flexGrow: 2, flexShrink: 0, flexBasis: "auto" }}>
                  <>
                    {videoData && videoData?.videosById && (
                      <>
                        {videoData.videosById.clip.length !== 0 && (
                          <ModalSection
                            data={videoData.videosById.clip}
                            title="Clips"
                          />
                        )}
                        {videoData.videosById?.trailer.length !== 0 && (
                          <ModalSection
                            data={videoData.videosById.trailer}
                            title="Trailers"
                          />
                        )}
                        {videoData.videosById?.bts.length !== 0 && (
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
                        )}{" "}
                      </>
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
                        enabled={true}
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
                        <ExpandSlide />
                      </ModalSection>
                    )}
                  </>
                </div>
              )}
            </>
          }
        </div>
      </animated.div>
    </ModalWrapper>
  );
});

export default ParamCardModal;
