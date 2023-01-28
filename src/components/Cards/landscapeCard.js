import { forwardRef, useCallback, useMemo } from "react";
import ProgressiveImage from "../cachedImage";
import { Title } from "../CardModal/styles";

import { useSearchParams } from "react-router-dom";
import useMedia from "../../hooks/useMedia";
import { Youtube } from "../Youtube";
import { CardWrapper, CardContainer, AspectBox } from "./styles";
import usePrefetch from "./usePrefetch";
import { useSwiper, useSwiperSlide } from "swiper/react";
import { Details } from "../Landing/Details";

const LandscapeCard = ({ data: current,card }, ref) => {
 

  const device = useMedia();
  const mobile = device === "mobile";
  const desktop = device === "desktop";

   const id = useMemo(() => {
     if (!current) return null;
     const videos = current.videos;
     if (!videos) return null;
     const clip = videos.clip[0];
     const trailer = videos.trailer[0];
     const teaser = videos.teaser[0];
     const video = [clip, trailer, teaser].find((x) => !!x);
     return video ? video.key : null;
   }, [current]);

   const landscapePosterPath =
     current?.landscapePosterPath ?? current?.backdropPath;
   const backdropPath = current?.backdropPath;
   const posterPath = current?.posterPath;

  const posterOriginal = posterPath
    ? `https://image.tmdb.org/t/p/original${posterPath}`
    : null;
  const posterPreview = posterPath
    ? `https://image.tmdb.org/t/p/w92${posterPath}`
    : null;
  const backdropOriginal = backdropPath
    ? `https://image.tmdb.org/t/p/original/${backdropPath}`
    : null;
  const backdropPreview = backdropPath
    ? `https://image.tmdb.org/t/p/w300/${backdropPath}`
    : null;
  const landscapeOriginal = landscapePosterPath
    ? `https://image.tmdb.org/t/p/original/${landscapePosterPath}`
    : null;
  const landscapePreview = landscapePosterPath
    ? `https://image.tmdb.org/t/p/w300/${landscapePosterPath}`
    : null;

     const landscape = card ==='landscape'
  const backdrop = { original: backdropOriginal, preview: backdropPreview }
    // ? { original: landscapeOriginal, preview: landscapePreview }
    // : { original: backdropOriginal, preview: backdropPreview };
  const poster = { original: posterOriginal, preview: posterPreview };

  const titlePoster = { original: landscapeOriginal, preview: landscapePreview };


  const bg=desktop?backdrop:poster

  const title = current?.title;
  const overview = current?.overview;

  let [searchParams, setSearchParams] = useSearchParams();

  const { ref: prefetchRef } = usePrefetch({
    id: current?.id,
    whileInView: !desktop,
    enabled: current?.id && !desktop,
  });

  const handleClick = useCallback(() => {
    // dispatch({
    //   type: "set modal",
    //   ...(!activated && { scroll: window.scrollY }),
    // });
    // setSearchParams({ mv: current.id });
  }, []);

  // const play = activated || expand;

  const slide = useSwiperSlide();
  const swiper = useSwiper();
  const onVideoEnded = useCallback(() => {
    swiper.slideNext();
  }, [swiper]);

  return (
    <CardContainer ref={prefetchRef}>
      <CardWrapper className={landscape ? "landscape" : "landing"}>
        <AspectBox>
          <ProgressiveImage
            original={bg.original}
            preview={bg.preview}
            alt={`${title}`}
          />
        </AspectBox>
        {desktop && (
          <Details
            title={title}
            overview={overview}
            landscapePosterPath={landscapePosterPath}
            active={slide.isActive}
          />
        )}
        {id && desktop && (
          <Youtube
            id={id}
            light={false}
            absolute
            play={slide.isActive}
            onVideoEnded={onVideoEnded}
          />
        )}
        {/* <button
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
          onClick={handleClick}
        /> */}
      </CardWrapper>
      {/* <Title>{title}</Title> */}
    </CardContainer>
  );
};

export default forwardRef(LandscapeCard);
