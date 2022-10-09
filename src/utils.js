

export const mergeRefs = (...refs) => {
  return (node) => {
    for (const ref of refs) {

      if (typeof ref === "function") {
        ref(node);
        
      }else if (ref) {
        ref.current = node;
      }
    }
  };
};