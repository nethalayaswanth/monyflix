import { useCallback, useLayoutEffect, useRef, useState } from "react";

import throttle from "lodash/throttle";
import { useMemo } from "react";
import useLatest from "./useLatest";

const isBrowser = typeof window !== `undefined`;
const zeroPosition = { x: 0, y: 0 };

export const useScrollPosition = ({ onScrollChange, wait = 400 } = {}) => {
  const position = useRef({ x: window.scrollX, y: window.scrollY });
  const [isScrolling, setScrolling] = useState(false);

  const scrollRef = useRef(false);
  const timeoutRef = useRef();

  const onScrollRef = useLatest(onScrollChange);

  const handleScrollChange = useCallback(() => {
    if (scrollRef.current === false) {
      setScrolling(true);
      scrollRef.current = true;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setScrolling(false);
        scrollRef.current = false;
      }, 400);
    }
  }, []);

  const callBack = useCallback(() => {
    const currPos = window.scrollY;


      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        scrollRef.current = false;
        onScrollRef.current?.({
          prevPos: position.current,
          currPos,
          scrolling: false,
        });
      }, 400);
    
     onScrollRef.current?.({ prevPos: position.current, currPos,scrolling:true })
     position.current = currPos;
  }, [onScrollRef]);

  const throttlFn = useMemo(() => {
    return throttle(callBack, wait);
  }, [callBack, wait]);

  useLayoutEffect(() => {
    if (!isBrowser) {
      return undefined;
    }
    const handleScroll = () => {
      callBack();
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollRef, wait]);

  const returnValue = [position, isScrolling];

  returnValue.position = position;
  returnValue.isScrolling = isScrolling;
  return returnValue;
};
