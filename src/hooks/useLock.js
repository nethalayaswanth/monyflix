
import { useRef,useCallback } from "react"




export default function useScrollLock(id='app'){
 const scroll = useRef();
 const body = useRef();
 const main = useRef();


 const lockBody = useCallback(() => {
   const main = document.getElementById(id);
   main.current=main.style
   body.current = document.body.style;
   const scrollY = window.scrollY;
   scroll.current = scrollY;
   document.body.style.overflowY = "scroll";
   main.style.top = `-${scrollY}px`;
   main.style.position = "fixed";

   window.scroll({
     top: 0,
     left: 0,
   });
 }, [id]);

 const unlockBody = useCallback(() => {
   const main = document.getElementById(id);
   main.style.top = "unset";
   main.style.position = "static";
   
   if (body.current) document.body.style = body.current;
   if (scroll.current) {
     window.scroll({
       top: scroll.current,
       left: 0,
     });
   }
 }, [id]);


 return {lockBody,unlockBody,scroll:scroll.current,body:body.current}

    
}