import { useCallback, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";

const breakpointsDefault = [0, 480, 740];

const defaultValues = ["mobile", "tablet", "desktop"];

const defaultvalue = "desktop";

function useBreakpoint({
  breakPoints = breakpointsDefault,
  breakPointValues = defaultValues,
  defaultValue = defaultvalue,
  ref = document.body,
} = {}) {
  const getValue = useCallback(
    (width) => {

      if(!breakPointValues) return defaultValue 
      const index = [...breakPoints].reverse().findIndex((bp) => bp <= width);

      const value =  [...breakPointValues].reverse()[index] ?? defaultValue;
      return value;
    },
    [breakPointValues, breakPoints, defaultValue]
  );

  const [value, setValue] = useState(() => getValue(document.body.clientWidth));
  const valueRef = useRef();

  useResizeObserver({
    ref,onResize:({width})=>{
    const value = getValue(width);

    if (valueRef.current !== value) {
      valueRef.current = value;
      setValue(value);
    }}
  });

 
  // useLayoutEffect(() => {
   
  // }, [breakPointValues, breakPoints, defaultValue, getValue, width]);
  return value;
}

export default useBreakpoint;
