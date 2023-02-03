import styled, { css, keyframes } from "styled-components";

export const keyFrameExampleOne = keyframes`
   0%{
        background-position: -500px 0
    }
    100%{
        background-position: 500px 0
    }
`;

export const Shimmerstyles = css`
  animation-duration: 1.25s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${keyFrameExampleOne};
  animation-timing-function: linear;
  animation-delay: ${(props) => (props.delay ? `${props.delay}ms` : 0)};
  background: darkgray;
  border: none;
  border: 0px;
  background: linear-gradient(to right, #c8c8c8 10%, #ffffff 33%, #c8c8c8 60%);
  background-size: 1000px 100%;
  height: ${(props) => (props.height ? props.height : "100%")};
  width: ${(props) => (props.width ? props.width : "100%")};
  position: relative;
`;

export const Shimmer = styled.img`
  ${Shimmerstyles}
`;

export default Shimmer;
