import React, {
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useModalState } from "../../contexts/modalContext";
import { useMovieDetails } from "../../requests/requests";

import { Modal } from "./styles";

import { animated } from "react-spring";

import { useDevice } from "../../contexts/deviceContext.js";
import usePrevious from "../../hooks/usePrevious";
import ProgressiveImage, { Img } from "../cachedImage";
import { Description } from "../Cards/styles";
import RecommendedMovies from "./recommendedMovies";
import SimilarMovies from "./similarMovies";
import timeConversion, { dateFormat } from "./utils";
import Videos from "./videos";

const Youtube = lazy(() => {
  return import("../Youtube");
});
const TrailModal = forwardRef(
  (
    { style, width, footerHeight, miniHeight, fade, progress, minifade },
    ref
  ) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const param = parseInt(searchParams.get("mv"));

    const prevParam = usePrevious(param);

    const [currentMovieId, setCurrentMovieId] = useState(parseInt(param));

    const [{ movie, expand, card, overlay, mini }, dispatch] = useModalState();

    const movieId = (param ?? prevParam) || movie?.id;

    const {
      data: movieDetails,
      isLoading: movieDetailsLoading,
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

    let location = useLocation();
    let navigate = useNavigate();

    const handleExpand = useCallback(
      (e) => {
        e.stopPropagation();

        const searchKey = searchParams.get("q");
        setSearchParams(
          { ...(searchKey && { q: searchKey }), mv: movie?.id },
          {
            state: { backgroundLocation: location, miniModal: true },
          }
        );
      },
      [location, movie?.id, searchParams, setSearchParams]
    );

    const handleGenres = useCallback(
      (id) => {
        searchParams.set("q", "fast");

        const path = new URL(window.location.href);

        console.log(path, id, searchParams.toString());
        console.log("clicked", `/genre/${id}`);
        navigate(`search${searchParams.toString()}`);

        // window.scrollTo({
        //   top: 0,
        //   left: 0,
        // });

        if (param) {
          searchParams.delete("mv");
          setSearchParams(searchParams);
        }
      },
      [navigate, param, searchParams, setSearchParams]
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
    const year = current?.releaseDate;
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

    const { mobile, desktop } = useDevice();

    const potraitFooter = (card === "potrait" && mini) || param;
    const detailFooter = card === "detail" && mini && !param;
    const opened = !!param;
    const collapsing = !param && expand;

    return (
      <Suspense>
        <>
          <Modal.LoadingOverlay
            visible={isFetching && param}
          ></Modal.LoadingOverlay>

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
              <div style={{ width: "100%", position: "relative" }}>
                <Img
                  style={{
                    width: "100%",
                    height: "auto",
                    background: "none",
                  }}
                  src={overlay}
                  alt={``}
                />
              </div>
            </animated.div>
            <animated.div
              ref={ref}
              style={{
                opacity: minifade.to({
                  range: [0, 0.5, 0.8],
                  output: [0, 1, 0],
                }),
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                flexBasis: "auto",
                flex: 1,
              }}
            >
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
              >
                <ProgressiveImage
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  modal
                  original={backDropPath}
                  preview={backDropPathPreview}
                  alt={``}
                />

                {videoId && !collapsing && (
                  <Suspense fallback={<div></div>}>
                    <Youtube id={videoId} light={false} play={true} />
                  </Suspense>
                )}
                {/* {
                  <>
                    {(expand || expanded) && (
                      <Button onClick={handleClose}>
                        <Close style={{ fill: "white" }} />
                      </Button>
                    )}
                   
                  </>
                } */}
              </div>

              {
                <Description.Content
                  className="modal-content"
                  desktop={desktop}
                  opened={opened}
                  style={{ height: param ? "auto" : 0 }}
                >
                  <Description.Wrapper
                    className="modal-description"
                    opened={param}
                  >
                    <Description.Title>{current?.title}</Description.Title>

                    <Description.Overview>
                      {current?.overview}
                    </Description.Overview>
                    <Description.MetaData>
                      {runTime ? <span>{timeConversion(runTime)}</span> : null}
                      {year ? <span>{dateFormat(year)}</span> : null}
                      {current?.adult ? (
                        <span>
                          <Description.Badge>
                            {current?.adult ? "U/A 13+" : "U/A 18+"}
                          </Description.Badge>
                        </span>
                      ) : null}
                    </Description.MetaData>
                    {opened && current?.tagline && (
                      <Description.Tagline>
                        {`"${current?.tagline}"`}
                      </Description.Tagline>
                    )}
                  </Description.Wrapper>

                  {genres && opened && (
                    <Description.Genres>
                      <span
                        key={"genres"}
                        style={{ ...(!desktop && { fontWeight: 600 }) }}
                      >
                        Genres:
                      </span>
                      {genres.map((genre, i) => {
                        const last = i === genres.length - 1;
                        return (
                          <span
                            key={i}
                            className="link"
                            onClick={() => {
                              console.log(genre.id);
                              handleGenres(genre.id);
                            }}
                          >
                            {`${genre.name}`}

                            {!last && ","}
                          </span>
                        );
                      })}
                    </Description.Genres>
                  )}
                </Description.Content>
              }
              <Videos
                movieId={movieId}
                opened={opened}
                initialData={movieDetails?.movie?.videos}
              />

              <SimilarMovies movieId={movieId} opened={opened} />
              <RecommendedMovies movieId={movieId} opened={opened} />

              {!opened && (
                <Modal.Footer style={{ height: footerHeight }}>
                  <div style={{ flex: 1 }}>
                    <div>
                      {detailFooter && (
                        <>
                          <Description.Wrapper
                            className="modal-description"
                            opened={opened}
                          >
                            <Description.Title>
                              {current?.title}
                            </Description.Title>
                            <Description.MetaData>
                              {year && <span>{dateFormat(year)}</span>}
                              {runTime && (
                                <span>{timeConversion(runTime)}</span>
                              )}
                              {current?.adult && (
                                <span>
                                  <Description.Badge>
                                    {current?.adult ? "U/A 13+" : "U/A 18+"}
                                  </Description.Badge>
                                </span>
                              )}
                            </Description.MetaData>
                          </Description.Wrapper>
                        </>
                      )}
                    </div>
                  </div>
                  <Modal.Up onClick={handleExpand} />
                </Modal.Footer>
              )}
            </animated.div>
          </Modal.Wrapper>
        </>
      </Suspense>
    );
  }
);

export default TrailModal;
