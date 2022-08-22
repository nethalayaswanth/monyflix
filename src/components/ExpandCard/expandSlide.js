import React, {
  useRef,
  useState,
  forwardRef,
  useCallback,
  useLayoutEffect,
} from "react";
import styled, { css } from "styled-components";
import { useSwiperSlide } from "swiper/react";
import { CardWrapper, Image } from "../Card/styles";
import { useEpicState } from "../Epic/context";
import AspectBox from "../AspectBox";
import { useNavigate, useSearchParams } from "react-router-dom";

const ExpandSlide = forwardRef(({ height, style, data,onClick }, ref) => {


  let navigate = useNavigate();

   let [searchParams, setSearchParams] = useSearchParams();

  const handleClick = useCallback(() => {

     setSearchParams(
       { mv: data?.data?.id },
     );
     window.scrollTo({
       top: 0,
       left: 0,
       behavior: "smooth",
     });

     onClick?.()

   
  }, [data?.data?.id, onClick, setSearchParams]);
  const src = `https://image.tmdb.org/t/p/original/${data?.data?.posterPath}`;

  return (
    <CardWrapper onClick={handleClick} height={height} ref={ref} style={style}>
      <AspectBox potrait>{data && <Image src={src} alt="" />}</AspectBox>
    </CardWrapper>
  );
});

export default ExpandSlide;
