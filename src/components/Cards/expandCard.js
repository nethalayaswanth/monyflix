import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AspectBox from "../AspectBox";

import { useHover } from "@use-gesture/react";

import { useSearchParams } from "react-router-dom";
import { useModalState } from "../../contexts/modalContext";
import useMedia from "../../hooks/useMedia";
import { mergeRefs } from "../../utils";
import ProgressiveImage from "../ProgressiveImage";
import { CardWrapper as CardOuter } from "./styles";
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
  const [{ activated, expand, open, enabled, expanded }, dispatch] =
    useModalState();

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const miniRef = useRef();
  const [isHovering, setHovering] = useState();
  const bind = useHover((state) => {
    if (movie) {
      setHovering(state.hovering);
    }
  });

  let [searchParams, setSearchParams] = useSearchParams();

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
        ...(!activated && { scroll: window.scrollY }),
      },
    });
    setSearchParams({ mv: movie?.id });
  }, [activated, desktop, dispatch, movie, setSearchParams]);

  const { ref: prefetchRef, handlePrefetch } = usePrefetch({
    id: movie?.id,
    whileInView: !desktop,
    enabled: movie?.id,
  });

  useEffect(() => {
    if (isHovering === undefined || activated || !enabled || !desktop || !movie)
      return;
    if (!isHovering) return;

    const { top } = miniRef.current.getBoundingClientRect();

    if (top < 0) return;

    const timeOut = setTimeout(async () => {
      dispatch({
        type: "set modal",
        payload: {
          movie: movie,
          parent: miniRef.current,
          activate: true,
          hovered: true,
          open: true,
          scroll: window.scrollY,
        },
      });
    }, 200);

    return () => {
      clearTimeout(timeOut);
    };
  }, [dispatch, isHovering, activated, desktop, movie, enabled]);

  const src = movie?.posterPath;

  const original = src ? `https://image.tmdb.org/t/p/original${src}` : null;
  const preview = src ? `https://image.tmdb.org/t/p/w300${src}` : null;

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
        width: "200px",
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
