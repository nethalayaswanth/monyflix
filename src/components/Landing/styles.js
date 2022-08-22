import styled, { css } from "styled-components";
import down from "../../assets/down.png";



export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(4, 0, 0);
  margin: auto;
  max-width: 100vw;
  //max-height:100vh;
  z-index: 1;

  @media only screen and (max-width: 100vw) {
    width: 100%;
    height: 56.25vw;
  }
  @media only screen and (max-width: 739px) {
    height: calc(110vw / 0.65);
  }
  //background-color: rgb(4, 0, 0);
  .absolute {
    height: 100%;
    width: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
`;

export const Picture = styled(Container)``;
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 120vh;

  /* @media only screen and (min-width: 550px) {
    min-height: 750px;
  }
  @media only screen and (min-width: 650px) {
    min-height: 950px;
  } */

 
`;

export const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  -webkit-mask-image: linear-gradient(to bottom, #000 75%);
  mask-image: linear-gradient to bottom, #000 75%;
  background: linear-gradient(
    to bottom,
    transparent 70%,
    rgba(0, 0, 0, 0.02) 20%,
    rgba(0, 0, 0, 0.7) 98%
  );
  z-index: 3;
  pointer-events:none;
  /* -webkit-backdrop-filter: blur(30px) saturate(70%);
  backdrop-filter: blur(30px) saturate(70%); */
`;

export const TopGradient = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 30%;
  -webkit-mask-image: linear-gradient(to bottom, #000 75%);
  mask-image: linear-gradient to bottom, #000 75%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.7) 10%,
    rgba(0, 0, 0, 0.6) 20%,
    rgba(0, 0, 0, 0.02) 80%,
    transparent 100%
  );
  z-index: 3;
  /* -webkit-backdrop-filter: blur(30px) saturate(70%);
  backdrop-filter: blur(30px) saturate(70%); */
`;

export const Down = styled.div`
  position: absolute;
  bottom: 20px;
  background-image: url(${down});
  background-size: 14px 8px;
  height: 8px;
  width: 14px;
  border: none;
  z-index: 3;
  transition: all 1000ms;
`;

export const Scroll = styled.button`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10%;
  transition: all 1000ms;
  z-index:9;
  &:hover {
    bottom: -4px;
    scale: 1.1em;
  }
`;
