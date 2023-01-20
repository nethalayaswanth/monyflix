import { useCallback, useState } from "react";
import useResizeObserver from "use-resize-observer";
import usePrevious from "./usePrevious";

const breakpointsDefault = [420, 540, 740, Infinity];

const defaultValues = ["mobile", "sm", "md", "desktop"];

const defaultvalue = "mobile";

function useDevice({
  breakPoints = breakpointsDefault,
  breakPointValues = defaultValues,
  defaultValue = defaultvalue,
  observeDimensions=false,
  ref = document.body,
} = {}) {

const [value, setValue] = useState(defaultValue);
  useResizeObserver({
    ref,
    onResize:
      ({ width,height }) => {
        for (let i = 0; i < breakPoints.length; i++) {
          if (width <= breakPoints) {
            setValue(breakPointValues[i]);
            break;
          }
        }
      }
  });

  return value;
}

export default useDevice;
