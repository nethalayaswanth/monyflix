import styled, { css } from "styled-components";
import { animated } from "react-spring";
import Shimmer from "../shimmer";
import { circleGradient } from "../Landing/styles";

export const Flex = styled(animated.div)`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  ${({ center }) => {
    return center
      ? css`
          align-items: center;
          justify-content: center;
        `
      : "";
  }}
`;

export const Absolute = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  object-fit: cover;
`;

export const AspectBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ landscape }) => (landscape ? 16 / 9 : 2 / 3)};

  &.absolute {
    ${Absolute}
  }
`;

export const textSmall = css`
  font-size: 15px;
  line-height: 1.33338;
  font-weight: 400;
  letter-spacing: 0;
`;
export const CardWrapper = styled(Flex)`
  width: 100%;
  overflow: hidden;
  border-radius: 6px;

  @media only screen and (min-width: 740px) {
    &.landscape::after,
    &.landing::after {
      ${circleGradient}
    }
  }
  &.landscape {
    ${AspectBox} {
      aspect-ratio: 2/3;
      @media only screen and (min-width: 740px) {
        aspect-ratio: 8/3;
      }
    }
  }

  &.landing {
    ${AspectBox} {
      max-height: 700px;
      aspect-ratio: 2/3;
      overflow: hidden;
      margin-bottom: 20px;
      margin-top: 20px;

      @media only screen and (min-width: 740px) {
        aspect-ratio: 16/9;
        max-height: 100vh;
      }
    }
  }
`;

export const CardContainer = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  background-color: ${({ color }) =>
    color ? `${color}` : "rgb(249, 250, 251)"};
  position: relative;
  width: 100%;
  border-radius: 6px;
`;
