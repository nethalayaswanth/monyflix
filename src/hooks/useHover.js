import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import isEqual from "lodash/isEqual";

const useHover = () => {
  const [isHovering, setIsHovering] = useState();
  const handleMouseOver = useCallback(
    (e) => {
      setIsHovering(true);
    },
    [setIsHovering]
  );

  const handleMouseOut = useCallback(
    (e) => {
      setIsHovering(false);
    },
    [setIsHovering]
  );

  const nodeRef = useRef();

  // useEffect(() => {
  //   if (nodeRef.current) {
  //
  //     nodeRef.current.addEventListener("mouseenter", handleMouseOver);
  //     nodeRef.current.addEventListener("mouseleave", handleMouseOut);
  //   }

  //   return () => {
  //     if (nodeRef.current) {
  //
  //       nodeRef.current.removeEventListener("mouseenter", handleMouseOver);
  //       nodeRef.current.removeEventListener("mouseleave", handleMouseOut);
  //     }
  //   };
  // }, [handleMouseOver, handleMouseOut]);

  const callbackRef = useCallback(
    (node) => {
      if (!node) return;

      if (nodeRef.current) {
        nodeRef.current.removeEventListener("mouseenter", handleMouseOver);
        nodeRef.current.removeEventListener("mouseleave", handleMouseOut);
      }

      nodeRef.current = node;

      if (nodeRef.current) {
        nodeRef.current.addEventListener("mouseenter", handleMouseOver);
        nodeRef.current.addEventListener("mouseleave", handleMouseOut);
      }
    },
    [handleMouseOver, handleMouseOut]
  );

  return [callbackRef, isHovering];
};

export default useHover;
