import React, { forwardRef, lazy, Suspense, useCallback, useMemo } from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useModalState } from "../../contexts/modalContext";
import { useMovieDetails } from "../../requests/requests";

import { Modal, Spacer } from "./styles";

import { animated } from "react-spring";

import { useDevice } from "../../contexts/deviceContext.js";
import usePrevious from "../../hooks/usePrevious";
import ProgressiveImage, { Img } from "../cachedImage";
import { Description } from "../Card/styles";
import Watch from "../watch";
import RecommendedMovies from "./recommendedMovies";
import SimilarMovies from "./similarMovies";
import timeConversion, { dateFormat } from "./utils";
import Videos from "./videos";
const Youtube = lazy(() => {
  return import("../Youtube");
});

const ModalCard = forwardRef(
  ({ springs, mainRef, innerRef, hoverAway }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const param = parseInt(searchParams.get("mv"));

    const prevParam = usePrevious(param);

    const [
      { movie, expanded: expand, card, cardState, overlay, small: mini },
      dispatch,
    ] = useModalState();

    const {
      opacity,
      fade,
      minifade,
      progress,
      aspectRatio,
      footerHeight,
      width,
      ...mainStyles
    } = springs;

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

        searchParams.set("mv", movie?.id);
        setSearchParams(searchParams, {
          state: { backgroundLocation: location, miniModal: true },
        });
      },
      [location, movie?.id, searchParams, setSearchParams]
    );

    const handleGenres = (id) => {
      const path = new URL(window.location.href);

      navigate(`/browse/genre/${id}`);
    };

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

    const { mobile, desktop } = useDevice();

    const detailFooter = card === "detail" && mini && !param;
    const opened = !!param;
    const collapsing = !param && expand;

    return (
      <Suspense>
        <Watch width={width} />
        <Modal.Animated ref={mainRef} style={{ width, ...mainStyles }}>
          <Modal.LoadingOverlay
            visible={isFetching && param}
          ></Modal.LoadingOverlay>

          <Modal.Wrapper mini={mini} expand={opened} collapsing={collapsing}>
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
                overflow: "hidden",
              }}
            >
              <animated.div
                style={{
                  width: "100%",
                  aspectRatio,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Img
                  style={{
                    width: "100%",
                    height: "auto",
                    top: "unset",
                    background: "none",
                  }}
                  src={overlay}
                  alt={``}
                />
              </animated.div>
            </animated.div>
            <animated.div
              ref={innerRef}
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
              <Modal.BackDrop>
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
                    <Youtube
                      key={videoId}
                      id={videoId}
                      light={false}
                      play={true}
                    />
                  </Suspense>
                )}
                {
                  <>
                    {expand && (
                      <Modal.Button onClick={handleClose}>
                        <Modal.Close style={{ fill: "white" }} />
                      </Modal.Button>
                    )}
                  </>
                }
              </Modal.BackDrop>

              {
                <Description.Content
                  className={"modal-content " }
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
            { opened && <Spacer/>}

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
        </Modal.Animated>
        <Modal.BgOverlay
          onClick={handleClose}
          {...hoverAway()}
          style={{ opacity }}
        />
      </Suspense>
    );
  }
);

export default ModalCard;
