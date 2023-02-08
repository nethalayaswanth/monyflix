import React, { useRef } from "react";
import { useInView } from "react-intersection-observer";
import { SwiperSlide } from "swiper/react";

import useBreakpoint from "../../hooks/useBreakpoint";

import Card from "../Card";

import { SwiperWrapper } from "./styles";
import Swiper from "./swiper";

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

export default function Carousel(options) {
  const {
    data,
    loading,
    style,
    dark,
    fetchMore,
    hasMore,
    isFetching,
    children,
    margin = DEFAULTMARGIN,
    padding = DEFAULTPARENTPADDING,
    controllerWidth = DEFAULTCONTROLLERWIDTH,
    endPadding = false,
    card = "potrait",
    videoCrop = false,
    cardExpand = true,
    cardHover = true,
    noPadding = false,
    effectFade = false,
    ...restOptions
  } = options;

  const {
    breakPoints = DEFAULT_BREAKPOINTS,
    breakPointValues = defaultbreakPointValues[card],
    defaultValue = defaultBreakPointValue[card],
    ...props
  } = restOptions;

  const cardProps = { card, videoCrop, cardExpand, cardHover };

  const value = useBreakpoint({
    breakPoints,
    breakPointValues,
    defaultValue,
  });

  const placeHolder = Array(8).fill(0);

  const swiper = useRef();

  const { ref: elRef } = useInView({
    onChange: (inview) => {
      if (data === undefined || isFetching) return;
      if (inview && hasMore) {
        fetchMore();
      }
    },
  });

  return (
    <>
      <SwiperWrapper
        style={{
          ...style,
          ...(noPadding && { padding: 0 }),
        }}
        padding={padding}
        value={value}
        margin={margin}
        cardHover={cardHover}
      >
        <Swiper
          ref={swiper}
          dark={dark}
          SlidesPerView={value}
          effectFade={effectFade}
          {...props}
        >
          {!loading && data !== undefined ? (
            <>
              {data.map((current, index) => {
                const last = index === data.length - 2;
                return (
                  <SwiperSlide key={`${index}`}>
                    <Card
                      index={index}
                      data={current}
                      {...cardProps}
                      {...(last && { ref: elRef })}
                    />
                  </SwiperSlide>
                );
              })}
              {hasMore && !loading && (
                <SwiperSlide key={"loading"}>
                  <Card {...cardProps} />
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
              return (
                <SwiperSlide  key={index} index={index}>
                  <Card {...cardProps} />
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </SwiperWrapper>
    </>
  );
}
