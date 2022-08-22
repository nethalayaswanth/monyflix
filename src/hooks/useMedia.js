import { useState, useEffect } from "react";

const Queries = 
  ["(min-width: 740px)", "(min-width: 480px)", "(min-width: 300px)"]
;

const Values= ["desktop", "tablet", "mobile"];

const defaultalue = "desktop";

 function useMedia(
   queries = Queries,
   values = Values,
   defaultValue = defaultalue
 ) {
   const mediaQueryLists = queries.map((q) => window.matchMedia(q));
   const getValue = () => {
     const index = mediaQueryLists.findIndex((mql) => mql.matches);
     return typeof values[index] !== "undefined" ? values[index] : defaultValue;
   };
   const [value, setValue] = useState(getValue);

   useEffect(() => {
     const handler = () => setValue(getValue);
     mediaQueryLists.forEach((mql) => mql.addListener(handler));
     return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
   }, []);
   return value;
 }

export default useMedia;