import { useCallback } from "react";
import {
  Children,
  memo,
  useMemo,
  cloneElement,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import usePrevious from "../hooks/usePrevious";

export const calculateBoundingBoxes = (children) => {
  
  const boundingBoxes = {};
  children.forEach(([key, child]) => {
    const domNode = child;
    if (!domNode) return;
    const nodeBoundingBox = domNode.getBoundingClientRect();

    boundingBoxes[key] = nodeBoundingBox;
  });

  return boundingBoxes;
};

const ListOrderAnimation = memo(({ children }) => {
  const arrayRefs = useRef({});
  const [boundingBox, setBoundingBox] = useState({});

  const [prevBoundingBox] = usePrevious(boundingBox);

  useLayoutEffect(() => {
    if (!arrayRefs.current) return;
    const newBoundingBox = calculateBoundingBoxes(
      Object.entries(arrayRefs.current)
    );
    setBoundingBox(newBoundingBox);
  }, [children]);

  useLayoutEffect(() => {
  
    if (!prevBoundingBox || Object.keys(arrayRefs.current).length === 0) return;
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;

    if (hasPrevBoundingBox) {
      Object.entries(arrayRefs.current).forEach(([key, child]) => {
        const domNode = child;

        const firstBox = prevBoundingBox[key];
        const lastBox = boundingBox[key];

        if (!firstBox || !lastBox) {
          return;
        }
        const changeInY = firstBox.top - lastBox.top;

        if (changeInY) {
          requestAnimationFrame(() => {
            domNode.style.transform = `translateY(${changeInY}px)`;
            domNode.style.transition = "transform 0s";

            requestAnimationFrame(() => {
              domNode.style.transform = "";
              domNode.style.transition = "transform 300ms";
            });
          });
        }
      });
    }
  }, [boundingBox, prevBoundingBox]);

  const refCb = useCallback((key) => {
    return {
      ref: (node) => {
        arrayRefs.current[key] = node;
      },
    };
  }, []);
  return (
    <>
      {Children.map(children, (child, index) => {
        return cloneElement(child, { id: child.key, ...refCb(child.key) });
      })}
    </>
  );
});

export default memo(ListOrderAnimation);
