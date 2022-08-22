import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  useEffect,
  cloneElement,
} from "react";
import { useSwiper, SwiperSlide } from "swiper/react";
//import SwiperSlide from "../swiperSlide";

import { useEpicState } from "../Epic/context";
import Slide from "../Slide";
import Card from "../Card";
import Swiperjs from "./swiper";
import ExpandCard from "../ExpandCard";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

export default function ModalCarousel({
  data,
  loading,
  type,
  fetchMore,
  hasMore,
  isFetching,
  children,
}) {
  const swiper = useRef();

  const clips = type === "Clips";
  const trailer= type==="Trailer"
  const breakpoints = {
    breakpoints: {
      320: {
        slidesPerView: clips ? 1 : 2,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: clips ? 1 : 2,
        spaceBetween: 10,
      },
      1000: {
        slidesPerView: clips ? 3 : 4,
        spaceBetween: 10,
      },
      1320: {
        slidesPerView: clips ? 4 : 5,
        spaceBetween: 10,
      },
      1500: {
        slidesPerView: clips ? 5 : 6,
        spaceBetween: 10,
      },
    },
  };

  const [visible, elRef] = useIntersectionObserver();

  useEffect(() => {
    if (data === undefined || isFetching) return;

    if (visible && hasMore) {
      fetchMore();
    }
  }, [visible, fetchMore, data, hasMore, isFetching]);

  return (
    <>
      <Swiperjs breakpoints={breakpoints} ref={swiper}>
        {!loading && data !== undefined ? (
          <>
            {data.map((data, i) => {
              return (
                <SwiperSlide key={`${i}`}>
                  {children ? (
                    cloneElement(children, {
                      key: { i },
                      id: { i },
                      data: { data },
                    })
                  ) : (
                    <ExpandCard key={i} id={i} data={data} />
                  )}
                </SwiperSlide>
              );
            })}
            {hasMore && (
              <SwiperSlide key={`loadmore`}>
                {children ? (
                  cloneElement(children, { ref: elRef })
                ) : (
                  <ExpandCard ref={elRef} />
                )}
              </SwiperSlide>
            )}
          </>
        ) : (
          [...Array(8).fill(0)].map((movie, i) => {
            return (
              <SwiperSlide key={i} index={i}>
                {children ? (
                  cloneElement(children, { key: { i } })
                ) : (
                  <ExpandCard style={{ backgroundColor: "black" }} />
                )}
              </SwiperSlide>
            );
          })
        )}
      </Swiperjs>
    </>
  );
}
