import { useCallback, useRef, useState } from "react";
import useLatest from "./useLatest";
import usePrevious from "./usePrevious";
const useHover = ({ onHover }={}) => {
  const [isHovering, setIsHovering] = useState();

  const prevHoveringState = usePrevious(isHovering);

 const onHoverCallBack=useLatest(onHover)
  const handleMouseOver = useCallback(
    (e) => {
      if (onHoverCallBack.current) {
        onHoverCallBack.current(true)
        return
      }
        if (!prevHoveringState) {
          setIsHovering(true);
        }
    },
    [onHoverCallBack, prevHoveringState]
  );

  const handleMouseOut = useCallback(
    (e) => {
       if (onHoverCallBack.current) {
         onHoverCallBack.current(true);
         return
       }
      if (prevHoveringState) {
        setIsHovering(false);
      }
    },
    [onHoverCallBack, prevHoveringState]
  );

  const nodeRef = useRef();

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
