import React, { useRef, useState,forwardRef, useCallback, useLayoutEffect } from "react";
import styled, { css } from "styled-components";
import { useSwiperSlide } from "swiper/react";
import { CardWrapper, Image } from "../Card/styles";
import { useEpicState } from "../Epic/context";
import AspectBox from "../AspectBox";
import Shimmer from "../shimmer";


const Slide = forwardRef(({ height, style,index, movie },ref) => {
  const { isActive } = useSwiperSlide();
  const [state, dispatch] = useEpicState();

  const setMovie = useCallback(() => {
    if (isActive) {
      dispatch({
        type: "set_current",
        id:index,
      });
    }
  }, [isActive, dispatch, index]);
  
  useLayoutEffect(() => {
    setMovie();
  }, [setMovie]);

 const src=`https://image.tmdb.org/t/p/original/${movie?.posterPath}`
  return (
    <CardWrapper height={height} ref={ref} style={style}>
      <AspectBox potrait>{src && <Image src={src} alt="" />}</AspectBox>
    </CardWrapper>
  );
})

export default Slide;
