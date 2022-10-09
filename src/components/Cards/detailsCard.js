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
import ProgressiveImage from "../ProgressiveImage";
import { useModalState } from "../../contexts/modalContext";
import { useHover } from "@use-gesture/react";
import usePrefetch from "./usePrefetch";
import useMedia from "../../hooks/useMedia";
import { mergeRefs } from "../../utils";

const DetailsCard = ({ data: current, onClick }, ref) => {
  const [{ activated, expand, enabled, expanded }, dispatch] = useModalState();

  const miniRef = useRef();

 
  let [searchParams, setSearchParams] = useSearchParams();
  
  const [isHovering, setHovering] = useState();
  const bind = useHover((state) => {
    if (current) {
      setHovering(state.hovering);
    }
  });

   const device = useMedia();

   const mobile = device === "mobile";
   const desktop = device === "desktop";

   const { ref: prefetchRef, handlePrefetch } = usePrefetch({
     id: current?.id,
     whileInView: !desktop,
     enabled: current && !desktop,
   });

   

  const handleClick = useCallback(() => {
    handlePrefetch();
    dispatch({
      type: "set modal",
      ...(!activated && { scroll: window.scrollY }),
    });
    setSearchParams({ mv: current?.id });
    onClick?.();
  }, [
    activated,
    current?.id,
    dispatch,
    handlePrefetch,
    onClick,
    setSearchParams,
  ]);


   const src = current?.images?.filePath;

   const original = src ? `https://image.tmdb.org/t/p/original/${src}` : null;
   const preview = src ? `https://image.tmdb.org/t/p/w300/${src}` : null;

   const year = current?.releaseDate?.split("-")[0];
   const runTime = current?.runtime;

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
      <AspectBox ref={miniRef}>
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
      {/* <button
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 3,
        }}
        onClick={handleClick}
      /> */}
    </div>
  );
};

export default forwardRef(DetailsCard);
