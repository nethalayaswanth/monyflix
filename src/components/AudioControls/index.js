import styled, { css } from "styled-components";


const Controls = styled.div`
  height: 100%;
  z-index: 20;
  max-height: 100vh;
`;

const Audio = styled.div`
  align-items: center;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: absolute;
  right: 0;
  z-index: 10;

  bottom: 7%;
  width: 10%;

  @media only screen and (max-width: 739px) {
    height: calc(110vw / 0.65);
  }
`;

const Button = styled.div`
  -webkit-box-align: center;
  align-items: center;
  appearance: none;
  border: 0px;
  cursor: pointer;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  opacity: 1;
  padding: 10%;
  position: relative;
  user-select: none;
  will-change: background-color, color;
  word-break: break-word;
  white-space: nowrap;
  border-radius: 50%;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: white;
`;

const Icon = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 10%;
  width: 10%;
`;