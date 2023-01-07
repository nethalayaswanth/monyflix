import throttle from "lodash/throttle";
import { useCallback, useMemo, useRef, useState } from "react";
import useEventListener from "./useEventListener";
import useLatest from "./useLatest";

export const useScroll = (options) => {

   
  const { wait = 250, element = window,  onScrollStart, onScrollEnd } = useLatest(options);

  const [isScrolling,setScrolling]=useState()

  const scrolling = useRef(false);
  const timeoutRef = useRef();

console.log(`%c${isScrolling}`,'color:red')

  const handleScroll = useCallback((e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (scrolling.current === false) {
      if (onScrollStart) {
        onScrollStart(e);
      } else {
        setScrolling(true);
      }
      scrolling.current = true;
 
      timeoutRef.current = setTimeout(() => {
        if (onScrollEnd) {
          onScrollEnd(e);
        } else {
          setScrolling(false);
        }
        scrolling.current = false;
      }, 0);
    }
  }, [onScrollEnd, onScrollStart]);

  // const handleScroll = useMemo(
  //   () =>
  //     wait !== 0 ? throttle(() => scrollFunc(), wait) : () => scrollFunc(),
  //   [wait, scrollFunc]
  // );

  useEventListener({
    event: "scroll",
    handler: handleScroll,
    element,
    options: { passive: true },
  });


  return isScrolling
};
