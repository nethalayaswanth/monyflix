import { useEffect, useState } from "react";
import styled from "styled-components";
import Shimmer from "./shimmer";

export const Img = styled(Shimmer)`
  object-fit: contain;
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  left: 0;
  object-fit: cover;
  z-index: 5;
`;

const ProgressiveImage = ({original, preview, style,onFetch, ...props }) => {

  const current = preview || original;

  const [url, setUrl] = useState(current);
 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    setUrl(current);
     onFetch?.(current);
  }, [current, onFetch]);

  useEffect(() => {
    if (!original) return;
    setLoading(true);
    const img = new Image();
    img.src = original;
    img.onload = (e) => {
      onFetch?.(original);
      setUrl(original);
      setLoading(false);
    };
  }, [onFetch, original]);


  return (
    <>
      {current ? (
        <Img
          {...(url && { src: url, ...props })}
          style={{
            ...style,
            // opacity: loading ? 0.8 : 1,
           
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
