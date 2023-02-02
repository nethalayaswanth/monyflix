import React, {
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import useMedia from "../../hooks/useBreakpoint";
import {
  getMovieDetails,
  useLatestMovie,
  useVideosById,
} from "../../requests/requests";

import { useModalState } from "../../contexts/modalContext";

import { Details } from "./Details";

import { useSwiper, useSwiperSlide } from "swiper/react";
import ProgressiveImage from "../cachedImage";
import Carousel from "../Carousel";
import { Container, Gradient, HeroGradient } from "./styles";
import { useDevice } from "../../contexts/deviceContext.js";

const types = ["CLIP", "TRAILER", "TEASER", "BLOOPERS", "BTS", "FEATURETTE"];

const Youtube = lazy(() => {
  return import("../Youtube");
});

export const LandingCard = forwardRef(
  ({ queryEnabled, data: movie, index }, ref) => {
    const backdropPath = movie?.backdropPath;
    const posterPath = movie?.posterPath;

    const slide = useSwiperSlide();

    const swiper = useSwiper();
      const { mobile, desktop } = useDevice();

    const src = desktop ? backdropPath : posterPath;

    const originalPoster = src ? `https://image.tmdb.org/t/p/w780${src}` : null;
    const previewPoster = src ? `https://image.tmdb.org/t/p/w300${src}` : null;

    const videoData = useVideosById({
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

    const landscapePosterPath = movie?.landscapePosterPath;
    const original = landscapePosterPath
      ? `https://image.tmdb.org/t/p/w780${landscapePosterPath}`
      : null;
    const preview = landscapePosterPath
      ? `https://image.tmdb.org/t/p/w300${landscapePosterPath}`
      : null;

    useLayoutEffect(() => {
      console.log(swiper.isActive, movie?.title);
    }, [movie?.title, swiper.isActive]);

    const onVideoEnded = useCallback(() => {
      console.log("ended");
      swiper.slideNext();
    }, [swiper]);
    return (
      <Container
        ref={refcb}
        style={{ pointerEvents: slide.isActive ? "auto" : "none" }}
      >
        <ProgressiveImage
          className="absolute"
          original={originalPoster}
          preview={previewPoster}
          alt=""
        />

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
            <>
              <Details
                title={movie?.title}
                overview={movie?.overview}
                landscapePosterPath={movie?.landscapePosterPath}
                active={slide.isActive}
              />
            </>
          )}
        </div>

        {id && (
          <Suspense fallback={<div></div>}>
            <Youtube
              id={id}
              play={slide.isActive}
              light={false}
              audio={audio}
              title={movie?.title}
              onVideoEnded={onVideoEnded}
            />
          </Suspense>
        )}
        <HeroGradient />
      </Container>
    );
  }
);

const Landing = ({ queryEnabled }) => {
  const movieData = useLatestMovie({
    queryOptions: { enabled: !!queryEnabled },
  });

  const data = movieData?.data;

  return (
    <Carousel
      longSwipesRatio={0.05}
      longSwipesMs={10}
      long
      data={data}
      card={"landing"}
      cardHover={false}
      dark
      noPadding
      effectFade
    ></Carousel>
  );
};
export default Landing;
