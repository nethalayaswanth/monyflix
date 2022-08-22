import styled, { css } from "styled-components";
import Shimmer from "../shimmer";
export const CardContainer = styled.div`
  box-sizing: border-box;
  box-shadow: 0 4px 7px rgb(0 0 0 / 25%);
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 12px;
  padding-top: ${({ height }) => (height ? `${height}` : "149.82%")};
  background-color: ${({ color }) =>
    color ? `${color}` : "rgb(249, 250, 251)"};
  position: relative;
  width: 100%;
`;

export const CardWrapper = styled.div`
  box-sizing: border-box;
  //box-shadow: 0 4px 7px rgb(0 0 0 / 25%);
  overflow: hidden;
  background-color: ${({ color }) => (color ? `${color}` :"rgb(249, 250, 251)")};
  position: relative;
  width: 100%;
  border-radius:6px;
`;

export const Image = styled(Shimmer)`
  object-fit: contain;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  object-fit: cover;
  z-index:5;
`;

export const AspectBox = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    object-fit: cover;
`;

