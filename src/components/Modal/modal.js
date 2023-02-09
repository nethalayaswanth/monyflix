import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import {
  collapseStyles,
  getExpandStyles,
  getHoverStyles,
  updatedStyles,
} from "./utils";

import { useSpring } from "@react-spring/web";

import { useHover } from "@use-gesture/react";

import { useSearchParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import { useModalState } from "../../contexts/modalContext";
import ModalCard from "../CardModal";

import useScrollLock from "../../hooks/useLock";
import usePrevRender from "../../hooks/usePrevRender";

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  will-change: scroll-position;
`;

const ModalWrapper = ({}) => {
  const portalEl = useMemo(() => {
    let root = document.getElementById("root");
    let span = document.getElementById("modal-portal");
    // root.insertAdjacentElement("beforeend", span);
    return root;
  }, []);

 
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  const [{ parent, expanded, small,aspectRatio, showMini }, dispatch] = useModalState();

  const prevSmall = usePrevRender(small);

  const prevExpanded = usePrevRender(expanded);
  const modal = useRef();
  const innerRef = useRef();

  const bodyStyle = useRef();

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
        footerHeight: 0,
        aspectRatio: aspectRatio,
        transformOrigin: "center top",
      },
      onPause: (results, spring) => {},
      onRest: (results, spring) => {
        const {
          value: { progress },
        } = results;

        if (progress === 0) {
          dispatch({
            type: "set reset",
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

  const { lockBody, unlockBody } = useScrollLock();

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
      closeMini();
    }
  });

  if (!small && !param && !expanded) {
    closeMini();
  }

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

  useResizeObserver({
    ref: document.body,
    onResize: ({ width: screenWidth, height }) => {
      if (expanded) {
        const { width, topPadding } = updatedStyles({ width: screenWidth });
        api.start((_, { springs: { y } }) => {
    
          return {
            to: async (animate) => {
              await animate({ width });
            },
          };
        });
      }
    },
  });

  useLayoutEffect(() => {
    if (param && !expanded) {
      let scrollHeight;
      if (prevSmall) {
        miniRect.current = modal?.current?.getBoundingClientRect();
        scrollHeight = innerRef.current?.scrollHeight;
      } else if (!prevSmall && parent) {
        miniRect.current = parent.getBoundingClientRect();
        scrollHeight = innerRef.current?.scrollHeight;
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
      unlockBody();
      // requestAnimationFrame(() => {

      // });
    };
  }, [dispatch, unlockBody]);

  const full = param || expanded;

  return (
    <>
      {portalEl &&
        createPortal(
          <Container
            id="modal-scroller"
            style={{
              ...(full && { height: "100%", zIndex: 1, width: "100%" }),
            }}
          >
            <ModalCard
              springs={{
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
                 aspectRatio,
              }}
              hoverAway={hoverAway}
              spring={api}
              mainRef={refCb}
              innerRef={innerRef}
            />
          </Container>,
          portalEl
        )}
    </>
  );
};

export default memo(ModalWrapper);
