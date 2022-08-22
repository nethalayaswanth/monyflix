import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import isEqual from "lodash/isEqual";

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

  useLayoutEffect(() => {
     
      `%cisHovering:${isHovering}`,

      "color:black;background-color:red;"
    );

     
  }, [isHovering]);

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
