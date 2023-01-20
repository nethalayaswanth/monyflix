import { useCallback, useRef, useState } from "react";
import usePrevious from "./usePrevious"
const useHover = () => {
  const [isHovering, setIsHovering] = useState();
  
 const prevHoveringState= usePrevious(isHovering)
  const handleMouseOver = useCallback(
    (e) => {
     if(!prevHoveringState){
setIsHovering(true);
     }
      
    },
    [setIsHovering,prevHoveringState]
  );

  const handleMouseOut = useCallback(
    (e) => {
       if(prevHoveringState){
setIsHovering(false);
     }
    },
    [setIsHovering,prevHoveringState]
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
