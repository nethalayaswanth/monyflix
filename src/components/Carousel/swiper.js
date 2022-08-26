import React, {
  forwardRef,
  useCallback, useRef,
  useState
} from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper } from "swiper/react";
import { Backward, Forward } from "../Controller";


import { Mousewheel, FreeMode, Keyboard } from "swiper";
import useHover from "../../hooks/useHover";

import useMedia from "../../hooks/useMedia";
import { SwiperWrapper } from "./views";

function Index(
  {
    children,
    style, 
    dark,
    breakpoints,
    transitionEvents,
    enabled = true,
    ...props
  },
  ref
) {
  const swiper = useRef();
  const [isBeginning, setIsBeginning] = useState(() => true);
  const [isEnd, setIsEnd] = useState(() => false);

  const device= useMedia(
       
    ["(min-width: 740px)", "(min-width: 480px)", "(min-width: 300px)"],
    
    ["desktop", "tablet", "mobile"],
    
    "desktop"
  );

  

  const [cbRef, isHovering] = useHover();
  const onSwiperReady = useCallback((instance) => {
    swiper.current = instance;
  }, []);

  const SwiperWrapperRef = useCallback(
    (ref) => {
      if (!ref) return;

      cbRef(ref);
    },
    [cbRef]
  );

  const slidesPerView=props.slidesPerView
  const params = {
    mousewheel: { forceToAxis: true },
...(!slidesPerView &&  { breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 10,
      },

      480: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      630: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      810: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
      1000: {
        slidesPerView: 6,
        spaceBetween: 10,
      },
      1500: {
        slidesPerView: 8,
        spaceBetween: 10,
      },
    }}),
    ...breakpoints,
  };

  const mobile = device==="mobile"
  const desktop=device==="desktop"

  return (
    <>
      <SwiperWrapper
        ref={SwiperWrapperRef}
        style={{
          ...style,
          overflow: "visible",
          padding: desktop ? "0 40px" : "",
        }}
        mobile={mobile}
        desktop={desktop}
      >
        <Swiper
          className="Carousel"
          direction={"horizontal"}
          spaceBetween={10}
          slidesPerView="4"
          enabled={enabled}
          modules={[Mousewheel, FreeMode, Keyboard]}
          onSwiper={onSwiperReady}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          preloadImages={false}
          freeMode={{
            enabled: true,
            sticky: true,
            momentumBounce: false,
            momentumBounceRatio: 0.5,
          }}
          
          keyboard={{
            enabled: true,
            onlyInViewport: false,
          }}
          {...(transitionEvents && transitionEvents)}
          {...params}
          {...props}
        >
          {" "}
          {children}
        </Swiper>
        <Backward
          onClick={() => {
            swiper.current.slidePrev();
          }}
          disable={isBeginning}
          visible={isHovering}
          dark={dark}
          style={{ opacity: desktop ? 1 : 0 }}
        />
        <Forward
          key="next"
          next
          onClick={() => {
            swiper.current.slideNext();
          }}
          disable={isEnd}
          visible={isHovering}
          dark={dark}
          style={{ opacity: desktop ? 1 : 0 }}
        />
      </SwiperWrapper>
    </>
  );
}
const Swiperjs = forwardRef(Index);

export default Swiperjs;
