import { forwardRef, useCallback, useMemo, useRef } from "react";
import ProgressiveImage from "../cachedImage";

import { useHover } from "@use-gesture/react";
import { useSwiper, useSwiperSlide } from "swiper/react";
import { useDevice } from "../../contexts/deviceContext.js.js";
import { useModalDispatch } from "../../contexts/modalContext";
import { useParamDispatch } from "../../contexts/paramContext";
import { mergeRefs } from "../../utils";
import timeConversion, { dateFormat } from "../CardModal/utils";
import { Details } from "../Landing/Details";
import Youtube from "../Youtube";
import {
  AspectBox,
  Caption,
  CardContainer,
  CardWrapper,
  Description,
  PlayIcon,
  ThumbNailHover,
} from "./styles";
import usePrefetch from "./usePrefetch";

const Card = (
  { data: current, videoCrop, cardExpand = true, cardHover = true, card },
  ref
) => {
  const { mobile, desktop } = useDevice();

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

  const landscape = card === "landscape";
  const potrait = card === "potrait";
  const landing = card === "landing";
  const thumbnail = card === "thumbnail";
  const detail = card === "detail";
  const epic = card === "epic";

  const landscapePosterPath =
    current?.landscapePosterPath ?? current?.backdropPath;
  const backdropPath = current?.backdropPath;
  const posterPath = current?.posterPath;

  const originalResolution =
    landscape || landing || epic ? "original" : potrait ? "w342" : "w780";

  const posterOriginal = posterPath
    ? `https://image.tmdb.org/t/p/${originalResolution}${posterPath}`
    : null;
  const posterPreview = posterPath
    ? `https://image.tmdb.org/t/p/w92${posterPath}`
    : null;
  const backdropOriginal = backdropPath
    ? `https://image.tmdb.org/t/p/${originalResolution}${backdropPath}`
    : null;
  const backdropPreview = backdropPath
    ? `https://image.tmdb.org/t/p/w300${backdropPath}`
    : null;
  const landscapeOriginal = landscapePosterPath
    ? `https://image.tmdb.org/t/p/w780${landscapePosterPath}`
    : null;
  const landscapePreview = landscapePosterPath
    ? `https://image.tmdb.org/t/p/w300${landscapePosterPath}`
    : null;

  const thumbnailOriginal = current?.key
    ? `https://i.ytimg.com/vi/${current?.key}/hqdefault.jpg`
    : null;
  const thumbnailPreview = current?.key
    ? `https://i.ytimg.com/vi/${current?.key}/mqdefault.jpg`
    : null;

  const thumbnailPoster = {
    original: thumbnailOriginal,
    preview: thumbnailPreview,
  };
  const backdrop = { original: backdropOriginal, preview: backdropPreview };

  const poster = { original: posterOriginal, preview: posterPreview };

  const titlePoster = {
    original: landscapeOriginal,
    preview: landscapePreview,
  };

  const bg = {
    potrait: poster,
    thumbnail: thumbnailPoster,
    detail: titlePoster,
    card: poster,
    landscape: desktop ? backdrop : poster,
    landing: desktop ? backdrop : poster,
    epic: titlePoster,
  };

  const src = bg[card];

  const movieId = current?.id;
  const title = thumbnail ? current.name : current?.title;
  const overview = current?.overview;

  const year = current?.releaseDate;
  const runTime = current?.runtime;

  const showVideo = id && desktop && (landing || landscape);

  const hoverEnabled = !(landing || landscape || epic) ? cardHover : false;
  const expandEnabled =  cardExpand 

  const clearTimer = useCallback(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
  }, []);

  const setTimer = useCallback(
    (cb, delay = 500) => {
      clearTimer();
      timeOutRef.current = setTimeout(() => {
        cb();
      }, delay);
    },
    [clearTimer]
  );

  const miniRef = useRef();

  const timeOutRef = useRef();

  const prevFetchEnabled = movieId && (!desktop || landing || landscape);

  const { ref: prefetchRef } = usePrefetch({
    id: movieId,
    whileInView: !desktop,
    enabled: prevFetchEnabled,
  });

  const [stateRef, dispatch] = useModalDispatch();

  const handleHovering = useCallback(
    (hovering) => {
      if (!hovering) {
        clearTimer();
        return;
      }
      const showMini = () => {
        const { height, width } = miniRef.current.getBoundingClientRect();

        dispatch({
          type: "set modal",
          payload: {
            movie: current,
            parent: miniRef.current,
            overlay: src?.original,
            cardState: "mini",
            card: detail ? "detail" : "potrait",
            aspectRatio: width / height,
          },
        });
      };

      if (stateRef.current.small) {
        showMini();
        return;
      }

      setTimer(showMini);
    },
    [clearTimer, current, detail, dispatch, setTimer, src?.original, stateRef]
  );

  const bind = useHover((state) => {
    if (!current || !hoverEnabled || !desktop) return;
    handleHovering(state.hovering);
  });

  const setSearchParams = useParamDispatch();

  const miniRefCb = useCallback((node) => {
    if (!node) return;
    miniRef.current = node;
  }, []);

  const handleClick = useCallback(async () => {
    if (!current) return;

    if (thumbnail) {
      dispatch({
        type: "set modal",
        payload: {
          videoId: current?.key,
          title: title,
        },
      });
      return;
    }
    if (expandEnabled) {
      const { height, width } = miniRef.current.getBoundingClientRect();
      dispatch({
        type: "set modal",
        payload: {
          movie: current,
          parent: miniRef.current,
          overlay: src.original,
          aspectRatio: width / height,
        },
      });
    } else {
      if (stateRef.current.expanded) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }
    const { searchParams } = new URL(window.location.href);
    searchParams.set("mv", movieId);

    setSearchParams(searchParams);
  }, [
    current,
    dispatch,
    expandEnabled,
    movieId,
    setSearchParams,
    src.original,
    stateRef,
    thumbnail,
    title,
  ]);

  const slide = useSwiperSlide();
  const swiper = useSwiper();
  const onVideoEnded = useCallback(() => {
    swiper.slideNext();
  }, [swiper]);

  const showTitlePoster = landing || landscape;
  const caption = epic || thumbnail;

  return (
    <CardContainer
      className={`${card}`}
      card={card}
      ref={mergeRefs(ref, prefetchRef)}
      hoverEnabled={hoverEnabled}
    >
      <CardWrapper onClick={handleClick} {...bind()} className={"card-wrapper"}>
        <AspectBox ref={miniRefCb} className={"backdrop"}>
          <ProgressiveImage
            original={src?.original}
            preview={src?.preview}
            alt={`${title}`}
          />
          {thumbnail && (
            <ThumbNailHover>
              <PlayIcon />
            </ThumbNailHover>
          )}
        </AspectBox>
        {desktop && showTitlePoster && (
          <Details
            title={title}
            overview={overview}
            landscapePosterPath={landscapePosterPath}
            trigger={slide?.isActive}
          />
        )}
        {detail && (
          <Description.Wrapper>
            <Description.Title>{current?.title}</Description.Title>

            <Description.Overview>{current?.overview}</Description.Overview>
            <Description.MetaData>
              {year && <span>{dateFormat(year)}</span>}
              {runTime && <span>{timeConversion(runTime)}</span>}
              {current?.adult && (
                <span>
                  <Description.Badge>
                    {current?.adult ? "U/A 13+" : "U/A 18+"}
                  </Description.Badge>
                </span>
              )}
            </Description.MetaData>
          </Description.Wrapper>
        )}

        {caption && <Caption>{title}</Caption>}
        {slide?.isActive && showVideo && (
          <Youtube
            key={id}
            id={id}
            light={false}
            absolute
            crop={videoCrop}
            play={slide?.isActive}
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
    </CardContainer>
  );
};

export default forwardRef(Card);
