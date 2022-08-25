import { useEffect, useRef } from "react";

export default function useEventListener({
  event,
  listener,
  options,
  element = window,
}) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = listener;
  }, [listener]);
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);

    element.addEventListener(event, eventListener);

    return () => {
      element.removeEventListener(event, eventListener, options);
    };
  }, [event, element, options]);
}
