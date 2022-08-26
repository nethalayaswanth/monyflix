import React, { forwardRef, useCallback } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMovieDetails, getVideosById } from "../../requests/requests";
import AspectBox from "../AspectBox";
import { CardWrapper, Image } from "../Card/styles";
import ProgressiveImage from "../ProgressiveImage";

const ExpandSlide = forwardRef(({ height, style, data, onClick }, ref) => {
  let navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const handlePrefetch = useCallback(async () => {
    const types = ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"];
    const id = data?.data?.id;
    await queryClient.prefetchQuery(["movie", id], async () =>
      getMovieDetails({ id: id })
    );
    await queryClient.prefetchQuery(["videos", id, types], async () =>
      getVideosById({ id: id, types: types })
    );
  }, [data, queryClient]);
  const handleClick = useCallback(() => {
    handlePrefetch();
    setSearchParams({ mv: data?.data?.id });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    onClick?.();
  }, [data?.data?.id, handlePrefetch, onClick, setSearchParams]);
  const src = `https://image.tmdb.org/t/p/original/${data?.data?.posterPath}`;
const placeholderSrc = data?.data
  ? `https://image.tmdb.org/t/p/w300/${data?.data?.posterPath}`
  : null;
  return (
    <CardWrapper onClick={handleClick} height={height} ref={ref} style={style}>
      <AspectBox potrait>
        {data && (
          <ProgressiveImage placeholderSrc={placeholderSrc} src={src} alt="" />
        )}
      </AspectBox>
    </CardWrapper>
  );
});

export default ExpandSlide;
