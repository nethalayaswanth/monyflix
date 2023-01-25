import { useCallback, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";

const breakpointsDefault = [300, 480, 740];

const defaultValues = ["mobile", "tablet", "desktop"];

const defaultvalue = "desktop";

function useMedia({
  breakPoints = breakpointsDefault,
  breakPointValues = defaultValues,
  defaultValue = defaultvalue,
  ref = document.body,
} = {}) {
  const getValue = useCallback(
    (width) => {
      const index = [...breakPoints].reverse().findIndex((bp) => bp <= width);

      return index !== -1
        ? [...breakPointValues].reverse()[index]
        : defaultValue;
    },
    [breakPointValues, breakPoints, defaultValue]
  );

  const [value, setValue] = useState(() => getValue(document.body.clientWidth));
  const valueRef = useRef();

  const { width } = useResizeObserver({
    ref,
  });

  useLayoutEffect(() => {
    if (!width) return;
    const value = getValue(width);

    if (valueRef.current !== value) {
      valueRef.current = value;
      setValue(value);
    }
  }, [breakPointValues, breakPoints, defaultValue, getValue, width]);
  return value;
}

export default useMedia;
