import React, {
  useRef,
  useState,
  forwardRef,
  useLayoutEffect,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import useHover from "../../hooks/useHover";
import AspectBox from "../AspectBox";
import { Image } from "../Card/styles";
import { useCardState } from "../Card/context";
import { useAppState } from "../../contexts/appContext";
import { getMovieDetails } from "../../requests/requests";
import { useQueryClient } from "react-query";

const CardMini = forwardRef(({ style, movie: m }, ref) => {
  const [{ movie, activate, enabled, activated }, dispatch] = useCardState();

  const [hoverRef, isHovering] = useHover();

  const queryClient = useQueryClient();

  // useLayoutEffect(() => {
  //   if (isHovering === undefined || activated || !enabled) return;
  //   if (!isHovering) return;

  //
  //   const timeOut = setTimeout(async() => {

  //       await queryClient.prefetchQuery(["movie", movie?.id], () =>
  //         getMovieDetails({ id: movie?.id})
  //       );
  //
  //       dispatch({ type: "set activate", activate: true });
  //     }
  //   , 800);

  //   return () => {
  //     clearTimeout(timeOut);
  //   };
  // }, [dispatch, isHovering, activated, queryClient, movie?.id, enabled]);

  const src = movie
    ? `https://image.tmdb.org/t/p/original/${movie?.posterPath}`
    : null;
  const backDropPath = movie
    ? `https://image.tmdb.org/t/p/original/${movie?.backdropPath}`
    : null;

  return (
    <AspectBox ref={hoverRef} style={{ borderRadius: "8px" }} potrait>
      {movie && <Image src={src} alt={`${movie?.title}`} />}
    </AspectBox>
  );
});

export default CardMini;
