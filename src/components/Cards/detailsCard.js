import { forwardRef, useCallback, useRef, useState } from "react";

import { useSearchParams } from "react-router-dom";

import AspectBox from "../AspectBox";
import {
  Adult,
  Description,
  Header,
  InlineFlex,
  Item,
  Overview,
  Title,
} from "../CardModal/styles";
import timeConversion from "../CardModal/utils";
import ProgressiveImage from "../cachedImage";
import { useModalDispatch } from "../../contexts/modalContext";
import { useHover } from "@use-gesture/react";
import usePrefetch from "./usePrefetch";
import useMedia from "../../hooks/useMedia";
import { mergeRefs } from "../../utils";

const DetailsCard = ({ data: current, onClick }, ref) => {
  const dispatch = useModalDispatch();

  const miniRef = useRef();

 
  let [searchParams, setSearchParams] = useSearchParams();

  const src = current?.landscapePosterPath;

  const original = src ? `https://image.tmdb.org/t/p/w780${src}` : null;
  const preview = src ? `https://image.tmdb.org/t/p/w300${src}` : null;

  const year = current?.releaseDate?.split("-")[0];
  const runTime = current?.runtime;

   const device = useMedia();

   const mobile = device === "mobile";
   const desktop = device === "desktop";

     const timeOutRef = useRef();

     const clearTimer = useCallback(() => {
       if (timeOutRef.current) {
         clearTimeout(timeOutRef.current);
       }
     }, []);

     const setTimer = useCallback(
       (cb) => {
         clearTimer();
         timeOutRef.current = setTimeout(() => {
           cb();
         }, 100);
       },
       [clearTimer]
     );

     const handleHovering = useCallback(
       (hovering) => {
         if (!hovering) {
           clearTimer();
           return;
         }
         const showMini = () => {
           dispatch({
             type: "set modal",
             payload: {
               movie: current,
               parent: miniRef.current,
               mini: true,
               overlay:original,
               aspectRatio:16/9
             },
           });
         };

        //  if (mini) {
        //    showMini();
        //    return;
        //  }

         setTimer(showMini);
       },
       [ setTimer, clearTimer, dispatch, current, preview]
     );

      const bind = useHover((state) => {
        if (current && desktop) {
          handleHovering(state.hovering);
        }
      });

   const { ref: prefetchRef, handlePrefetch } = usePrefetch({
     id: current?.id,
     whileInView: !desktop,
     enabled: current && !desktop,
   });

   

  const handleClick = useCallback(() => {
    handlePrefetch();
    dispatch({
      type: "set modal",
      // ...(!activated && { scroll: window.scrollY }),
    });
    setSearchParams({ mv: current?.id });
    onClick?.();
  }, [
  
    current?.id,
    dispatch,
    handlePrefetch,
    onClick,
    setSearchParams,
  ]);


   

  return (
    <div
      onClick={handleClick}
      ref={mergeRefs(ref, prefetchRef)}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <AspectBox {...bind()} ref={miniRef}>
        <ProgressiveImage
          style={{ borderRadius: "6px" }}
          original={original}
          preview={preview}
          alt={`${current?.title}`}
        />
      </AspectBox>
      <Description>
        <Header>
          <Title>{current?.title}</Title>
        </Header>
        <InlineFlex>
          <Item>{year}</Item>
          {runTime && <Item>{timeConversion(runTime)}</Item>}
          {current?.adult && (
            <Adult>{current?.adult ? "U/A 13+" : "U/A 18+"}</Adult>
          )}
        </InlineFlex>
        <Overview className={"details"} style={{ lineClamp: 2 }}>
          {current?.overview}
        </Overview>
      </Description>
     
    </div>
  );
};

export default forwardRef(DetailsCard);
