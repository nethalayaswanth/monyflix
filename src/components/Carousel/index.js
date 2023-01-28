import React, {
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SwiperSlide } from "swiper/react";

import { useHover } from "@use-gesture/react";
import { useModalDispatch, useModalState } from "../../contexts/modalContext";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import useMedia from "../../hooks/useMedia";
import Card from "../Cards";
import DetailsCard from "../Cards/detailsCard";
import ExpandCard from "../Cards/expandCard";
import LandscapeCard from "../Cards/landscapeCard";
import ThumbnailCard from "../Cards/thumbNailCard";
import { LandingCard } from "../Landing";
import Swiper from "./swiper";
import { SwiperWrapper } from "./views";

const DEFAULT_BREAKPOINTS = [420, 480, 740, 1000, 1350, 1500];
const DETAIL_DEFAULTVALUES = [1.5, 1.5, 3, 4, 6, 6];
const DETAIL_DEFAULTVALUE = 1.5;
const LANDSCAPE_DEFAULTVALUES = [1];
const LANDSCAPE_DEFAULTVALUE = 1;

const DEFAULT_VALUES = [3, 4, 5, 6, 7, 8];
const DEFAULT_VALUE = 2;
const DEFAULTMARGIN = 10;

const DEFAULTPARENTPADDING = 20;
const DEFAULTCONTROLLERWIDTH = 40;

const defaultbreakPointValues = {
  expand: DEFAULT_VALUES,
  thumbnail: DETAIL_DEFAULTVALUES,
  detail: DETAIL_DEFAULTVALUES,
  card: DEFAULT_VALUES,
  landscape: LANDSCAPE_DEFAULTVALUES,
  landing: LANDSCAPE_DEFAULTVALUES,
};

const defaultBreakPointValue = {
  expand: DEFAULT_VALUE,
  thumbnail: DETAIL_DEFAULTVALUE,
  detail: DETAIL_DEFAULTVALUE,
  card: DEFAULT_VALUE,
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
    card = "expand",
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

  const [visible, elRef] = useIntersectionObserver();

  useEffect(() => {
    if (data === undefined || isFetching) return;
    if (visible && hasMore) {
      fetchMore();
    }
  }, [visible, fetchMore, data, hasMore, isFetching]);

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const value = useMedia({
    breakPoints,
    breakPointValues,
    defaultValue,
  });

  const Component = Cards[card];

  const { width, marginRight, marginLeft } = useMemo(() => {
    const width = `calc((100% - 2 * ${!desktop ? padding : 0}px  - ${
      value - 1
    } * ${margin}px) / ${value})`;

    const marginRight = endPadding
      ? `calc(var(--width) * ${value - 1} + ${value - 1} * ${margin}px + ${padding}px)`
      : `${padding}px`;

    const marginLeft = `${padding}px`;

    return { width, marginRight, marginLeft };
  }, [desktop, endPadding, margin, padding, value]);

  

  const placeHolder = Array(8).fill(0);

  const dispatch = useModalDispatch();

  const transitionEvents = useMemo(
    () => ({
      onTransitionStart: () => {
        dispatch({ type: "set enabled", enabled: false });
      },
      onTransitionEnd: () => {
        dispatch({ type: "set enabled", enabled: true });
      },
      onTouchStart: () => {
        dispatch({ type: "set enabled", enabled: false });
      },
      onTouchEnd: () => {
        dispatch({ type: "set enabled", enabled: true });
      },
    }),
    [dispatch]
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
                const first = index === 0;
                const last = index === data.length - 1;
                return (
                  <SwiperSlide key={`${index}`}>
                    <Component data={current} card={card} index={index} />
                  </SwiperSlide>
                );
              })}
              {hasMore && !loading && (
                <SwiperSlide key={"loading"}>
                  <Component card={card} ref={elRef} />
                </SwiperSlide>
              )}

              {endPadding &&
                [...Array(value - 1).fill(0)].map((current, index) => {
                  return (
                    <SwiperSlide
                      key={`${index}`}
                      className="hide"
                    ></SwiperSlide>
                  );
                })}
            </>
          ) : (
            placeHolder.map((data, index) => {
              const first = index === 0;
              const last = index === placeHolder.length - 1;
              return (
                <SwiperSlide card={card} key={index} index={index}>
                  <Component />
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </SwiperWrapper>
    </>
  );
}
