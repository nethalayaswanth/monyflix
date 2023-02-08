import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const defaultOptions = {
  threshold: 0,
  root: null,
  rootMargin: "0%",
  triggerOnce: true,
};

function useIntersectionObserver({ options } = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const elementRef = useRef();
  const optionsRef=useRef()

  const cbRef = useCallback((node) => {
    elementRef.current = node;
     if (!elementRef.current) return;
  const { triggerOnce,onChange, ...intersectionOptions } = optionsRef.current;

     const ob = new IntersectionObserver(
       (entries) => {
    
         if (triggerOnce) {
           const hasIntersected = entries.some((x) => x.isIntersecting);
           if (hasIntersected) {
            const entry=entries[0]
             ob.disconnect();
             if (onChange){onChange({entry,inView:entry.isIntersecting});return}
              setIsIntersecting(hasIntersected);
           }

           return;
         }
         const isIntersecting = entries.some((x) => x.isIntersecting);
   if (onChange) {
    //  onChange({ entry, inView: entry.isIntersecting });
     return;
   }
         setIsIntersecting(isIntersecting);
       },
       {
         ...intersectionOptions,
       }
     );

  }, []);

  const overrideOptions = useMemo(() => {
    return { ...defaultOptions, ...(options && options) };
  }, [options]);

optionsRef.current = overrideOptions;

  // useEffect(() => {
  //   if (!elementRef.current) return;

  //   const { triggerOnce, ...intersectionOptions } = optionsRef.current;

  //   let isUnmounted = false;
  //   const ob = new IntersectionObserver(
  //     (entries) => {
  //       if (isUnmounted) return;
  //       if (triggerOnce) {
  //         const hasIntersected = entries.some((x) => x.isIntersecting);
  //         if (hasIntersected) {
  //           ob.disconnect();
  //           setIsIntersecting(hasIntersected);
  //         }

  //         return;
  //       }
  //       const isIntersecting = entries.some((x) => x.isIntersecting);

  //       setIsIntersecting(isIntersecting);
  //     },
  //     {
  //       ...intersectionOptions,
  //     }
  //   );
  //   if (elementRef.current) ob.observe(elementRef.current);

  //   return () => {
  //     ob.disconnect();
  //     isUnmounted = true;
  //   };
  // }, [overrideOptions]);

  return { ref: cbRef, inView: isIntersecting };
}

export default useIntersectionObserver;
