import { useCallback, useEffect, useRef, useState } from "react";

const useHoverBubble = () => {
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


  useEffect(() => {
    if (nodeRef.current) {
       
      nodeRef.current.addEventListener("mouseover", handleMouseOver);
      nodeRef.current.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (nodeRef.current) {
         
        nodeRef.current.removeEventListener("mouseover", handleMouseOver);
        nodeRef.current.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, [handleMouseOver, handleMouseOut]);

  const callbackRef = useCallback((node) => {
    if (!node) return;
    nodeRef.current = node;
  }, []);

  
  return [callbackRef, isHovering];
};

export default useHoverBubble;
