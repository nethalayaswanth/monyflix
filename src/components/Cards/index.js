import React, { forwardRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useMedia from "../../hooks/useMedia";
import { mergeRefs } from "../../utils";
import AspectBox from "../AspectBox";
import { CardWrapper } from "../Cards/styles";
import ProgressiveImage from "../ProgressiveImage";
import usePrefetch from "./usePrefetch";

const Card = forwardRef(({ height, style, data, onClick }, ref) => {
  let [searchParams, setSearchParams] = useSearchParams();

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";
  const { ref: prefetchRef, handlePrefetch } = usePrefetch({
    id: data?.id,
    whileInView: !desktop,
    enabled: data?.id && !desktop,
  });

  const handleClick = useCallback(() => {
    setSearchParams({ mv: data?.id });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    onClick?.();
  }, [data?.id, onClick, setSearchParams]);

  const src = data?.posterPath;

  const original = src ? `https://image.tmdb.org/t/p/original/${src}` : null;
  const preview = src ? `https://image.tmdb.org/t/p/w300/${src}` : null;

  return (
    <CardWrapper
      onClick={handleClick}
      height={height}
      ref={mergeRefs(ref, prefetchRef)}
      style={style}
    >
      <AspectBox potrait>
        <ProgressiveImage alt="" original={original} preview={preview} />
      </AspectBox>
    </CardWrapper>
  );
});

export default Card;
