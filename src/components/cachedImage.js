
import { useEffect, useLayoutEffect,useRef, useState } from "react";
import styled from "styled-components";
import { useImage } from "../contexts/imageCachingContext";
import Shimmer from "./shimmer";
import { animated, useTransition } from "react-spring";


export const Img = styled(animated(Shimmer))`

  position: absolute;
  top: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  left: 0;
  object-fit: cover;
`;


const ProgressiveImage = ({ original,landing, preview, style, onFetch, ...props }) => {
 
 
const {data,isLoading}= useImage({src:original,preview})

  const [transitions, api] = useTransition(data, () => ({
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  }));


  return  transitions(
    (transitionStyles, item) =>{ 
    return (
          <Img
            key={item}
            src={item}
            style={{ ...style, ...transitionStyles }}
            alt={props.alt || " "}
            {...props}
          />
        );}
  )

    
};
export default ProgressiveImage;