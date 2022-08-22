import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const defaultOptions = {
  threshold: 0,
  root: null,
  rootMargin: "0%",
  triggerOnce: true,
};

function useIntersectionObserver({ options } = {}) {
  const [isIntersecting, setIsIntersecting] = useState(undefined);

  const elementRef = useRef();

  const cbElRef = useCallback((node) => {
    elementRef.current = node;
  }, []);

  const overrideOptions = useMemo(() => {
    return { ...defaultOptions, ...(options && options) };
  }, [options]);

  useEffect(() => {
    if (!elementRef.current) return;

    const { triggerOnce, ...intersectionOptions } = overrideOptions;
    
    let isUnmounted = false;
    const ob = new IntersectionObserver(
      (entries) => {
        if (isUnmounted) return;
        if (triggerOnce) {
          const hasIntersected = entries.some((x) => x.isIntersecting);
          if (hasIntersected) {
            ob.disconnect();
            setIsIntersecting(hasIntersected);
          }

          return;
        }
        const isIntersecting = entries.some((x) => x.isIntersecting);

        setIsIntersecting(isIntersecting);
      },
      {
        ...intersectionOptions,
      }
    );
    if (elementRef.current) ob.observe(elementRef.current);

    return () => {
      ob.disconnect();
      isUnmounted = true;
    };
  }, [overrideOptions, elementRef.current]);

  return [isIntersecting, cbElRef];
}

export default useIntersectionObserver;
