import React, {
  cloneElement,
  useEffect, useRef,
  useState
} from "react";
import { SwiperSlide } from "swiper/react";

import { useHover } from "@use-gesture/react";
import { useModalState } from "../../contexts/modalContext";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import useMedia from "../../hooks/useMedia";
import Card from "../Cards";
import DetailsCard from "../Cards/detailsCard";
import ExpandCard from "../Cards/expandCard";
import LandscapeCard from "../Cards/landscapeCard";
import ThumbnailCard from "../Cards/thumbNailCard";
import Swiperjs from "./swiper";
import { SwiperWrapper } from "./views";

const DEFAULTBREAKPOINTS = [1500, 1350, 1000, 740, 480,420];
const DEFAULTVALUES = [8, 7, 6, 5, 3, 2];
const DEFAULTVALUE = 2;
const DEFAULTMARGIN = 10;
const DEFAULTPARENTPADDING = 20;

export const Cards = {
  expand: <ExpandCard />,
  thumbnail: <ThumbnailCard />,
  detail: <DetailsCard />,
  card: <Card />,
  landscape: <LandscapeCard />,
};

export default function Carousel({
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
  breakPoints = DEFAULTBREAKPOINTS,
  breakPointValues = DEFAULTVALUES,
  defaultBreakPointValue = DEFAULTVALUE,
  margin = DEFAULTMARGIN,
  padding = DEFAULTPARENTPADDING,
  endPadding,
  card = "expand",
  onClick,
  ...props
}) {
  const swiper = useRef();

  const [visible, elRef] = useIntersectionObserver();

  const [isHovering, setHovering] = useState();

  const hoverRef = useHover((state) => {
    setHovering(state.hovering);
  });

  useEffect(() => {
    if (data === undefined || isFetching) return;

    if (visible && hasMore) {
      fetchMore();
    }
  }, [visible, fetchMore, data, hasMore, isFetching]);

  const [{ activated }, dispatch] = useModalState();

  const [modalEnabled, setModalEnabled] = useState(true);

  // useLayoutEffect(() => {
  //   dispatch({ type: "set enabled", enabled: modalEnabled });
  // }, [dispatch, modalEnabled]);

  const transitionEvents = {
    onTransitionStart: () => {
      setModalEnabled((x) => (x ? !x : x));
    },
    onTransitionEnd: () => {
      setModalEnabled((x) => (x ? x : !x));
    },
    onTouchStart: () => {
      setModalEnabled((x) => (x ? !x : x));
    },
    onTouchEnd: () => {
      setModalEnabled((x) => (x ? x : !x));
    },
  };

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const value = useMedia({
    breakPoints,
    breakPointValues,
    defaultValue: defaultBreakPointValue,
  });

  const component = Cards[card];

  const placeHolder = Array(8).fill(0);

  return (
    <>
      <SwiperWrapper
        {...hoverRef()}
        style={{
          ...style,
          overflow: "visible",
          position: "relative",
          padding: desktop ? "0 40px" : "",
        }}
        mobile={mobile}
        desktop={desktop}
        dark={dark}
        endPadding={endPadding}
        padding={padding}
      >
        <Swiperjs
          ref={swiper}
          transitionEvents={transitionEvents}
          enabled={enabled || !activated}
          mobile={mobile}
          desktop={desktop}
          dark={dark}
          isHovering={isHovering}
          {...props}
        >
          {!loading && data !== undefined ? (
            <>
              {data.map((current, index) => {
                const first = index === 0;
                const last = index === data.length - 1;

               
                return (
                  <SwiperSlide
                    style={{
                      width: `calc((100% - 2 *  ${
                        !desktop ? padding : 0
                      }px  - ${value - 1} * ${margin}px) / ${value})`,
                    }}
                    key={`${index}`}
                  >
                    {children
                      ? children({ data: current, index, onClick })
                      : cloneElement(component, {
                          data: current,
                          index,
                          onClick,
                        })}
                  </SwiperSlide>
                );
              })}
              {hasMore && !loading && (
                <SwiperSlide
                  style={{
                    width: `calc((100% - 2 * ${!desktop ? padding : 0}px  - ${
                      value - 1
                    } * ${margin}px) / ${value})`,

                    marginRight: endPadding
                      ? `calc(((100% - 2 *  ${!desktop ? padding : 0}px - ${
                          value - 1
                        } * ${margin}px)/${value}) * ${value - 1} + ${
                          value - 1
                        } * ${margin}px + ${padding}px)`
                      : `${padding}px`,
                  }}
                  key={"loading"}
                >
                  {children
                    ? children({ ref: elRef, onClick })
                    : cloneElement(component, { ref: elRef, onClick })}
                </SwiperSlide>
              )}
            </>
          ) : (
            placeHolder.map((data, index) => {
              const first = index === 0;
              const last = index === placeHolder.length - 1;
              return (
                <SwiperSlide
                  style={{
                    width: `calc((100% - 2 *  ${!desktop ? padding : 0}px  - ${
                      value - 1
                    } * ${margin}px) / ${value})`,
                    ...(first && { marginLeft: `${padding}px` }),
                    ...(last && {
                      marginRight: endPadding
                        ? `calc(((100% - 2 *  ${!desktop ? padding : 0}px - ${
                            value - 1
                          } * ${margin}px)/${value})*${value - 1} + ${
                            value - 1
                          }*${margin}px + ${padding}px)`
                        : `${padding}px`,
                    }),
                  }}
                  key={index}
                  index={index}
                >
                  {children
                    ? children({ data, index, onClick })
                    : cloneElement(component)}
                </SwiperSlide>
              );
            })
          )}
        </Swiperjs>
      </SwiperWrapper>
    </>
  );
}
