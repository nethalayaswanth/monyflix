import React, {
  memo, useCallback, useLayoutEffect, useMemo, useRef
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
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
    },
    dispatch,
  ] = useModalState();

  const state=useModalState()


  console.log("activated", state);
  const screen = useWindowSize();
 
  const modalRef = useRef();

  let location = useLocation();

   

   

  const [hoverRef, isHovering] = useHover();

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
       
     dispatch({ type: "set expand", expand: false });
    },
    [dispatch]
  );

  
useLayoutEffect(() => {
  if (param) {
    dispatch({
      type: "set param",
      param: param,
    });
  }
}, [dispatch, param]);

  useLayoutEffect(() => {
    console.log("param expand");
    if (param && !expand)
    
      dispatch({
        type: "set paramModal",
        activated: true,
        param: param,
        expand: true,
      });
    if (!param && expanded) dispatch({ type: "set expand", expand: false }); 
  }, [expand, dispatch, param, expanded]);

  const refCb = useCallback(
    (node) => {
      if (!node) return;
      hoverRef(node);
      modalRef.current = node;
    },
    [hoverRef]
  );

  const springInitialStyles = useMemo(() => {
    const w = document.body.clientWidth;
    const lastWidth = w >= 850 ? 850 : w <= 630 ? w : w - 2 * 16;
    const width = lastWidth * 0.8;
    const height = document.body.clientHeight * 0.6;
    const left = window.scrollX + (document.body.clientWidth - width) / 2;
    const top = window.scrollY + (document.body.clientHeight - height) / 2;

    const scale = width / lastWidth;
    const y = 36 - top;

    return { top, left, height, width, lastWidth, scale, y };
  }, []);

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
    const { top, width, left, height } = springInitialStyles;

    return {
      from: {
        width: width,
        height: height,
        scaleY: 1,
        scaleX: 1,
        left: "auto",
        top: top,
        x: 0,
        y: 0,
        transformOrigin: "center top",
        opacity: 0,
      },
    };
  });

  useLayoutEffect(() => {
    if (expanded) {
       const { top } = springInitialStyles;
      api.start({
        to: async (animate) => {
          const w = document.body.clientWidth;

          const lastWidth = w >= 850 ? 850 : w <= 630 ? w : w - 2 * 16;
          await animate({
            to: [
              {
                width: lastWidth,
                y:lastWidth<=630?-top:36-top
              },
            ],
            config: { tension: 180, mass: 3, clamp: true, friction: 40 },
          });
        },
      });
    }
  }, [screen, api, expanded, springInitialStyles]);

  
 

  const scrollRef = useRef();

  

  useLayoutEffect(() => {
    if (parentRef) return;

    
 console.log(`%c${expand}`, "color:green");
 const { top, width, left, lastWidth, height, scale, y } = springInitialStyles;
    if (expand && !expanded) {
      
      requestAnimationFrame(() => {
        scrollRef.current = window.scrollY;
        const main = document.getElementById("app");
        main.style.position = "fixed";
        main.style.top = `-${scrollRef.current}px`;
      });


      console.log('%cexpand','color:red')
      api.start({
        to: async (animate) => {
            

          await animate({
            to: [
              {
                scaleX: 1,
                scaleY: 1,
                x: 0,
                y: y,
                width: lastWidth,
                opacity: 1,
              },
            ],
            config: {velocity:2, tension: 1000,mass:5, clamp: true },
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
          scaleX: scale,
          scaleY: scale,
          x: 0,
          y: 0,
          width: width,
          top: top,
          left: "auto",
          transformOrigin: "top center",
          opacity: 0,
        },
      });

      return;
    }

    if (!expand && expanded) {
       
console.log("%ccollapse", "color:red");
       const body = document.getElementsByTagName("BODY")[0];
       let bodystyle = body.style;
       body.style.overflowY = "scroll";

      api.start({
        to: async (animate) => {
           
         
          await animate({
            to: [
              {
                x: 0,
                y: 0,
                scaleY: scale,
                scaleX: scale,

                opacity: 0,
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
              if (param) {
                searchParams.delete("mv");
                setSearchParams(searchParams);
              }
                
          });
        },
      });
    }
  }, [expand, dispatch, api, expanded, parentRef, springInitialStyles, param, searchParams, setSearchParams]);

  
 useLayoutEffect(() => {
   return () => {
   
    requestAnimationFrame(() => {
      const main = document.getElementById("app");
      if(!main) return
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
          style={expand || expanded ? { height: "100.1%", width: "100%" } : {}}
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
            <ParamCardModal />
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
