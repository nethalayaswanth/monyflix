import React, { forwardRef, useCallback, useRef, useState } from "react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/virtual";
import { Swiper as ReactSwiper } from "swiper/react";
import { Nav } from "./views";

import {
  EffectFade,
  FreeMode,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper";

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
    effectFade,
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
      return;
    }
    setPrev(instance.activeIndex > 0);
  }, []);


  const onSlideChange = (swiper) => {
    setPrev(swiper.activeIndex!==0);
    setNext(swiper.activeIndex <=swiper.slides.length - SlidesPerView);
  };

  return (
    <>
      <ReactSwiper
        className="Carousel"
        direction={"horizontal"}
        spaceBetween={10}
        enabled={enabled}
        modules={[
          Mousewheel,
          EffectFade,
          Navigation,
          Pagination,
          FreeMode,
          Keyboard,
        ]}
        onSwiper={onSwiperReady}
        onSlideChange={onSlideChange}
        cssMode={true}
        passiveListeners={true}
        mousewheel={{ forceToAxis: true }}
        navigation={{
          enabled: true,
          nextEl: nextEl.current,
          prevEl: prevEl.current,
        }}
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
        {...(effectFade && {
          effect: "fade",
          cssMode: false,

          pagination: {
            type: "bullets",
            dynamicBullets: true,
            dynamicMainBullets: 6,
            clickable: true,
          },

          fadeEffect: {
            crossFade: true,
          },
        })}
        longSwipesRatio={0.3}
        slidesPerGroupAuto="auto"
        slidesPerView="auto"
        longSwipesMs={200}
        {...props}
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
          console.log(swiper.current.activeIndex);
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
