
import { useCallback, useRef } from "react";

export default function usePrevious(value) {
  
   const ref = useRef({
    value: value,
    prev: null,
  });

  const current = ref.current.value;



  if (value !== current) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  
  return ref.current.prev}