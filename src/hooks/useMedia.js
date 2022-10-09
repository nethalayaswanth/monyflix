import { useCallback, useLayoutEffect, useState } from "react";

const breakpointsDefault = [740, 480, 300];

const queryStrings = (breakpoints = []) =>
  breakpoints.map((breakPoint) => `(min-width:${breakPoint}px)`);

const defaultValues = ["desktop", "tablet", "mobile"];

const defaultvalue = "desktop";

function useMedia({
  breakPoints = breakpointsDefault,
  breakPointValues = defaultValues,
  defaultValue = defaultvalue,
} = {}) {
  const queries = queryStrings(breakPoints);
  const mediaQueryLists = queries.map((q) => window.matchMedia(q));

  const getValue = () => {
   
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    return typeof breakPointValues[index] !== "undefined"
      ? breakPointValues[index]
      : defaultValue;
  };
  const [value, setValue] = useState(getValue);

  useLayoutEffect(() => {
    const handler = () => {
      setValue(getValue);
    };

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener("change", handler);
    });
    return () =>
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", handler);
      });
  }, []);
  return value;
}

export default useMedia;
