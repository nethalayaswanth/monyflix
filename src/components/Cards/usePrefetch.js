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
      async () => getMovieDetails({ id: parseInt(id) }),
      { staleTime: 3600 * 1000, cacheTime: 3600 * 1000 }
    );
    queryClient.prefetchQuery(
      ["videos", id, types],
      async () => getVideosById({ id: parseInt(id), types }),
      { staleTime: 3600 * 1000 }
    );
  }, [id, queryClient]);

  const [hoverRef] = useHover({
    onHover: (hovering) => {
      if (fetched.current) return;
      if (whileHover && hovering) {
        if (enabled) {
          handlePrefetch();
          fetched.current = true;
          return;
        }
      }
    },
  });

  const { ref: inViewRef } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    onChange: (inView, entry) => {
       if (whileInView && inView) {
         if (enabled) {
           handlePrefetch();
           fetched.current = true;
           return;
         }
       }
    },
  });


  return { ref: mergeRefs(hoverRef, inViewRef), handlePrefetch };
}
