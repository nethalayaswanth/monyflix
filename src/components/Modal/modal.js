import React, { memo, useCallback, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
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

import usePrevRender from "../../hooks/usePrevRender";
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

const ModalWrapper = ({}) => {
  const portalEl = document.getElementById("root");

  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  const [
    { parent, mini, collapsed, expanded, small, showMini, expand },
    dispatch,
  ] = useModalState();

  const prevSmall = usePrevRender(small);
  // const prevCollapsed = usePrevRender(collapsed);
  const prevExpanded = usePrevRender(expanded);

  const bind = useHover((state) => {
    // setHovering(state.hovering);
  });

  const modal = useRef();
  const modalInner = useRef();

  const bodyStyle = useRef();

  const scroll = useRef();

  const miniRect = useRef();

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

    return getHoverStyles({ parentRect });
  }, [parent]);

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
        transformOrigin: "center top",
      },
      onPause: (results, spring) => {
        console.log("pause", results, spring);
      },
      onRest: (results, spring) => {
        const {
          value: { progress },
        } = results;
        console.log("rest", results, spring);
        if (progress === 0) {
          dispatch({
            type: "set reset",
          });
          requestAnimationFrame(() => {
            unlockBody();
          });
        }
        if (progress === 1) {
          dispatch({
            type: "set modal",
            payload: {
              cardState: "expanded",
            },
          });
        }
      },

      config: {
        tension: 200,
        friction: 20,
        mass: 0.2,
        velocity: 0.5,
        // precision: 0.01,
        clamp: true,
      },
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
    if (bodyStyle.current) document.body.style = bodyStyle.current;
    if (scroll.current) {
      window.scroll({
        top: scroll.current,
        left: 0,
      });
    }
  }, []);

  const closeMini = useCallback(() => {
    const { from } = hoverStyles();

    api.start({
      to: async (animate) => {
        await animate({
          ...from,
          minifade: 1,
          fade: 0,
          progress: 0,
        });
      },
    });
  }, [api, hoverStyles]);

  const hoverAway = useHover((state) => {
    if (state.hovering && !param && !expanded) {
      console.log("hover away");
      closeMini();
    }
  });

  useLayoutEffect(() => {
    if (!small) return;

    const { from, to } = hoverStyles();

    if (prevSmall) api.stop(true);
    api.start({
      to: {
        ...to,
        minifade: 0.5,
        fade: 1,
        progress: 0.5,
      },
      ...(!prevSmall && {
        from: {
          ...from,
          minifade: 0,
          fade: 0,
          opacity: 0,
          transformOrigin: "center center",
        },
      }),
    });
  }, [api, hoverStyles, prevSmall, small]);
  useLayoutEffect(() => {
    if (!small && !param && !expanded) {
      closeMini();
    }
  }, [closeMini, expanded, param, showMini, small]);

  useResizeObserver({
    ref: document.body,
    onResize: ({ width: screenWidth, height }) => {
      if (expanded) {
        const { width, y: translateY } = updatedStyles({ width: screenWidth });
        const miniTop = modal?.current?.getBoundingClientRect();

        api.start({
          to: async (animate) => {
            await animate({ width });
          },
        });
      }
    },
  });

  useLayoutEffect(() => {
    if (param && !expanded) {
      console.log("expanding");
      let scrollHeight;
      if (prevSmall) {
        miniRect.current = modal?.current?.getBoundingClientRect();
        scrollHeight = modalInner.current?.scrollHeight;
      } else if (!prevSmall && parent) {
        miniRect.current = parent.getBoundingClientRect();
        scrollHeight = modalInner.current?.scrollHeight;
      }

      lockBody();

      const { from, to } = getExpandStyles({
        miniRect: miniRect.current,
        parentRect: parent?.getBoundingClientRect(),
        scrollHeight,
      });

      api.start({
        to: async (animate) => {
          await animate({
            ...to,
            opacity: 1,
            fade: 1,
            progress: 1,
            minifade: 0.5,
          });
          await animate({ height: "auto" });
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
    if (!param && expanded) {
      const modalRect = modal?.current.getBoundingClientRect();
      const parentRect = parent?.getBoundingClientRect();

      api.start((_, { springs: { y } }) => {
        const { to, from } = collapseStyles({
          parentRect,
          modalRect,
          currentY: y.get(),
        });

        document.body.style.overflowY = "scroll";
        return {
          to: {
            ...to,
            progress: 0,
            opacity: 0,
            fade: 0,
            minifade: 1,
          },

          from: { ...from },
        };
      });
    }
  }, [
    dispatch,
    param,
    api,
    parent,
    lockBody,
    unlockBody,
    expanded,
    prevExpanded,
    prevSmall,
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

  const full = param || expanded;

  const mount = mini || full;

  return createPortal(
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
          height,
          left,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ModalCard
          width={width}
          progress={progress}
          fade={fade}
          minifade={minifade}
          miniHeight={height}
          footerHeight={footerHeight}
          ref={modalInner}
        />
      </animated.div>
      <animated.div
        onClick={handleClose}
        {...hoverAway()}
        style={{
          position: "fixed",
          zIndex: 1,
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
  );
};

export default memo(ModalWrapper);
