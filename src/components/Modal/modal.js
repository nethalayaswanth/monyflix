import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import {
  collapseStyles,
  getExpandStyles,
  getHoverStyles,
  updatedStyles,
} from "./utils";

import { animated, useSpring } from "@react-spring/web";

import { useHover } from "@use-gesture/react";

import { useSearchParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import { useModalState } from "../../contexts/modalContext";
import ModalCard from "../CardModal";


import {PADDING_Y} from './utils'
export const MAX_WIDTH = 850;
export const MOBILE_BREAKPOINT = 630;
export const GAP = 10;
export const FADE_SCALE = 0.8;
export const FADE_TRANSLATE = 3000;
export const PADDING_X = 16;
export const ASPECT_RATIO = 2 / 3;
export const MARGIN_MOBILE = 25;
export const MARGIN_DESKTOP = 40;

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  will-change: scroll-position;
`;

const Modal = ({}) => {
  const portalEl = document.getElementById("root");

  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  const [{ parent, mini, expand, aspectRatio }, dispatch] = useModalState();

  const screen = useWindowSize();

  const [isHovering, setHovering] = useState();

  const bind = useHover((state) => {
    // setHovering(state.hovering);
  });

  const hoverAway = useHover((state) => {
    if (state.hovering && !param) {
      const { from } = hoverStyles();
      api.start({
        to: async (animate) => {
          await animate({
            to: {
              ...from,
              minifade: 1,
              fade: 0,
            },
            config: { tension: 100, mass: 1, clamp: true },
          }).then(() => {
            dispatch({ type: "set reset" });
          });
        },
      });
    }
  });

  const modal = useRef();

  const bodyStyle = useRef();

  const scroll = useRef();

  const miniRect = useRef();
  const miniTranslateY = useRef();
  const miniTranslateX = useRef();

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      if (param) {
        searchParams.delete("mv");
        setSearchParams(searchParams);
      }
    },
    [param, searchParams, setSearchParams]
  );

  const refCb = useCallback((node) => {
    if (!node) return;
    modal.current = node;
  }, []);

  const hoverStyles = useCallback(() => {
    const parentRect = parent?.getBoundingClientRect();

    return getHoverStyles({ parentRect, aspectRatio });
  }, [parent, aspectRatio]);

  const [
    {
      x,
      y,
      width,
      height,
      scaleY,
      scaleX,
      left,
      top,
      transformOrigin,
      opacity,
      fade,
      minifade,
      progress,
      footerHeight,
    },
    api,
  ] = useSpring(() => {
    if (!mini || !parent) {
      return {
        from: {
          x: 0,
          y: 0,
          scaleY: 1,
          scaleX: 1,
          progress: 0,
          opacity: 0,
          fade: 0,
          minifade: 1,
          width: 0,
          height: 0,
          top: 0,
          left: 0,
        },
      };
    }
    const { from, to } = hoverStyles();

    return {
      to: {
        ...to,
        minifade: 0.5,
        fade: 1,
      },
      from: {
        ...from,
        minifade: 0,
        fade: 0,
        opacity: 0,
        transformOrigin: "center center",
      },
      config: { tension: 100, friction: 15, clamp: true },
    };
  });

  const lockBody = useCallback(() => {
    const main = document.getElementById("app");
    bodyStyle.current = document.body.style;
    const scrollY = window.scrollY;
    scroll.current = scrollY;
    document.body.style.overflowY = "scroll";
    main.style.top = `-${scrollY}px`;
    main.style.position = "fixed";
    window.scroll({
      top: 0,
      left: 0,
    });
  }, []);

  const unlockBody = useCallback(() => {
    const main = document.getElementById("app");
    main.style.top = "unset";
    main.style.position = "static";
    document.body.style = bodyStyle.current;
    window.scroll({
      top: scroll.current,
      left: 0,
    });
  }, []);

  useLayoutEffect(() => {
    if (!mini) return;
    const { to, from } = hoverStyles();

    api.stop();
    api.start({
      to: {
        ...to,
        minifade: 0.5,
        fade: 1,
      },
    });
  }, [api, hoverStyles, mini]);

  useResizeObserver({
    ref: document.body,
    onResize: ({ width: screenWidth, height }) => {
      if (expand) {
        const { width, y:translateY } = updatedStyles({ width: screenWidth });
   const miniTop = modal?.current?.getBoundingClientRect();

        api.start({
          to: async (animate) => {
            await animate({
              to: [
                {
                  width,
                  
                },
              ],
              config: { tension: 180, mass: 3, clamp: true, friction: 40 },
            });
          },
        });
      }
    },
  });

  useLayoutEffect(() => {
    if (param && !expand) {
      if (mini) {
        miniRect.current = modal?.current?.getBoundingClientRect();
      }

      if (!mini && parent) {
        miniRect.current = parent.getBoundingClientRect();
      }

      const main = document.getElementById("app");

      lockBody();

      const { from, to } = getExpandStyles({
        miniRect: miniRect.current,
        parentRect: parent?.getBoundingClientRect(),
      });

      api.start({
        to: async (animate) => {
          await animate({
            to: {
              ...to,
              opacity: 1,
              fade: 1,
              progress: 1,
              minifade: 0.5,
            },
            config: { tension: 100, clamp: true },
          }).then((r) => {
            dispatch({ type: "set modal", payload: { expand: true } });
          });
        },
        from: {
          ...from,
          left: "auto",
          transformOrigin: "top center",
          opacity: 0,
          fade: 0,
        },
      });
    }
    if (!param && expand) {
      const modalRect = modal?.current.getBoundingClientRect();
      const parentRect = parent?.getBoundingClientRect();
 
     
      const { to, from } = collapseStyles({
        parentRect,
        modalRect,
        aspectRatio,
        currentY: y.get(),
      });

      document.body.style.overflowY = "scroll";

    

      api.start(() => {
   
        return {
          to: async (animate) => {
            await animate({
              to: [
                {
                  ...to,
                  progress: 0,
                  opacity: 0,
                  fade: 0,
                  minifade: 1,
                },
              ],
              from,
              config: { tension: 35, mass: 3, clamp: true, friction: 1 },
            }).then((r) => {
              dispatch({
                type: "set reset",
              });
              requestAnimationFrame(() => {
                unlockBody();
              });
            });
          },
        };
      });
    }
  }, [
    expand,
    dispatch,
    param,
    mini,
    y,
    api,
    parent,
    lockBody,
    unlockBody,
    aspectRatio,
  ]);

  useLayoutEffect(() => {
    return () => {
      dispatch({
        type: "set reset",
      });
      requestAnimationFrame(() => {
        unlockBody();
      });
    };
  }, [dispatch, unlockBody]);

  const full = param || expand;

  const mount = mini || full;

  return mount
    ? createPortal(
        <Wrapper style={{ ...(full && { height: "100%", width: "100%" }) }}>
          <animated.div
            ref={refCb}
            {...bind()}
            style={{
              transformOrigin,
              position: "absolute",
              zIndex: 99999,
              willChange: "transform position top width scaleX scaleY left",
              top,
              width,
              x,
              y,
              scaleY,
              scaleX,
              left,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <ModalCard
              width={width}
              progress={progress}
              fade={fade}
              minifade={minifade}
              miniHeight={height}
              footerHeight={footerHeight}
            />
          </animated.div>
          <animated.div
            onClick={handleClose}
            {...hoverAway()}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backdropFilter: "blur(2px)",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              opacity: opacity,
            }}
          />
        </Wrapper>,
        portalEl
      )
    : null;
};

export default memo(Modal);
