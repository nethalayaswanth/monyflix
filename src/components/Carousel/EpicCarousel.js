import React, { cloneElement, useCallback, useEffect, useRef } from "react";
import { SwiperSlide } from "swiper/react";

import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { useEpicState } from "../Epic/context";
import Slide from "../Slide";
import Swiperjs from "./swiper";
export default function EpicCarousel({
  data,
  style,
  dark,
  epic,
  fetchMore,
  hasMore,
  isFetching,
  loading,
  children,
}) {
  const [state, dispatch] = useEpicState();

  const slideChangeTransitionStart = useCallback(() => {
    dispatch({
      type: "hide",
    });
  }, [dispatch]);

  const slideChangeTransitionEnd = useCallback(() => {
    dispatch({
      type: "show",
    });
  }, [dispatch]);

  const swiper = useRef();
  const slide = useRef();

  const [visible, elRef] = useIntersectionObserver();
  useEffect(() => {
    if (data === undefined || isFetching) return;

    if (visible && hasMore) {
      console.log("fetchmore");
      fetchMore();
    }
  }, [visible, fetchMore, data, hasMore, isFetching]);

  const breakpoints = {
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      740: {
        slidesPerView: 6,
        spaceBetween: 10,
      },
      1000: {
        slidesPerView: 8,
        spaceBetween: 10,
      },
      1320: {
        slidesPerView: 9,
        spaceBetween: 10,
      },
      1500: {
        slidesPerView: 9,
        spaceBetween: 10,
      },
    },
  };
  return (
    <>
      <Swiperjs
        ref={swiper}
        style={style}
        dark={dark}
        onSlideChangeTransitionStart={slideChangeTransitionStart}
        onSlideChangeTransitionEnd={slideChangeTransitionEnd}
        breakpoints={breakpoints}
      >
        {data.length !== 0 ? (
          <>
            {data.map((movie, i) => {
              return (
                <SwiperSlide ref={slide} key={i} index={i}>
                  {children ? (
                    cloneElement(children, {
                      key: { i },
                      id: { i },
                      data: { data },
                    })
                  ) : (
                    <Slide index={i} movie={movie} />
                  )}
                </SwiperSlide>
              );
            })}
            {hasMore && !loading && (
              <SwiperSlide key={"loading"}>
                <Slide ref={elRef} />
              </SwiperSlide>
            )}
          </>
        ) : (
          [...Array(5).fill(0)].map((movie, i) => {
            return (
              <SwiperSlide ref={slide} key={i} index={i}>
                <Slide />
              </SwiperSlide>
            );
          })
        )}
      </Swiperjs>
    </>
  );
}
