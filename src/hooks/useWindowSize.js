import { useEffect, useState } from "react";

export default function useWindowSize() {
  const isSSR = typeof window !== "undefined";
  const [windowSize, setWindowSize] = useState({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });

  function changeWindowSize() {
    setWindowSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
  }

  useEffect(() => {
    window.addEventListener("resize", changeWindowSize);

    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  }, []);

  return windowSize;
}
