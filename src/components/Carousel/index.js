import React, { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { SwiperSlide } from "swiper/react";
import { useDevice } from "../../contexts/deviceContext.js";

import { useModalDispatch } from "../../contexts/modalContext";
import useBreakpoint from "../../hooks/useBreakpoint";
import Card from "../Cards";
import DetailsCard from "../Cards/detailsCard";
import ExpandCard from "../Cards/expandCard";
import LandscapeCard from "../Cards/landscapeCard";
import ThumbnailCard from "../Cards/thumbNailCard";
import Swiper from "./swiper";
import { SwiperWrapper } from "./views";

const DEFAULT_BREAKPOINTS = [420, 480, 740, 1000, 1320, 1500];
const DETAIL_DEFAULTVALUES = [1.5, 1.75, 3, 4, 5, 5];
const EPIC_DEFAULTVALUES = [1.75, 3, 4, 5, 6, 6];
const DETAIL_DEFAULTVALUE = 1.5;
const EPIC_DEFAULTVALUE = 1.5;
const LANDSCAPE_DEFAULTVALUES = [1];
const LANDSCAPE_DEFAULTVALUE = 1;

const DEFAULT_VALUES = [2, 3, 5, 6, 7, 8];
const DEFAULT_VALUE = 2;
const DEFAULTMARGIN = 10;

const DEFAULTPARENTPADDING = 20;
const DEFAULTCONTROLLERWIDTH = 40;

const defaultbreakPointValues = {
  potrait: DEFAULT_VALUES,
  thumbnail: DETAIL_DEFAULTVALUES,
  detail: DETAIL_DEFAULTVALUES,
  epic: EPIC_DEFAULTVALUES,
  landscape: LANDSCAPE_DEFAULTVALUES,
  landing: LANDSCAPE_DEFAULTVALUES,
};

const defaultBreakPointValue = {
  potrait: DEFAULT_VALUE,
  thumbnail: DETAIL_DEFAULTVALUE,
  detail: DETAIL_DEFAULTVALUE,
  epic: EPIC_DEFAULTVALUE,
  landscape: LANDSCAPE_DEFAULTVALUE,
  landing: LANDSCAPE_DEFAULTVALUE,
};
export const Cards = {
  expand: ExpandCard,
  thumbnail: ThumbnailCard,
  detail: DetailsCard,
  card: Card,
  landscape: LandscapeCard,
  landing: LandscapeCard,
};

export default function Carousel(options) {
  const {
    data,
    loading,
    style,
    dark,
    epic,
    fetchMore,
    hasMore,
    isFetching,
    movies,
    enabled,
    children,
    margin = DEFAULTMARGIN,
    padding = DEFAULTPARENTPADDING,
    controllerWidth = DEFAULTCONTROLLERWIDTH,
    endPadding,
    card = "potrait",
    cardExpand = true,
    cardHover=true,
    noPadding,
    effectFade,
    onClick,
    full,
    ...restOptions
  } = options;

  const {
    breakPoints = DEFAULT_BREAKPOINTS,
    breakPointValues = defaultbreakPointValues[card],
    defaultValue = defaultBreakPointValue[card],
    ...props
  } = restOptions;
  const swiper = useRef();

  const { ref: elRef } = useInView({
    onChange: (inview) => {
      if (data === undefined || isFetching) return;
      if (inview && hasMore) {
        fetchMore();
      }
    },
  });


  const { mobile, desktop } = useDevice();

  const value = useBreakpoint({
    breakPoints,
    breakPointValues,
    defaultValue,
  });

  const placeHolder = Array(8).fill(0);

  const dispatch = useModalDispatch();

  const transitionEvents = useMemo(
    () => ({
      onTransitionStart: () => {
        // dispatch({ type: "set enabled", enabled: false });
      },
      onTransitionEnd: () => {
        // dispatch({ type: "set enabled", enabled: true });
      },
      onTouchStart: () => {
        // dispatch({ type: "set enabled", enabled: false });
      },
      onTouchEnd: () => {
        // dispatch({ type: "set enabled", enabled: true });
      },
    }),
    []
  );

 

  return (
    <>
      <SwiperWrapper
        style={{
          ...style,
          ...(noPadding && { padding: 0 }),

        }}
        controllerWidth={desktop ? controllerWidth : 0}
        mobile={mobile}
        desktop={desktop}
        dark={dark}
        endPadding={endPadding}
        padding={padding}
        value={value}
        margin={margin}
        cardHover={cardHover}
      >
        <Swiper
          ref={swiper}
          enabled={enabled}
          mobile={mobile}
          desktop={desktop}
          dark={dark}
          SlidesPerView={value}
          transitionEvents={transitionEvents}
          effectFade={effectFade}
          {...props}
        >
          {!loading && data !== undefined ? (
            <>
              {data.map((current, index) => {
                const last=index===data.length-2
                return (
                  <SwiperSlide key={`${index}`}>
                    <LandscapeCard
                      data={current}
                      card={card}
                      cardExpand={cardExpand}
                      cardHover={cardHover}
                      index={index}
                      {...(last && { ref: elRef })}
                    />
                  </SwiperSlide>
                );
              })}
              {hasMore && !loading && (
                <SwiperSlide key={"loading"}>
                  <LandscapeCard
                    // ref={elRef}
                    card={card}
                    cardExpand={cardExpand}
                    cardHover={cardHover}
                  />
                </SwiperSlide>
              )}

              {endPadding &&
                [...Array(Math.ceil(value) - 1).fill(0)].map(
                  (current, index) => {
                    return (
                      <SwiperSlide
                        key={`${index}`}
                        className="hide"
                      ></SwiperSlide>
                    );
                  }
                )}
            </>
          ) : (
            placeHolder.map((data, index) => {
              const first = index === 0;
              const last = index === placeHolder.length - 1;
              return (
                <SwiperSlide card={card} key={index} index={index}>
                  <LandscapeCard
                    card={card}
                    cardExpand={cardExpand}
                    cardHover={cardHover}
                  />
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </SwiperWrapper>
    </>
  );
}
