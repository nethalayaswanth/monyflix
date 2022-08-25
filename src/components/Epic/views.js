import styled from "styled-components";
import radient from "../../assets/radient.png";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow: hidden;
  background-color: rgb(0, 0, 0);
  margin: auto;
  max-width: 100vw;
  z-index: 1;
  min-height: calc(100vw / 0.65);

  max-height: 100vh;

  @media only screen and (min-width: 480px) {
    min-height: calc(100vw / 0.85);
  }

  @media only screen and (min-width: 650px) {
    min-height: 520px;
  }

  @media only screen and (min-width: 740px) {
    min-height: 362px;
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
  position: absolute;
  width: 100%;
  height: unset;
  bottom: 10px;
  @media only screen and (min-width: 1000px) {
    bottom: 20px;
  }
  top: unset;
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
  z-index: 7;
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
