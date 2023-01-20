import React, {
  forwardRef, lazy,
  Suspense, useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AspectBox from "../AspectBox";

import { useModalState } from "../../contexts/modalContext";
import {
  useGetRecommendedMovies,
  useGetSimilarMovies,
  useGetVideosById,
  useMovieDetails
} from "../../requests/requests";


import Section from "../Section";

import {
  Adult,
  Button,
  Close, Content,
  Description,
  Divider,
  Genres,
  Header, InlineFlex,
  Item,
  ModalWrapper,
  Open,
  Overview,
  Spacer, Tagline, Title,
  Up
} from "./styles";

import { animated } from "react-spring";

import useMedia from "../../hooks/useMedia";
import AudioControls from "../AudioControls";
import Video from "../CroppedVideo";

import { useInView } from "react-intersection-observer";
import ProgressiveImage from "../ProgressiveImage";
import timeConversion from "./utils";

const Youtube = lazy(() => {
  return import("../Youtube");
});
const CardModal = forwardRef(
  ({ style, width, fade, progress, minifade }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const param = searchParams.get("mv");

    const [currentMovieId, setCurrentMovieId] = useState(param);

    const [
      {
        movie,
        scroll,
        activate,
        activated,
        miniExpand,
        miniExpanded,
        expand,
        expanded,
        details,
      },
      dispatch,
    ] = useModalState();

    const movieId = currentMovieId || movie?.id;


  

    const {
      data: movieDetails,
      isLoading: movieDetailsLoading,
      refetch: movieDetailsRefetch,
      status: movieDetailStatus,
      isFetching,
      error,
    } = useMovieDetails({
      id: movieId,
      queryOptions: {
        enabled: !!movieId,
        keepPreviousData: true,
      },
    });

    const {
      isLoading,
      error: videoError,
      data: videoData,
      isFetching: videoFetching,
    } = useGetVideosById({
      id: movieId,
      types: ["CLIP", "TRAILER", "BLOOPERS", "TEASER", "BTS", "FEATURETTE"],
      queryOptions: {
        enabled: !!movieId,
        keepPreviousData: true,
      },
    });

    const [renderFullList, setListRenderSize] = useState(false);

    const videos = useMemo(() => {
      const videos = videoData?.videosById;
      if (!videos) return;
      const clips = {
        data: renderFullList ? videos.clip : videos.clip.slice(0, 1),
        title: "Clips",
        breakPointValues: [3, 3, 3, 3, 3, 1],
      };
      const trailers = {
        data: renderFullList ? videos.trailer : videos.trailer.slice(0, 1),
        title: "Trailers",
        breakPointValues: [4, 4, 3, 3, 3, 2],
      };
      const teasers = {
        data: renderFullList ? videos.teaser : videos.teaser.slice(0, 1),
        title: "Teasers",
        breakPointValues: [4, 4, 3, 3, 3, 2],
      };
      const bts = {
        data: renderFullList ? videos.bts : videos.bts.slice(0, 1),
        title: "Behind The Scenes",
        breakPointValues: [4, 4, 3, 3, 3, 2],
      };
      const featurette = {
        data: renderFullList
          ? videos.featurette
          : videos.featurette.slice(0, 1),
        title: "Featurette",
        breakPointValues: [4, 4, 3, 3, 3, 2],
      };
      const bloopers = {
        data: renderFullList ? videos.bloopers : videos.bloopers.slice(0, 1),
        title: "Bloopers",
        breakPointValues: [4, 4, 3, 3, 3, 2 ],
      };

      return [clips, trailers, teasers, bts, featurette, bloopers];
    }, [renderFullList, videoData]);

    const videoId = useMemo(() => {
      if (!movieDetails) return null;
      const videos = movieDetails.movie.videos;
      if (!videos) return null;
      const clip = videos.clip[0];
      const trailer = videos.trailer[0];
      const teaser = videos.teaser[0];

      return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
    }, [movieDetails]);

    const similarMoviesQuery = useGetSimilarMovies({
      id: movieId,
      size: 4,
      queryOptions: {
        enabled: !!movieId,
        keepPreviousData: true,
      },
    });

    const recommendedMoviesQuery = useGetRecommendedMovies({
      id: movieId,
      size: 4,
      queryOptions: {
        enabled: !!movieId,
        keepPreviousData: true,
      },
    });

    const similarMovies = useMemo(() => {
      const data = similarMoviesQuery?.data;
      if (data) {
        var list = [];
        data.pages.forEach(({ similarMovies: { data } }, i) => {
          list = [...list, ...data];
        });
        if (renderFullList) return list;
        return list.slice(0, 2);
      }
      return [];
    }, [renderFullList, similarMoviesQuery?.data]);

    const recommendedMovies = useMemo(() => {
      const data = recommendedMoviesQuery?.data;
      if (data) {
        var list = [];
        data.pages.forEach(({ recommendedMovies: { data } }, i) => {
          list = [...list, ...data];
        });
        if (renderFullList) return list;
        return list.slice(0, 2);
      }
      return [];
    }, [recommendedMoviesQuery?.data, renderFullList]);

    useLayoutEffect(() => {
      if (param) {
        setCurrentMovieId(param);
      }
    }, [param]);

    useEffect(() => {
      if (
        (similarMoviesQuery?.data && expanded) ||
        (recommendedMoviesQuery?.data && expanded)
      ) {
        setListRenderSize(true);
      }
    }, [expanded, recommendedMoviesQuery?.data, similarMoviesQuery?.data]);

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

    const current = movieDetails?.movie;
    const year = current?.releaseDate.split("-")[0];
    const genres = movieDetails?.movie.genres;
    const runTime = movieDetails?.movie.runtime;

    const posterPath = current?.posterPath
      ? `https://image.tmdb.org/t/p/original${current?.posterPath}`
      : null;
    const posterPathPreview = current?.posterPath
      ? `https://image.tmdb.org/t/p/w300${current?.posterPath}`
      : null;

    const overlay = movie?.posterPath
      ? `https://image.tmdb.org/t/p/original${movie?.posterPath}`
      : null;

    const backDropPath = current?.backdropPath
      ? `https://image.tmdb.org/t/p/original${current?.backdropPath}`
      : null;
    const backDropPathPreview = current?.backdropPath
      ? `https://image.tmdb.org/t/p/w300${current?.backdropPath}`
      : null;

    const handleMovieClick = useCallback(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, []);

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
      <Suspense>
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: "rgba(255,255,255,0.5)",
              opacity: isFetching && expanded ? 1 : 0,
              transition:'opacity 0.3s',
              height: "100%",
              width: "100%",
              pointerEvents: "none",
              zIndex: 100,
            }}
          ></div>
          <ModalWrapper
            ref={ref}
            id="card-modal"
            style={{
              backgroundColor:
                !miniExpand &&
                expand &&
                fade.to({
                  range: [0, 0.4],
                  output: ["transparent", "white"],
                }),
              ...(!miniExpand && !expanded && { boxShadow: "unset" }),
              ...(expand && mobile && { borderRadius: "0px" }),
            }}
          >
            <animated.div
              style={{
                opacity: minifade.to({
                  range: [0, 0.4, 0.5, 0.55, 1],
                  output: [1, 0, 0, 1, 1],
                }),
                width: "100%",
                height: "100%",
                zIndex: 3,
                pointerEvents: "none",
                position: expand
                  ? progress
                      .to({ range: [0, 0.4, 1], output: [0, 1, 1] })
                      .to((x) => (x ? "absolute" : "relative"))
                  : "relative",
              }}
            >
              <AspectBox potrait={!details}>
                <ProgressiveImage
                  style={{
                    width: "100%",
                    height: "100%",
                    Zindex: 5,
                    background: "none",
                  }}
                  //original={posterPath}
                  preview={overlay}
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
                opacity: fade.to({ range: [0, 0.4], output: [0, 1] }),
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
                    {videoId && (
                      <Video show={show} crop={false}>
                        <Suspense fallback={<div></div>}>
                          <Youtube
                            id={videoId}
                            light={false}
                            play={true}
                            audio={audio}
                            cb={showCb}
                            visible={inView}
                          />
                        </Suspense>
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
                    original={backDropPath}
                    preview={backDropPathPreview}
                    alt={``}
                  />
                </div>
              </>
              <animated.div
                style={{
                  position: "relative",
                  zIndex: 1,
                  backgroundColor: "inherit",
                  flex: "auto",
                  opacity: fade.to({
                    range: [0.6, 0.4, 0],
                    output: [0, 1, 1],
                  }),
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
                            <Title expand={expand}>{current?.title}</Title>
                          </Header>
                          <InlineFlex>
                            <Item>{year}</Item>
                            {runTime && <Item>{timeConversion(runTime)}</Item>}
                            <Adult>
                              {current?.adult ? "U/A 13+" : "U/A 18+"}
                            </Adult>
                          </InlineFlex>
                          <Overview className={expand && "expand"}>
                            {current?.overview}
                          </Overview>
                          {expand && <Tagline>{current?.tagline}</Tagline>}
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
                    {/* {(expand || expanded) && (
                      <div
                        style={{
                          flexGrow: 2,
                          flexShrink: 0,
                          flexBasis: "auto",
                        }}
                      >
                        <>
                          {videoData && videos && (
                            <>
                              {videos.map((type, i) => {
                                if (type.data.length === 0) return null;

                                return (
                                  <Section
                                    key={i}
                                    data={type.data}
                                    title={type.title}
                                    card="thumbnail"
                                    breakPointValues={type.breakPointValues}
                                  />
                                );
                              })}
                            </>
                          )}

                          {recommendedMovies.length !== 0 && (
                            <Section
                              title="Recommended"
                              data={recommendedMovies}
                              loading={
                                recommendedMoviesQuery.status === "loading"
                              }
                              hasMore={
                                recommendedMoviesQuery.hasNextPage &&
                                expanded &&
                                renderFullList
                              }
                              isFetching={
                                recommendedMoviesQuery.isFetchingNextPage
                              }
                              fetchMore={recommendedMoviesQuery.fetchNextPage}
                              slidesPerView={"auto"}
                              enabled={true}
                              card="detail"
                              breakPointValues={[4, 4, 4, 3, 1.5, 1.5]}
                              onClick={handleMovieClick}
                            ></Section>
                          )}
                          {similarMovies && (
                            <Section
                              title="More Like This"
                              data={similarMovies}
                              loading={similarMoviesQuery.status === "loading"}
                              hasMore={
                                similarMoviesQuery.hasNextPage &&
                                expanded &&
                                renderFullList
                              }
                              isFetching={similarMoviesQuery.isFetchingNextPage}
                              fetchMore={similarMoviesQuery.fetchNextPage}
                              card="card"
                              breakPointValues={[5, 5, 4, 4, 3, 2]}
                            ></Section>
                          )}
                        </>
                      </div>
                    )} */}
                  </>
                }
              </animated.div>
            </animated.div>
          </ModalWrapper>
        </div>
      </Suspense>
    );
  }
);

export default CardModal;
