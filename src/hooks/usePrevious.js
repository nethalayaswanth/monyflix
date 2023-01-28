
import { useCallback, useRef } from "react";
import isEqual from 'lodash/isEqual'

export default function usePrevious(value) {
  
   const ref = useRef({
    value: value,
    prev: null,
  });

  const current = ref.current.value;



  if (!isEqual(value,current)) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  
  return ref.current.prev}