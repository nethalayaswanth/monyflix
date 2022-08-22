import styled, { css } from "styled-components";
import radient from "../../assets/radient.png";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 500px;
  max-height:100vh;

  @media only screen and (min-width: 550px) {
    min-height: 750px;
  }
  @media only screen and (min-width: 650px) {
    min-height: 950px;
  }
  @media only screen and (min-width: 740px) {
    min-height: 362px;
  }
  background-color: rgb(4, 0, 0);
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  margin-bottom: -7px;
`;

export const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  height: 100%;
  width: 100%;
  -webkit-mask-image: url(${radient});
  mask-image: url(${radient});
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  background-color: rgba(30, 30, 30, 0.3);
  -webkit-backdrop-filter: blur(30px) saturate(70%);
  backdrop-filter: blur(30px) saturate(70%);
  z-index: 1;
  background-image: url(${radient});
  background: rgba(4, 0, 0, 0.5);
  z-index: 7;
`;

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(4, 0, 0);
`;