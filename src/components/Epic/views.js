import styled from "styled-components";
import radient from "../../assets/radient.png";
import { circleGradient } from "../Landing/styles";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  background-color: rgb(0, 0, 0);
  margin: auto;
  z-index: 1;

  max-height: 100vh;
  min-height: 500px;

  @media only screen and (min-width: 550px) {
    min-height: 750px;
  }

  @media only screen and (min-width: 650px) {
    min-height: 950px;
  }
  @media only screen and (min-width: 740px) {
    min-height: 555px;
  }

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

export const Image = styled.img`
  width: 100%;
  height: 100%;
  margin-bottom: -7px;
`;

export const Carousel = styled.div`
  justify-content: flex-end;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

export const MetaWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 6;
  &::after {
    ${circleGradient}
  }

  & .flex-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: end;
  }
  & .metadata {
    position: relative;
  }

  & .video-controls {
    position: relative;
  }
  & .player-container {
    position: absolute;
  }
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
  background-color: rgba(30, 30, 30, 0.2);
  -webkit-backdrop-filter: blur(30px) saturate(70%);
  backdrop-filter: blur(30px) saturate(70%);
  z-index: 1;
  background-image: url(${radient});
  background: rgba(4, 0, 0, 0.2);
  z-index: 3;
`;

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(4, 0, 0);
`;

export const Details = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex: 1;
  text-align: left;
  z-index: 8;
  color: white;
  background-color: transparent;

  height: calc(100% - 102px);
  padding: 0 25px;

  @media only screen and (min-width: 740px) {
    padding: 10vh 40px;
  }

  padding-bottom: 10vh;
`;
