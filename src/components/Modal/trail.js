import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import usePrevious from "../../hooks/usePrevious";
import useWindowSize from "../../hooks/useWindowSize";
import { getExpandStyles, getStyles } from "./utils";

import { animated, useSpring } from "@react-spring/web";

import { useHover } from "@use-gesture/react";
import CardModal from "../CardModal";

import { useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import TrailModal from "../CardModal/trail";


const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  will-change: scroll-position;
`;

const TrailExpandModal = ({}) => {
  const portalEl = document.getElementById("root");

  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");

  const [
    {
      activate,
      parent: parentRef,
      activated,
      miniExpand,
      mini,
      expand,
      miniExpanded,
      hovered,
      clicked,
      expanded,
    },
    dispatch,
  ] = useModalState();

  const screen = useWindowSize();

  const [isHovering, setHovering] = useState();

  const bind = useHover((state) => {
    setHovering(state.hovering);
    console.log(state)
  });

  const hoverAway = useHover((state) => {


    if (state.hovering) {
      const { fromWidth ,fromHeight} = miniHoverStyles();
      api.start({
        to: async (animate) => {
          await animate({
            to: {
              width: fromWidth,
              height:fromHeight,
              x: 0,
              y: 0,
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

  const prevActivated = usePrevious(activated);
  const prevMiniExpanded = usePrevious(miniExpanded);
  const prevExpanded = usePrevious(expanded);
  const prevExpand = usePrevious(expand);
  const prevMiniExpand = usePrevious(miniExpand);
  const prevActivate = usePrevious(activate);

   const prevMini = usePrevious(mini);

  const wrapref = useRef();

  const modalRef = useRef();

  const bodyStyleRef = useRef();

  const scrollRef = useRef();

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

  const parentRect = useCallback(() => {
    if (!parentRef) return null;
    return parentRef.getBoundingClientRect();
  }, [parentRef]);


  const [show, setShow] = useState();

  const min = miniExpand && !prevMiniExpand;

  useLayoutEffect(() => {
    if (param && !expand) {
      miniRectMesureRef.current = modalRef?.current?.getBoundingClientRect();
      const main = document.getElementById("app");
      bodyStyleRef.current = document.body.style;
      const scroll = window.scrollY;
      scrollRef.current = window.scrollY;
      if (!min) {
        main.style.top = `-${scroll}px`;
        main.style.position = "fixed";
        document.body.style.overflowY = "scroll";
      }
      setShow(true);
    }
    if (!param && expanded) dispatch({ type: "set expand", expand: false });
  }, [expand, dispatch, param, expanded, min]);

  useEffect(() => {
    if (show) {
      dispatch({ type: "set expand", expand: true });
    }
  }, [dispatch, show]);

  // useLayoutEffect(() => {
  //   if (isHovering || isHovering === undefined) return;

  //   if (expand || expanded) return;

  //   dispatch({ type: "set modal", payload: { mini: false} });
  // }, [dispatch, expand, expanded, isHovering]);

  const refCb = useCallback((node) => {
    if (!node) return;
    modalRef.current = node;
  }, []);

  const miniHoverStyles = useCallback(() => {
    const parent = parentRect();

    return getStyles({ parent });
  }, [parentRect]);

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
    },
    api,
  ] = useSpring(() => {
     const {
        fromHeight,
        fromWidth,
        fromTop,
        fromLeft,
        X,
        Y,
        toWidth,
        toHeight,
      } = miniHoverStyles();

    
    return {
      // to: {
      //   width: toWidth,
      //   height:toHeight,
      //   x: X,
      //   y: Y,
      //   minifade: 0.5,
      //   fade: 1,
      // },
      from: {
        width: fromWidth,
        scaleY: 1,
        scaleX: 1,
        height:fromHeight,
        x: 0,
        y: 0,
        left: fromLeft,
        top: fromTop,
        minifade: 0,
        fade: 0,
        transformOrigin: "center center",
      },
      config: { tension: 100, friction: 15, clamp: true },
    };
           
    // return {
    //   from: {
    //     width: 0,
    //     height: 0,
    //     scaleY: 1,
    //     scaleX: 1,
    //     left: 0,
    //     top: 0,
    //     x: 0,
    //     y: 0,
    //     transformOrigin: "center center",
    //     opacity: 0,
    //     fade: 0,
    //     minifade: 0,
    //     progress: 0,
    //   },
    // };
  });

  // useLayoutEffect(() => {
  //   if (!prevActivate && activate) {
  //     dispatch({ type: "set modal", payload: { activated: true } });
  //     return;
  //   }
  //   if (prevActivate && !activate) {
  //     dispatch({
  //       type: "set modal",
  //       payload: { miniExpand: false },
  //     });
  //     return;
  //   }
  // }, [prevActivate, activate, dispatch]);

  useLayoutEffect(() => {
    if (expanded) {
      const miniTop = miniRectMesureRef.current?.top;

      api.start({
        to: async (animate) => {
          const w = screen.width;

          const lastWidth = w >= 850 ? 850 : w <= 630 ? w : w - 2 * 16;
          const y = miniTop ? -miniTop : 0;
          await animate({
            to: [
              {
                width: lastWidth,
                y: lastWidth <= 630 ? y : 36 + y,
              },
            ],
            config: { tension: 180, mass: 3, clamp: true, friction: 40 },
          });
        },
      });
    }
  }, [screen, api, expanded]);

   useLayoutEffect(() => {
    //  if (!activated) return;
     if (!parentRef) return;

     if (!mini && prevMini) {
       const { fromWidth } = miniHoverStyles();
       api.start({
         to: async (animate) => {
           await animate({
             to: {
               width: fromWidth,
               x: 0,
               y: 0,
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
   }, [activated, api, dispatch, mini, miniExpand, miniHoverStyles, parentRef, prevMini, prevMiniExpand]);

  // useLayoutEffect(() => {
  //   if (!activated) return;
  //   if (!parentRef) return;

  //   if (miniExpand && !prevMiniExpand) {
  //     const {
  //       fromHeight,
  //       fromWidth,
  //       fromTop,
  //       fromLeft,
  //       X,
  //       Y,
  //       toWidth,
  //       toHeight,
  //     } = miniHoverStyles();

  //     api.start({
  //       to: async (animate) => {

  //         await animate({
  //           to: {
  //             width: toWidth,
  //             x: X,
  //             y: Y,
  //             minifade: 0.5,
  //             fade: 1,
  //           },
  //           from: {
  //             width: fromWidth,
  //             scaleY: 1,
  //             scaleX: 1,
  //             x: 0,
  //             y: 0,
  //             left: fromLeft,
  //             top: fromTop,
  //             minifade: 0,
  //             fade: 0,
  //             transformOrigin: "center center",
  //           },
  //           config: { tension: 100, friction: 15, clamp: true },
  //         }).then(() => {
  //           dispatch({ type: "set miniExpanded", miniExpanded: miniExpand });
  //         });
  //       },
  //     });
  //   }

  //   if (!miniExpand && prevMiniExpand) {
  //     const { fromWidth } = miniHoverStyles();

  //     api.start({
  //       to: async (animate) => {
  //         await animate({
  //           to: {
  //             width: fromWidth,
  //             x: 0,
  //             y: 0,
  //             minifade: 1,
  //             fade: 0,
  //           },
  //           config: { tension: 100, mass: 1, clamp: true },
  //         }).then(() => {
  //           dispatch({ type: "set reset" });
  //         });
  //       },
  //     });
  //   }
  // }, [
  //   activated,
  //   api,
  //   dispatch,
  //   miniExpand,
  //   miniHoverStyles,
  //   parentRef,
  //   prevMiniExpand,
  // ]);

  // useLayoutEffect(() => {
  //   if (!prevActivated && activated && parentRef && hovered && !clicked) {
  //     dispatch({
  //       type: "set miniExpand",
  //       miniExpand: true,
  //     });
  //   }
  // }, [activated, clicked, dispatch, hovered, parentRef, prevActivated]);

  const miniRectMesureRef = useRef();
  const miniTranslateY = useRef();
  const miniTranslateX = useRef();

  useLayoutEffect(() => {
    if (expand && miniExpand && modalRef.current) {
      const main = document.getElementById("app");
      requestAnimationFrame(() => {
        main.style.top = `-${scrollRef.current}px`;
        main.style.position = "fixed";
        document.body.style.overflowY = "scroll";
      });

      return;
    }

    if (expand && parentRef) {
      miniRectMesureRef.current = parentRef.getBoundingClientRect();
    }
  }, [expand, miniExpand, parentRef]);

  useLayoutEffect(() => {
    if (!miniRectMesureRef.current || !parentRef) return;
  
    if (expand && !expanded) {
      const {
        width: miniWidth,
        height: miniHeight,
        left: miniLeft,
        right: miniRight,
        top: miniTop,
      } = miniRectMesureRef.current;

      const {
        height,
        width: expandWidth,
        scaleY,
        scaleX,
        x,
        y: ey,
      } = getExpandStyles({
        miniWidth,
        miniHeight,
        miniLeft,
        miniRight,
        miniTop,
      });

      miniTranslateY.current = y.get();

      api.start({
        to: async (animate) => {
          await animate({
            to: {
              scaleX: 1,
              scaleY: 1,
              x: 0,
              y: expandWidth < 630 ? -miniTop : ey,
              opacity: 1,
              fade: 1,
              progress: 1,
              minifade: 0.5,
            },
            config: { tension: 100, clamp: true },
          }).then((r) => {
            dispatch({ type: "set expanded", expanded: true });
          });
        },
        from: {
          top: miniTop,
          scaleX: scaleX,
          scaleY: scaleY,
          x: x,
          width: expandWidth,
          y: 0,
          left: "auto",
          transformOrigin: "top center",
          opacity: 0,
          fade: 0,
        },
      });
      return;
    }

    if (!expand && expanded) {
      const modal = modalRef.current.getBoundingClientRect();
      const parent = parentRef.getBoundingClientRect();
      const { top: miniTop } = miniRectMesureRef.current;

      const cy = -miniTranslateY.current;
      const leftX =
        parent.left + parent.width / 2 - document.body.clientWidth / 2;
      const csX = parent.width / width.get();

      const body = document.getElementsByTagName("BODY")[0];
      let bodystyle = body.style;
      requestAnimationFrame(() => {
        body.style.overflowY = "scroll";
      });
      api.start({
        to: async (animate) => {
          await animate({
            to: [
              {
                x: leftX,
                y: cy,
                scaleY: csX,
                scaleX: csX,
                progress: 0,
                opacity: 0,
                fade: 0,
                minifade: 1,
              },
            ],
            config: { tension: 35, mass: 3, clamp: true, friction: 1 },
          }).then((r) => {
            requestAnimationFrame(() => {
              const main = document.getElementById("app");
              main.style.top = "unset";
              main.style.position = "static";
              body.style = bodyStyleRef.current;
              window.scroll({
                top: scrollRef.current,
                left: 0,
              });
            });
            dispatch({
              type: "set reset",
            });
            setShow(false);
          });
        },
      });
    }
  }, [
    expand,
    dispatch,
    api,
    y,
    expanded,

    parentRect,
    width,
    parentRef,
    screen,
  ]);

  useLayoutEffect(() => {
    if (parentRef) return;

    const w = document.body.clientWidth;

    const lastWidth = w >= 850 ? 850 : w <= 630 ? w : w - 2 * 16;
    if (expand && !expanded) {
      api.start({
        to: async (animate) => {
          await animate({
            to: [
              {
                scaleX: 1,
                scaleY: 1,
                x: 0,
                opacity: 1,
                progress: 1,
                minifade: 0.5,
                fade: 1,
              },
            ],
            config: { tension: 500, mass: 5, clamp: true },
          }).then((r) => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
            dispatch({ type: "set expanded", expanded: true });
          });
        },
        from: {
          scaleX: 0.8,
          scaleY: 0.8,
          x: 0,
          y: 0,
          width: lastWidth,
          top: lastWidth <= 630 ? 0 : 36,
          left: "auto",
          transformOrigin: "50% 12.5%",
          opacity: 0,
          progress: 0,
          minifade: 0,
          fade: 0,
        },
      });
      return;
    }

    if (!expand && expanded) {
      api.start({
        to: async (animate) => {
          await animate({
            to: [
              {
                x: 0,
                y: 2999,
                scaleY: 0.8,
                scaleX: 0.8,
                opacity: 0,
                progress: 0,
                minifade: 1,
                fade: 1,
              },
            ],
            config: { tension: 170, mass: 3, clamp: true, friction: 1 },
          }).then((r) => {
            requestAnimationFrame(() => {
              const main = document.getElementById("app");
              main.style.top = "unset";
              main.style.position = "static";
              document.body.style = bodyStyleRef.current;

              window.scroll({
                top: scrollRef.current,
                left: 0,
              });
            });
            dispatch({
              type: "set reset",
            });
            if (param) {
              searchParams.delete("mv");
              setSearchParams(searchParams);
            }
          });
        },
      });
    }
  }, [
    expand,
    dispatch,
    api,
    expanded,
    parentRef,
    param,
    searchParams,
    setSearchParams,
  ]);

  useLayoutEffect(() => {
    return () => {
      dispatch({
        type: "set reset",
      });
      setShow(false);
    };
  }, [dispatch]);

  const full = expand || expanded;
  const modal = mini || expand;

  console.log({mini, top, width, x, y, scaleY, scaleX, left});


  return modal || full
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
            <TrailModal
              width={width}
              progress={progress}
              fade={fade}
              minifade={minifade}
              miniHeight={height}
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

export default memo(TrailExpandModal);
