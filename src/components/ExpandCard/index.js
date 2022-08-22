import React, {
  useRef,
  useState,
  forwardRef,
  useCallback,
  useLayoutEffect,
} from "react";
import styled, { css } from "styled-components";
import { useSwiperSlide } from "swiper/react";

import { useEpicState } from "../Epic/context";
import { CardWrapper, Image } from "../Card/styles";
import { useNavigate } from "react-router-dom";
import AspectBox from "../AspectBox";
import Youtube from "../Youtube";
import { useModalState } from "../../contexts/modalContext";

const Text = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.34;
  margin-top: 0.5em;
`;
const ExpandCard = forwardRef(({ height, style, data }, ref) => {

  let navigate = useNavigate();
  

  const handleClick=useCallback(()=>{

 
    navigate(`/watch/${data?.key}`, { });
  },[data?.key,  navigate])

  return (
    <CardWrapper onClick={handleClick} color="transparent" height={height} ref={ref} style={style}>
      <AspectBox>{data && <Youtube style={{borderRadius:'6px'}} id={data?.key} />}</AspectBox>
      <Text>{data.name}</Text>
    </CardWrapper>
  );
});

export default ExpandCard;
