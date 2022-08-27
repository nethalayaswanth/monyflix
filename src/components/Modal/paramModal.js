import React, {
  memo,
  useCallback,
  useLayoutEffect, useRef
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import usePrevious from "../../hooks/usePrevious";
import useWindowSize from "../../hooks/useWindowSize";

import { animated, useSpring } from "@react-spring/web";
import useHover from "../../hooks/useHover";

import { useLocation, useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import ParamCardModal from "../CardModal/paramModal";

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  will-change: scroll-position;
`;

const ParamModal = ({}) => {
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
      scroll
    },
    dispatch,
  ] = useModalState();

  const state=useModalState()

  const [prevExpand]=usePrevious(expand)

  
  const screen = useWindowSize();
 
  const modalRef = useRef();

  let location = useLocation();

   
const bodyStyleRef = useRef();

const scrollRef = useRef();
   

  const [hoverRef, isHovering] = useHover();

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
       
     dispatch({ type: "set expand", expand: false });
    },
    [dispatch]
  );

  


  useLayoutEffect(() => {
    
    if (param && !expand && !prevExpand) {
      const scroll = window.scrollY;
  bodyStyleRef.current = document.body.style;
  scrollRef.current = scroll;
      dispatch({
        type: "set paramModal",
        activated: true,
        expand: true,
      });
      requestAnimationFrame(() => {
      

        const main = document.getElementById("app");
        main.style.position = "fixed";
        main.style.top = `-${scroll}px`;
        document.body.style.overflowY = "scroll";
      });
    }
   
  }, [expand, dispatch, param,prevExpand]);

  useLayoutEffect(()=>{ if (!param && expanded) dispatch({ type: "set expand", expand: false }); },[dispatch, expanded, param])

  const refCb = useCallback(
    (node) => {
      if (!node) return;
      hoverRef(node);
      modalRef.current = node;
    },
    [hoverRef]
  );


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
    },
    api,
  ] = useSpring(() => {
     const w = document.body.clientWidth;
     const lastWidth = w >= 850 ? 850 : w <= 630 ? w : w - 2 * 16;

    return {
      from: {
        width: lastWidth,

        scaleY: 0.8,
        scaleX: 0.8,
        left: "auto",
        top: lastWidth <= 630 ? 0 : 36,
        x: 0,
        y: 0,
        transformOrigin: "50% 12.5%",
        opacity: 0,
      },
    };
  });

  useLayoutEffect(() => {
    if (expanded) {
     
      api.start({
        to: async (animate) => {
          const w = document.body.clientWidth;

          const lastWidth = w >= 850 ? 850 : w <= 630 ? w : w - 2 * 16;
          await animate({
            to: [
              {
                width: lastWidth,
                y:lastWidth<=630?0:36
              },
            ],
            config: { tension: 180, mass: 3, clamp: true, friction: 1 },
          });
        },
      });
    }
  }, [screen, api, expanded]);

     
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
                y: 0,
                scaleY: 0.8,
                scaleX: 0.8,

                opacity: 0,
              },
            ],
            config: { tension: 35, mass: 3, clamp: true, friction: 1 },
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
     requestAnimationFrame(() => {
       const main = document.getElementById("app");
       if (!main) return;
       main.style.top = "unset";
       main.style.position = "static";
       window.scroll({
         top: scrollRef.current,
         left: 0,
       });
     });
     dispatch({
       type: "set reset",
     });
   };
 }, [dispatch]);






  return (activated ) &&  createPortal(
        <Wrapper
          style={expand || expanded ? { height: "100%", width: "100%" } : {}}
        >
          <animated.div
            ref={refCb}
            style={{
              transformOrigin,
              position: "absolute",
              zIndex: 99999,
              willChange: "transform",
              width,
              x,
              y,
              scaleY,
              scaleX,
              left,
              top,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              opacity,
            }}
          >
           { <ParamCardModal />}
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
              Zindex:2
            }}
          />
        </Wrapper>,
        portalEl
      )
    
};

export default memo(ParamModal);
