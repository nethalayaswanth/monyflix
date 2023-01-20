import React, { forwardRef } from "react";

import styled from "styled-components";
import { ReactComponent as Arrow } from "../../assets/prev.svg";

const NavButton = styled.button`
  top: 0;
  position: absolute;
  height: 100%;
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  text-align: center;
 width:25px;
  
  @media only screen and (min-width: 740px) {
    width: 40px;
  }
`;
const Svg = styled(Arrow)`
  margin: 0 auto;
  position: relative;
  top: 0;
  display: block;
  content: "";
  width: 9px;
  height:20px;

  @media only screen and (min-width: 740px) {
    width: 13px;
    height: 29px;
  }

  background: none;
  border: none;
  z-index: 1;
  transition: opacity 0.2s;
`;

const Prev = styled(NavButton)`
  left: 0;
`;
const Next = styled(NavButton)`
  right: 0;
  ${Svg} {
    transform: scaleX(-1);
  }
`;



export const Backward = forwardRef(({ next = false, onClick, disable,visible,dark,style },ref) => {
  
  return (
    <Prev ref={ref} style={{ ...style,backgroundColor:dark?"transparent":"white" }} onClick={onClick}>
      <Svg
        className="controller"
        style={{
          opacity: visible ? 0.85 : 0,
          fill: dark ? "white" : "black",
          visibility: disable ? "hidden" : "visible",
        }}
      />
    </Prev>
  );
})


export const Forward = forwardRef(({ next = false, onClick, disable, visible, dark, style  },ref) => {
  return (
    <Next
    ref={ref}
      style={{ ...style, backgroundColor: dark ? "transparent" : "white" }}
      onClick={onClick}
    >
      <Svg
        className="controller next"
        style={{
          opacity: visible ? 0.85 : 0,
          fill: dark ? "white" : "black",
          visibility: disable ? "hidden" : "visible",
        }}
      />
    </Next>
  )
}) 


