import { useEffect, useRef } from "react";
import useLatest from "./useLatest";

export default function useTimeout(callback, delay = null) {
 const savedCallback = useLatest(callback)

  useEffect(() => {
    if (delay===null) {
      return;
    }
    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay, savedCallback]);
}
