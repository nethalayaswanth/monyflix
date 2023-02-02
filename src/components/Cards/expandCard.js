import React, { forwardRef, useCallback, useRef } from "react";

import AspectBox from "../AspectBox";

import { useHover } from "@use-gesture/react";

import { useModalDispatch } from "../../contexts/modalContext";
import useMedia from "../../hooks/useBreakpoint";
import { mergeRefs } from "../../utils";
import ProgressiveImage from "../cachedImage";
import { CardContainer as CardOuter } from "./styles";
import usePrefetch from "./usePrefetch";

const CardView = forwardRef(
  ({ style, handleClick, miniRef, original, preview, movie, bind }, ref) => {
    return (
      <CardOuter
        ref={ref}
        {...bind?.()}
        style={{
          boxShadow: "0 4px 7px rgb(0 0 0 / 25%)",
          marginBottom: "8px",
          overflow: "hidden",
          borderRadius: "6px",
          ...(style && style),
        }}
        potrait
        id="card-mini"
        onClick={() => {
          handleClick?.();
        }}
      >
        {
          <AspectBox ref={miniRef} potrait>
            <ProgressiveImage
              original={original}
              preview={preview}
              alt={`${movie?.title}`}
            />
          </AspectBox>
        }
      </CardOuter>
    );
  }
);

const ExpandCard = forwardRef(({ id, style, data: movie }, ref) => {
  const dispatch = useModalDispatch();

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const miniRef = useRef();

  const timeOutRef = useRef();
 
    const src = movie?.posterPath;

    const original = src ? `https://image.tmdb.org/t/p/w342${src}` : null;
    const preview = src ? `https://image.tmdb.org/t/p/w92${src}` : null;

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
            movie: movie,
            parent: miniRef.current,
            mini: true,
            aspectRatio: 2 / 3,
            overlay: original,
          },
        });
      };

      // if (mini) {
      //   showMini();
      //   return;
      // }

      setTimer(showMini);
    },
    [clearTimer, dispatch, movie, original, setTimer]
  );

  const bind = useHover((state) => {
    if (movie && desktop) {
      handleHovering(state.hovering);
    }
  });

  // let [searchParams, setSearchParams] = useSearchParams();

  const miniRefCb = useCallback((node) => {
    if (!node) return;
    miniRef.current = node;
  }, []);

  const handleClick = useCallback(async () => {
    if (desktop || !movie) return;
    dispatch({
      type: "set modal",
      payload: {
        movie: movie,
        parent: miniRef.current,
        clicked: true,
      },
    });
    // setSearchParams({ mv: movie?.id });
  }, [ desktop, dispatch, movie, ]);

  const { ref: prefetchRef, handlePrefetch } = usePrefetch({
    id: movie?.id,
    whileInView: !desktop,
    enabled: movie?.id,
  });



  const cardProps = {
    original,
    preview,
    handleClick,
    movie,
    miniRef: miniRefCb,
    ref: mergeRefs(ref, prefetchRef),
    bind,
    style,
  };

  return <CardView {...cardProps} />;
});

export const CardHolder = ({ style, index }) => {
  return (
    <CardOuter
      style={{
        boxShadow: "0 4px 7px rgb(0 0 0 / 25%)",
        marginBottom: "8px",
        overflow: "hidden",
        borderRadius: "6px",
        ...style,
      }}
      potrait
      id="card-holder"
    >
      <AspectBox potrait>
        <ProgressiveImage width="100%" height="100%" delay={index * 300} />
      </AspectBox>
    </CardOuter>
  );
};

export default ExpandCard;
