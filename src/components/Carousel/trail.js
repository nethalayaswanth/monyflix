import React, {Fragment, forwardRef, useCallback, useRef, useState } from "react";
import styled from "styled-components";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Swiper } from "swiper/react";

import flattenChildren from "react-keyed-flatten-children";

import TrailSwiper from "./swiperTrail";

// import { FreeMode, Keyboard, Mousewheel } from "swiper";


 const CarouselItem = styled.div`
  
   
   margin-left: 1rem;
 `;

 const CarouserContainer = styled.div`
   overflow-x: scroll;
   scroll-snap-type: x mandatory;
   -ms-overflow-style: none;
   scrollbar-width: none;
   display: flex;
   height: 100%;
   width: 100%;
   &::-webkit-scrollbar {
     display: none;
   }

   ${CarouselItem} & {
     scroll-snap-align: center;
   }
 `;


function Index(
  {
    children,
    style,
    dark,
    breakpoints,
    transitionEvents,
    enabled = true,
    mobile,
    desktop,
    isHovering,
    slideStyles={},
    containerStyles={},
    ...props
  },
  ref
) {
  const swiper = useRef();
  const [isBeginning, setIsBeginning] = useState(() => true);
  const [isEnd, setIsEnd] = useState(() => false);


  console.log(swiper)

  return (
    <>
      <TrailSwiper ref={swiper} onSlideChange={(swiper)=>{console.log(swiper)}}>{children}</TrailSwiper>
      {/* <Backward
        onClick={() => {
          swiper.current.prev();
        }}
        disable={swiper.current?.isBeginning}
        visible={isHovering}
        dark={dark}
        style={{ opacity: desktop ? 1 : 0 }}
      />
      <Forward
        key="next"
        next
        onClick={() => {
          swiper.current.next();
        }}
        disable={swiper.current?.isStart}
        visible={isHovering}
        dark={dark}
        style={{ opacity: desktop ? 1 : 0 }}
      /> */}
    </>
  );
}
const SwiperTrail = forwardRef(Index);

export default SwiperTrail;
