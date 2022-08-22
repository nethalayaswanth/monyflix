import React, {
  useRef,
  useState,
  forwardRef,
  useCallback,
  useLayoutEffect,
} from "react";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Forward, Backward } from "../Controller";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

import useHover from "../../hooks/useHover";
import { Pagination, Navigation, Mousewheel } from "swiper";
import { useEpicState } from "../Epic/context";

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
  const params = {
    mousewheel: { forceToAxis: true },
    breakpoints: {
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
    },
    ...breakpoints,
  };

  return (
    <>
      <SwiperWrapper
        ref={SwiperWrapperRef}
        style={{ ...style, overflow: "visible" }}
      >
        <Swiper
          className="Carousel"
          direction={"horizontal"}
          spaceBetween={20}
          slidesPerView="4"
          enabled={enabled}
          modules={[Mousewheel]}
          onSwiper={onSwiperReady}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
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
          style={{ opacity: isMobile ? 0 : 1 }}
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
          style={{ opacity: isMobile ? 0 : 1 }}
        />
      </SwiperWrapper>
    </>
  );
}
const Swiperjs = forwardRef(Index);

export default Swiperjs;
