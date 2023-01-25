
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useImage } from "../contexts/imageCachingContext";
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
`;


const ProgressiveImage = ({ original, preview, style, onFetch, ...props }) => {
 
const {data,isLoading}= useImage({src:original,preview})

console.log(data)


  return (
    <Img
      src={data}
      as={!data?"div":'img'}
      style={{
        ...style,
        opacity: isLoading ? 0.8 : 1,

        transition: "opacity .15s linear ",
      }}
      alt={props.alt || " "}
    />
  );
};
export default ProgressiveImage;