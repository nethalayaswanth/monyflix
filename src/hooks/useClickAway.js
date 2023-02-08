import { useRef, useEffect, useCallback, createElement } from "react";

const useOutsideClick = ({ onOutsideClick }) => {
  const clickCaptured = useRef();

  const handleClick = useCallback(
    (e) => {
      if (!clickCaptured.current && onOutsideClick) {
        onOutsideClick?.();
      }

      clickCaptured.current = false;
    },
    [onOutsideClick]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [handleClick]);

  const innerClick = () => {
    clickCaptured.current = true;
    
  };

  const clickAwayProps = () => {
    return {
      onMouseDown: innerClick,
      onTouchStart: innerClick,
    };
  };

  return clickAwayProps;
};

export default useOutsideClick;
