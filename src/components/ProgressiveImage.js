import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Image as Img } from "./Card/styles";

const ProgressiveImage = ({ placeholderSrc, src, style, ...props }) => {
  const [_, render] = useState();

  const srcRef = useRef(null);

  const current = placeholderSrc || src;
  
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
     if (!current) {
       srcRef.current = null;
       return;
     }
    
    srcRef.current = current;
    render();
  }, [current]);

  useEffect(() => {
    setLoading(true)
   let timeout
    const img = new Image();
    img.src = src;
    img.onload = () => {
timeout=setTimeout(()=>{srcRef.current = src;
render();
setLoading(false);},500)
      
    };

   return ()=>{clearTimeout(timeout);}
  }, [src]);

  return (
    <>
      {srcRef.current&&current ? (
        <Img
          {...(current && { src: srcRef.current, ...props })}
          style={{
            ...style,
            opacity: loading ? 0.8 : 1,
            transition: "opacity .15s linear ",
          }}
          alt={props.alt || " "}
        />
      ) : (
        <Img
          as="div"
          style={{
            ...style,
          }}
        />
      )}
    </>
  );
};
export default ProgressiveImage;
