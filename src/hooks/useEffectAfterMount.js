import { useLayoutEffect, useRef } from "react";

export function useLayoutEffectAfterMount(effect, deps) {
  const isFirstRun = useRef(true);
  
  useLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (effect) return effect();
  }, deps);
}
