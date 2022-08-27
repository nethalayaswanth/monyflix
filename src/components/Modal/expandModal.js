import React, {
  memo, useCallback, useLayoutEffect, useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import usePrevious from "../../hooks/usePrevious";
import useWindowSize from "../../hooks/useWindowSize";
import { getExpandStyles, getStyles } from "./utils";

import { animated, useSpring } from "@react-spring/web";

import { useHover } from "@use-gesture/react";


import { useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import CardModal from "../CardModal";

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  will-change: scroll-position;
`;

const ExpandModal = ({}) => {
  const btnRef = useRef(null);

  const portalEl = document.getElementById("root");

  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("mv");
  const [
    {
      activate,
      parent: parentRef,
      activated,

      miniExpand,
      expand,

      miniExpanded,
      expanded,
    },
    dispatch,
  ] = useModalState();



  const screen = useWindowSize();
  const [prevActivated] = usePrevious(activated);
  const [prevMiniExpanded] = usePrevious(miniExpanded);
  const [prevExpanded] = usePrevious(expanded);
  var [prevExpand] = usePrevious(expand);
  const [prevMiniExpand] = usePrevious(miniExpand);
  const [prevActivate] = usePrevious(activate);

  const wrapref = useRef();

  const modalRef = useRef();

  const [isHovering, setHovering] = useState();
  const bind = useHover((state) => {
    setHovering(state.hovering);
  });

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
    const parentEl = parentRef;
    return parentEl.getBoundingClientRect();
  }, [parentRef]);

  useLayoutEffect(() => {
    if (param && !expand) {
      dispatch({ type: "set expand", expand: true });
     
    }
    if (!param && expanded) dispatch({ type: "set expand", expand: false });
  }, [expand, dispatch, param, expanded]);

  useLayoutEffect(() => {
    if (isHovering || isHovering === undefined) return;

    if (expand || expanded) return;

    dispatch({ type: "set activate", activate: false });
  }, [dispatch, expand, expanded, isHovering]);

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
      minifade
    },
    api,
  ] = useSpring(() => {
    const { top, width, left, height } = parentRect();
    const l = window.scrollX + left;
    const t = window.scrollY + top;


    return {
      from: {
        width: width,
        height: height,
        scaleY: 1,
        scaleX: 1,
        left: l,
        top:  t,
        x: 0,
        y: 0,
        transformOrigin: "center center",
        opacity: 0,
        fade: 0,
        minifade: 0,
      },
    };
  });

  // useLayoutEffect(() => {
  //   if (expanded) {
  //     const { top: miniTop } = miniRectMesureRef.current;

  //     api.start({
  //       to: async (animate) => {
  //         const w = screen.width;

  //         const lastWidth = w >= 850 ? 850 : w <= 630 ? w : w - 2 * 16;
  //         await animate({
  //           to: [
  //             {
  //               width: lastWidth,
  //               y: lastWidth <= 630 ? -miniTop : 36 - miniTop,
  //             },
  //           ],
  //           config: { tension: 180, mass: 3, clamp: true, friction: 40 },
  //         });
  //       },
  //     });
  //   }
  // }, [screen, api, expanded]);

  useLayoutEffect(() => {
    if (!activated) return;
    if (!parentRef) return;

    if (miniExpand && !prevMiniExpand) {
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

      console.log("miniexpand")
      api.start({
        to: async (animate) => {
          const show = miniExpand;

          await animate({
            to: {
              width: toWidth,
              x: X,
              y: Y,
              minifade: 1,
            },
            from: {
              width: fromWidth,
              scaleY: 1,
              scaleX: 1,
              x: 0,
              y: 0,
              left: fromLeft,
              top: fromTop,
              minifade: 0,
              transformOrigin: "center center",
            },
            config: { tension: 100 },
          }).then(() => {
            dispatch({ type: "set miniExpanded", miniExpanded: miniExpand });
          });
        },
      });
    }

    if (!miniExpand && prevMiniExpand) {
      const { fromWidth } = miniHoverStyles();
console.log("minicollpase");
      api.start({
        to: async (animate) => {
          await animate({
            to: {
              width: fromWidth,
              x: 0,
              y: 0,
              minifade:0
            },
            config: { tension: 300, mass: 3, clamp: true },
          }).then(() => {
            dispatch({ type: "set reset" });
          });
        },
      });
    }
  }, [
    activated,
    api,
    dispatch,
    miniExpand,
    miniHoverStyles,
    parentRef,
  
    prevMiniExpand,
  ]);

  useLayoutEffect(() => {
    if (!prevActivated && activated && parentRef) {
      dispatch({
        type: "set miniExpand",

        miniExpand: true,
      });
    }
  }, [activated, dispatch, parentRef, prevActivated]);

  const miniRectMesureRef = useRef();
  const miniTranslateY = useRef();
  const miniTranslateX = useRef();

  const scrollRef = useRef();

  useLayoutEffect(() => {
    if (expand && miniExpand && modalRef.current) {
      scrollRef.current = window.scrollY;
      miniRectMesureRef.current = modalRef.current.getBoundingClientRect();
      return;
    }

    if (expand && parentRef) {
      scrollRef.current = window.scrollY;
      
      miniRectMesureRef.current = parentRef.getBoundingClientRect();
    }
  }, [expand, miniExpand, parentRef]);

  const [resetAppStyles, setResetAppStyles] = useState(false);

  useLayoutEffect(() => {
    if (!miniRectMesureRef.current || !parentRef) return;

    if (expand && !expanded) {
      console.log(parentRef.getBoundingClientRect(), miniRectMesureRef.current);
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

       requestAnimationFrame(() => {
         const main = document.getElementById("app");
         main.style.position = "fixed";
         main.style.top = `-${scrollRef.current}px`;
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
              
            },
            config: { tension: 100, clamp: true },
          }).then((r) => {
            dispatch({ type: "set expanded", expanded: true });
          });
        },
        from: {
          top: miniTop ,
          scaleX: scaleX,
          scaleY: scaleY,
          x: x,
          width: expandWidth,
          y:0,
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
     body.style.overflowY = "scroll";

      api.start({
        to: async (animate) => {
          await animate({
            to: [
              {
                x: leftX,
                y: cy,
                scaleY: csX,
                scaleX: csX,

                opacity: 0,
                fade: 0,
              },
            ],
            config: { tension: 35, mass: 3, clamp: true, friction: 1 },
          }).then((r) => {
            requestAnimationFrame(() => {
              const main = document.getElementById("app");
              main.style.top = "unset";
              main.style.position = "static";
              body.style = bodystyle;
              window.scroll({
                top: scrollRef.current,
                left: 0,
              });
            });
            dispatch({
              type: "set reset",
            });
            setResetAppStyles(true);
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
    if (prevActivate && !activate) {
      dispatch({
        type: "set miniExpand",
        miniExpand: false,
      });

      return;
    }

    return () => {};
  }, [prevActivate, activate, dispatch]);

  useLayoutEffect(() => {
    if (!prevActivate && activate) {
      dispatch({ type: "set activated", activated: true });
    }
  }, [activate, dispatch, prevActivate]);

  useLayoutEffect(() => {
    return () => {
      dispatch({
        type: "set reset",
      });
    };
  }, [dispatch]);

 



  const full = expand || expanded;

  return activated || full
    ? createPortal(
        <Wrapper
          style={expand || expanded ? { height: "100.1%", width: "100%" } : {}}
        >
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
            <CardModal width={width} fade={fade} minifade={minifade} />
          </animated.div>
          <animated.div
            onClick={handleClose}
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

export default memo(ExpandModal);
