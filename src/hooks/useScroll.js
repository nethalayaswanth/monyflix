import { useState, useCallback, useMemo, useRef } from "react";
import throttle from "lodash/throttle";
import useEventListener from "./useEventListener";

export const useScroll = (options) => {
  const { wait, element } = useMemo(
    () => ({
      wait: 250,
      element: window,
      ...options,
    }),
    [options]
  );

  const scrolling = useRef(false);

  const scrollFunc = useCallback(() => {
    if (!scrolling.current) {
      scrolling.current = false;
    }

    scrolling.current = true;
  }, []);

  const handleScroll = useMemo(
    () =>
      wait !== 0 ? throttle(() => scrollFunc(), wait) : () => scrollFunc(),
    [wait, scrollFunc]
  );

  useEventListener({
    event: "scroll",
    handler: handleScroll,
    element,
    options: { passive: true },
  });
};
