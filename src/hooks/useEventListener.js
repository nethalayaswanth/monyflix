import { useEffect, useRef } from "react";
import useLatest from "./useLatest";

export default function useEventListener({
  event,
  listener,
  options,
  element = window,
}) {
  const savedHandler = useLatest(listener)
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler(event);

    element.addEventListener(event, eventListener, options);

    return () => {
      element.removeEventListener(event, eventListener, options);
    };
  }, [event, element, options, savedHandler]);
}
