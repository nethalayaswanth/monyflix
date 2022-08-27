import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Image as Img } from "./Card/styles";

const ProgressiveImage = ({  src, style, ...props }) => {
  const [_, render] = useState();

   const Src =  `https://image.tmdb.org/t/p/original/${src}` ;
   const placeholderSrc = `https://image.tmdb.org/t/p/w300/${src}`;
 
  const srcRef = useRef(null);

  const current = placeholderSrc || Src;

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
    if(!src) return
    setLoading(true);

    const img = new Image();
    img.src = Src;
    img.onload = () => {
      srcRef.current = Src;
      render();
      setLoading(false);
    };

    return () => {};
  }, [Src, src]);

  return (
    <>
      {srcRef.current && src ? (
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
          {...props}
        />
      )}
    </>
  );
};
export default ProgressiveImage;
