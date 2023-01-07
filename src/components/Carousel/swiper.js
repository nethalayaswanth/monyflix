import React, {
  forwardRef,
  useCallback, useRef,
  useState
} from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/virtual";
import { Swiper } from "swiper/react";
import { Virtual } from "swiper";
import { Backward, Forward } from "../Controller";



import { FreeMode, Keyboard, Mousewheel } from "swiper";



function Index(
  {
    children,
    style, 
    dark,
    breakpoints,
    transitionEvents,
    enabled = true,
    mobile,desktop,isHovering,
    
    ...props
  },
  ref
) {
  const swiper = useRef();
  const [isBeginning, setIsBeginning] = useState(() => true);
  const [isEnd, setIsEnd] = useState(() => false);


  const onSwiperReady = useCallback((instance) => {
    swiper.current = instance;
  }, []);


  const slidesPerView= props.slidesPerView

  const params = {
    mousewheel: { forceToAxis: true },
  };


  return (
    <>
      <Swiper
        className="Carousel"
        direction={"horizontal"}
        spaceBetween={10}
        enabled={enabled}
        modules={[Mousewheel, FreeMode, Keyboard]}
        onSwiper={onSwiperReady}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
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
    </>
  );
}
const Swiperjs = forwardRef(Index);

export default Swiperjs;
