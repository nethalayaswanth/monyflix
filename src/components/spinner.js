import { forwardRef } from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Spin } from "../assets/spinner.svg";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled(Spin)`
  animation: ${rotate360} 2s linear infinite;
  transform: translateZ(0);
  background: transparent;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: rgba(0, 0, 0, 0.15);
  fill: rgba(0, 0, 0, 0.5);
`;


export const Loaderwrapper = styled.div`

  height:80px;
  display:flex;
  align-items:center;
  justify-content:center;

`;


export const Loader=forwardRef(({style},ref)=>{


  return(
    <Loaderwrapper ref={ref} style={{...style}}>
      <Spinner/>
    </Loaderwrapper>
  )
})






export default Spinner;
