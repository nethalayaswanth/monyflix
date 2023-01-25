import React, {
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useModalState } from "../../contexts/modalContext";
import { useMovieDetails } from "../../requests/requests";

import { Modal } from "./styles";

import { animated } from "react-spring";

import useMedia from "../../hooks/useMedia";

import { useInView } from "react-intersection-observer";
import ProgressiveImage from "../cachedImage";
import RecommendedMovies from "./recommendedMovies";
import SimilarMovies from "./similarMovies";
import timeConversion from "./utils";
import Videos from "./videos";
import AspectBox from "../AspectBox";

const Youtube = lazy(() => {
  return import("../Youtube");
});
const TrailModal = forwardRef(
  ({ style, width, footerHeight,miniHeight, fade, progress, minifade }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const param = searchParams.get("mv");

    const [currentMovieId, setCurrentMovieId] = useState(param);

    const [{ movie,expand, aspectRatio, overlay, details }, dispatch] =
      useModalState();

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

    const [renderFullList, setListRenderSize] = useState(false);

    const videoId = useMemo(() => {
      if (!movieDetails) return null;
      const videos = movieDetails.movie.videos;
      if (!videos) return null;
      const clip = videos.clip[0];
      const trailer = videos.trailer[0];
      const teaser = videos.teaser[0];

      return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
    }, [movieDetails]);

    useLayoutEffect(() => {
      if (param) {
        setCurrentMovieId(param);
      }
    }, [param]);

    // useEffect(() => {
    //   if (
    //     (similarMoviesQuery?.data && expanded) ||
    //     (recommendedMoviesQuery?.data && expanded)
    //   ) {
    //     setListRenderSize(true);
    //   }
    // }, [expanded, recommendedMoviesQuery?.data, similarMoviesQuery?.data]);

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



    const backDropPath = current?.backdropPath
      ? `https://image.tmdb.org/t/p/w780${current?.backdropPath}`
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

    const opened = param ;
    const collapsing=!param && expand

    return (
      <Suspense>
        <div
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
          }}
        >
          <Modal.LoadingOverlay
            visible={isFetching && param}
          ></Modal.LoadingOverlay>
          <animated.div
            style={{
              height: miniHeight,
              // aspectRatio: opened ? "auto" : aspectRatio,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Modal.Wrapper>
              <animated.div
                style={{
                  opacity: minifade.to({
                    range: [0, 0.5, 0.7],
                    output: [1, 0, 1],
                  }),
                  width: "100%",
                  height: "100%",
                  zIndex: 6,
                  pointerEvents: "none",
                  position: "absolute",
                }}
              >
                <div
                  style={{ aspectRatio, width: "100%", position: "relative" }}
                >
                  <ProgressiveImage
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "none",
                    }}
                    original={overlay}
                    alt={``}
                  />
                </div>
              </animated.div>

              <div
                style={{
                  position: "relative",
                  top: 0,
                  left: 0,
                  width: "100%",
                  aspectRatio: 16 / 9,
                  maxHeight: "min(800px,100vh)",
                  alignItems: "center",
                  display: "flex",
                  overflow: "hidden",
                  flexBasis: "auto",
                  flexShrink: 0,
                }}
                ref={elRef}
              >
                <ProgressiveImage
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                  original={backDropPath}
                  preview={backDropPathPreview}
                  alt={``}
                />

                <animated.div
                  style={{
                    width: "100%",
                    height: "300%",
                    position: "absolute",
                    left: 0,
                    zIndex: 2,
                    backgroundColor: "transparent",
                  }}
                >
                  {/* {videoId && !collapsing && (
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
                  )} */}
                  {/* {
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
                } */}
                </animated.div>
              </div>

              <Modal.Content expand={param} style={{}}>
                <Modal.Description expand={param}>
                  <Modal.Header>
                    <Modal.Title expand={param}>{current?.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.InlineFlex>
                    <Modal.Item>{year}</Modal.Item>
                    {runTime && (
                      <Modal.Item>{timeConversion(runTime)}</Modal.Item>
                    )}
                    <Modal.Adult>
                      {current?.adult ? "U/A 13+" : "U/A 18+"}
                    </Modal.Adult>
                  </Modal.InlineFlex>
                  {aspectRatio < 1 && (
                    <Modal.Overview className={param && "expand"}>
                      {current?.overview}
                    </Modal.Overview>
                  )}
                  {param && <Modal.Tagline>{current?.tagline}</Modal.Tagline>}
                </Modal.Description>
                {genres && param && (
                  <Modal.Genres>
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
                  </Modal.Genres>
                )}
              </Modal.Content>

              <Videos
                movieId={movieId}
                opened={opened}
                // renderFullList={true}
              />
              <RecommendedMovies
                movieId={movieId}
                opened={opened}
                // renderFullList={true}
              />
              <SimilarMovies
                movieId={movieId}
                opened={opened}
                // renderFullList={true}
              />

              {!param && (
                <>
                  <Modal.Footer style={{ height: footerHeight }}>
                    <div style={{ flex: 1 }}>
                      {aspectRatio > 1 && (
                        <div>
                          <Modal.Header>
                            <Modal.Title expand={param}>
                              {current?.title}
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.InlineFlex>
                            <Modal.Item>{year}</Modal.Item>
                            {runTime && (
                              <Modal.Item>{timeConversion(runTime)}</Modal.Item>
                            )}
                            <Modal.Adult>
                              {current?.adult ? "U/A 13+" : "U/A 18+"}
                            </Modal.Adult>
                          </Modal.InlineFlex>
                        </div>
                      )}
                    </div>
                    <Modal.Up onClick={handleExpand} />
                  </Modal.Footer>
                </>
              )}
            </Modal.Wrapper>
          </animated.div>
        </div>
      </Suspense>
    );
  }
);

export default TrailModal;
