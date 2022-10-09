import { useCallback, useLayoutEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";
import useHover from "../../hooks/useHover";
import { getMovieDetails, getVideosById } from "../../requests/requests";
import { mergeRefs } from "../../utils";

export default function usePrefetch({
  id,
  whileInView = false,
  whileHover = true,
  enabled,
}) {
  const fetched = useRef();
  const queryClient = useQueryClient();

  const handlePrefetch = useCallback(async () => {
    if (fetched.current) return;
  
    const types = ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"];
    queryClient.prefetchQuery(
      ["movie", id],
      async () => getMovieDetails({ id: id }),
      { staleTime: "Infinity" }
    );
    queryClient.prefetchQuery(
      ["videos", id, types],
      async () => getVideosById({ id: id, types }),
      { staleTime: "Infinity" }
    );
  }, [id, queryClient]);

  const [hoverRef, isHovering] = useHover();

  const {
    ref: inViewRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useLayoutEffect(() => {
    if (fetched.current) return;
    if (whileInView && inView) {
      if (enabled) {
        handlePrefetch();
        fetched.current = true;
        return;
      }
    }
    if (whileHover && isHovering) {
      if (enabled) {
        handlePrefetch();
        fetched.current = true;
        return;
      }
    }
  }, [enabled, handlePrefetch, inView, isHovering, whileHover, whileInView]);

  return { ref: mergeRefs(hoverRef, inViewRef), handlePrefetch };
}
