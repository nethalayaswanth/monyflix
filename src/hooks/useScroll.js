import { useCallback, useRef, useState } from "react";
import useEventListener from "./useEventListener";
import useLatest from "./useLatest";

export const useScroll = (options = {}) => {
  const {
    wait = 250,
    element = window,
    onScrollStart,
    onScrollEnd,
  } = useLatest(options);

  const [isScrolling, setScrolling] = useState();

  const scrolling = useRef(false);
  const timeoutRef = useRef();

  const handleScroll = useCallback(
    (e) => {
      if (scrolling.current === false) {
        if (onScrollStart) {
          onScrollStart(e);
        } else {
          console.log(`%cstart`, "color:red");
          setScrolling(true);
        }
        scrolling.current = true;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (scrolling.current === true) {
          if (onScrollEnd) {
            onScrollEnd(e);
          } else {
           console.log(`%cend`, "color:green");
            setScrolling(false);
          }
          scrolling.current = false;
        }
      }, 100);
    },
    [onScrollEnd, onScrollStart]
  );

  // const handleScroll = useMemo(
  //   () =>
  //     wait !== 0 ? throttle(() => scrollFunc(), wait) : () => scrollFunc(),
  //   [wait, scrollFunc]
  // );

  useEventListener({
    event: "scroll",
    listener: handleScroll,
    element,
    options: { passive: true },
  });

  return isScrolling;
};
