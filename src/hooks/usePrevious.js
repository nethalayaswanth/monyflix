
import { useCallback, useEffect,useRef} from "react";

export default function usePrevious(value) {
  
   const ref = useRef({
    value: value,
    prev: null,
  });

  const current = ref.current.value;

const reset=useCallback(()=>{
  ref.current = {
    value: null,
    prev: null,
  }
},[])

  if (value !== current) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  
  return [ref.current.prev, reset];}