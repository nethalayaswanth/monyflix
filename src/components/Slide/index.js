import React, { forwardRef, useCallback, useLayoutEffect } from "react";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useSwiperSlide } from "swiper/react";
import { getMovieDetails, getVideosById } from "../../requests/requests";
import AspectBox from "../AspectBox";
import { CardWrapper, Image } from "../Card/styles";
import { useEpicState } from "../Epic/context";

const Slide = forwardRef(
  ({ height, style, index, movie, onClick = {} }, ref) => {
    const { isActive } = useSwiperSlide();
    const [state, dispatch] = useEpicState();

    const setMovie = useCallback(() => {
      if (isActive) {
        dispatch({
          type: "set_current",
          id: index,
        });
      }
    }, [isActive, dispatch, index]);

    let [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const handlePrefetch = useCallback(async () => {
      const types = ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"];
      const id = movie?.id;
      await queryClient.prefetchQuery(["movie", id], async () =>
        getMovieDetails({ id: id })
      );
      await queryClient.prefetchQuery(["videos", id, types], async () =>
        getVideosById({ id: id, types })
      );
    }, [movie, queryClient]);

    const handleClick = useCallback(() => {
      handlePrefetch();

      console.log("dnkxx,kn xk kx x");
      setSearchParams({ mv: movie?.id });
    }, [movie, handlePrefetch, setSearchParams]);

    useLayoutEffect(() => {
      setMovie();
    }, [setMovie]);

    const src = `https://image.tmdb.org/t/p/original/${movie?.posterPath}`;
    return (
      <CardWrapper
        onClick={handleClick}
        height={height}
        ref={ref}
        style={{ ...style, cursor: "pointer" }}
      >
        <AspectBox potrait>{src && <Image src={src} alt="" />}</AspectBox>
      </CardWrapper>
    );
  }
);

export default Slide;
