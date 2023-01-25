import React, { forwardRef, useCallback, useRef, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/virtual";
import { Swiper as ReactSwiper } from "swiper/react";
import {  Nav } from "./views";

import { FreeMode, Keyboard, Mousewheel } from "swiper";

function Index(
  {
    children,
    style,
    dark,
    transitionEvents,
    enabled = true,
    mobile,
    desktop,
    SlidesPerView,
    ...props
  },
  ref
) {
  const swiper = useRef();
  const [prevEnabled, setPrev] = useState(false);
  const [nextEnabled, setNext] = useState(true);

  const nextEl = useRef();
  const prevEl = useRef();

  const onSwiperReady = useCallback((instance) => {
    swiper.current = instance;

    if (instance.isLocked) {
      setPrev(false);
      setNext(false);
      return
    }
     setPrev(swiper.activeIndex > 0);
  }, []);

  const params = {
    mousewheel: { forceToAxis: true },
  };

  const onSlideChange = (swiper) => {
    setPrev(swiper.activeIndex > 0);

    setNext(swiper.activeIndex < swiper.slides.length - SlidesPerView);
  };

  return (
    <>
      <ReactSwiper
        className="Carousel"
        direction={"horizontal"}
        spaceBetween={10}
        enabled={enabled}
        modules={[Mousewheel, FreeMode, Keyboard]}
        onSwiper={onSwiperReady}
        onSlideChange={onSlideChange}
        cssMode={true}
        passiveListeners={true}
        freeMode={{
          enabled: true,
          sticky: true,
          momentumBounceRatio: 1,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: false,
        }}
        {...(transitionEvents && transitionEvents)}
        {...params}
        {...props}
        slidesPerView="auto"
      >
        {children}
      </ReactSwiper>
      <Nav
        onClick={() => {
          swiper.current.slidePrev();
        }}
        ref={nextEl}
        enable={prevEnabled}
        dark={dark}
        // style={{ opacity: desktop ? 1 : 0 }}
      />
      <Nav
        key="next"
        next
        ref={prevEl}
        onClick={() => {
          swiper.current.slideNext();
        }}
        enable={nextEnabled}
        dark={dark}
        // style={{ opacity: desktop ? 1 : 0 }}
      />
    </>
  );
}
const Swiper = forwardRef(Index);

export default Swiper;
