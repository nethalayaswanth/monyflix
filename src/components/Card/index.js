import React, {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState
} from "react";

   

import AspectBox from "../AspectBox";
   
   
import { useHover } from "@use-gesture/react";
   
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import useMedia from "../../hooks/useMedia";
import { getMovieDetails, getVideosById } from "../../requests/requests";
import ProgressiveImage from "../ProgressiveImage";
import Shimmer from "../shimmer";
import { CardWrapper as CardOuter } from "./styles";

const Card = forwardRef(({ id, style, movie }, ref) => {
  const [{ activated, expand, enabled, expanded }, dispatch] = useModalState();

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const miniRef = useRef();
  const [isHovering, setHovering] = useState();
  const bind = useHover((state) => {
    setHovering(state.hovering);
  });

  let [searchParams, setSearchParams] = useSearchParams();

  const refCb = useCallback((node) => {
    if (!node) return;

    miniRef.current = node;
  }, []);

  useLayoutEffect(() => {}, [enabled]);

  const queryClient = useQueryClient();

  const handlePrefetch = useCallback(async () => {
    const types = ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"];
    await queryClient.prefetchQuery(["movie", movie?.id], async () =>
      getMovieDetails({ id: movie?.id })
    );
    await queryClient.prefetchQuery(["videos", movie?.id, types], async () =>
      getVideosById({ id: movie?.id, types })
    );
  }, [movie, queryClient]);

  useLayoutEffect(() => {
    if (isHovering === undefined || activated || !enabled || !desktop) return;
    if (!isHovering) return;

    const { top } = miniRef.current.getBoundingClientRect();

    if (top < 0) return;

    const timeOut = setTimeout(async () => {
      handlePrefetch();
      dispatch({
        type: "set modal",
        movie: movie,
        parent: miniRef.current,
        activate: true,
      });
    }, 200);

    return () => {
      clearTimeout(timeOut);
    };
  }, [
    dispatch,
    isHovering,
    activated,
    desktop,
    movie,
    enabled,
    handlePrefetch,
  ]);

  const src = movie
    ? `https://image.tmdb.org/t/p/original/${movie?.posterPath}`
    : null;
  const placeholderSrc = movie
    ? `https://image.tmdb.org/t/p/w300/${movie?.posterPath}`
    : null;

  const handleClick = useCallback(async () => {
       

    handlePrefetch();

    dispatch({
      type: "set modal",
      payload: {
        movie: movie,
        parent: miniRef.current,
        ...(!activated && {scroll: window.scrollY}),
      },
    });
    setSearchParams({ mv: movie?.id });
  }, [dispatch, handlePrefetch, movie, setSearchParams]);

  return (
    <CardOuter
      ref={ref}
      {...bind()}
      style={{
        boxShadow: "0 4px 7px rgb(0 0 0 / 25%)",
        marginBottom: "8px",
        overflow: "hidden",
        borderRadius: "6px",
        ...style,
      }}
      potrait
      id="card-mini"
      onClick={handleClick}
    >
      {movie !== null && (
        <AspectBox ref={refCb} potrait>
          {movie && (
            <ProgressiveImage
              src={src}
              placeholderSrc={placeholderSrc}
              alt={`${movie?.title}`}
            />
          )}
        </AspectBox>
      )}
    </CardOuter>
  );
});

export const CardHolder = ({ style, index }) => {
  return (
    <CardOuter
      style={{
        boxShadow: "0 4px 7px rgb(0 0 0 / 25%)",
        marginBottom: "8px",
        overflow: "hidden",
        borderRadius: "6px",
        width: "200px",
        ...style,
      }}
      potrait
      id="card-holder"
    >
      <AspectBox potrait>
        <ProgressiveImage width="100%" height="100%" delay={index * 300} />
      </AspectBox>
    </CardOuter>
  );
};

export default Card;
