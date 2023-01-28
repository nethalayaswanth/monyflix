import styled, { css } from "styled-components";
import down from "../../assets/down.png";
import { ReactComponent as UnMute } from "../../assets/unMute.svg";
import { ReactComponent as Mute } from "../../assets/mute.svg";

import { animated } from "react-spring";

export const circleGradient = css`
  content: "";
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  pointer-events: none;
  z-index: 4;

  --circle-gradient: radial-gradient(
    circle 2270px at 7% 93%,
    rgba(0, 0, 0, 0.9) 7%,
    rgba(0, 0, 0, 0) 26%,
    transparent 100%
  );
  --linear-gradient: linear-gradient(
    rgba(0, 0, 0, 0) 88%,
    rgba(0, 0, 0, 0.7) 100%
  );
  background-image: var(--circle-gradient), var(--linear-gradient);
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background-color: rgb(4, 0, 0);
  margin: auto;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  width: 100%;

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

  &::after {
    ${circleGradient}
  }
`;

export const Wrapper = styled.div`
  -o-object-fit: cover;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /* @media only screen and (max-width: 100vw) {
    width: 100%;
    height: calc(56.25vw);
    min-height: 500px;
  }
  @media only screen and (max-width: 739px) {
    height: calc((120vw / 0.65));
  } */
`;

export const Gradient = styled.div`
  position: absolute;

  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  -webkit-backdrop-filter: blur(1px) saturate(70%) opacity(20%);
  backdrop-filter: blur(1px) saturate(70%) opacity(20%);

  background-color: transparent;
  background-image: linear-gradient(
    180deg,
    hsla(0, 0%, 8%, 0) 0,
    hsla(0, 0%, 8%, 0.15) 15%,
    hsla(0, 0%, 8%, 0.35) 29%,
    hsla(0, 0%, 8%, 0.58) 44%,
    #141414 88%,
    #141414
  );
  background-position: 0 top;
  background-repeat: repeat-x;
  background-size: 100% 100%;
  bottom: -10px;
  height: 14.7%;
  opacity: 1;
  top: auto;
  width: 100%;
`;

export const TopGradient = styled(Gradient)`
  top: -10px;
  bottom: auto;
  background-image: linear-gradient(
    0deg,
    hsla(0, 0%, 8%, 0) 0,
    hsla(0, 0%, 8%, 0.15) 15%,
    hsla(0, 0%, 8%, 0.35) 29%,
    hsla(0, 0%, 8%, 0.58) 44%,
    #141414 88%,
    #141414
  );
`;

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  -webkit-backdrop-filter: blur(30px) saturate(50%) opacity(100%);
  backdrop-filter: blur(30px) saturate(50%) opacity(100%);
  background-color: rgba(0, 0, 0, 0.9);
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
  z-index: 30;
  &:hover {
    bottom: -4px;
    scale: 1.1em;
  }
`;

export const VideoControls = styled.div`
  bottom: 40px;
  position: absolute;
  transition: unset;
  padding: 0 40px;
  right: 0;
  z-index: 5;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const HeaderButton = styled.button`
  width: 28px;
  height: 28px;
  opacity: 1;
  background-size: contain;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  &:not(:first-child) {
    margin-left: 4px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  & svg {
    fill: white;
    display: block;
  }
`;

export const Details = styled(animated.div)`
  display: flex;
  /* align-items: flex-end; */
  justify-content: space-between;
  flex: 1;
  text-align: left;
  z-index: 5;
  color: white;
  background-color: transparent;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  bottom: 40px;
  font-size: 15px;
  line-height: 1.33338;
  font-weight: 400;
  letter-spacing: 0;
  &:hover {
    cursor: pointer;
  }

  opacity: 0;
  -webkit-filter: blur(1px);
  filter: blur(1px);
  transform: translateY(-15px);

  ${({ active }) =>
    active
      ? css`
          opacity: 1;
          -webkit-filter: blur(0px);
          filter: blur(0px);
          transform: translateY(0px);
          transition: opacity 1s ease-out 0.2s, filter 666ms ease-out 0.3s,
            transform 666ms ease-out, -webkit-filter 666ms ease-out 0.3s;
        `
      : ``};

  @media only screen and (min-width: 740px) {
    padding: 0 40px;
    max-width: 300px;
    box-sizing: content-box;
    text-align: unset;
  }
`;

export const Title = styled.div`
  font-size: 26px;
  line-height: 1.23077;
  font-weight: 700;
  letter-spacing: 0;
  color: white;
  margin: auto 0 5px;
  position: relative;
  max-width: 240px;
`;

export const Overview = styled(animated.div)`
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  position: relative;
  white-space: normal;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 10px;

  @media only screen and (min-width: 740px) {
    -webkit-line-clamp: unset
  }
`;

export const MoreDetails = styled.div`
  text-align: center;
  width: 100%;
  width: 100%;
  border-radius: 6px;
  border: 0;
  height: 36px;
  padding: 0 16px;
  font-size: 15px;
  line-height: 1.33338;
  font-weight: 600;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: black;
  margin-bottom: 4px;
  position: relative;
  z-index: 4;
  max-width: 240px;
`;

export const LinerGradient = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 0px;
  position: relative;
  z-index: 4;
  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 40px;
    bottom: -10px;
    pointer-events: none;
    z-index: -1;

    --linear-gradient: linear-gradient(
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0.7) 50%
    );

    background-image: var(--linear-gradient);
  }
`;

export const HeroGradient = styled.div`
  position: absolute;
  z-index: 4;
  background-color: transparent;
  background-image: linear-gradient(
    180deg,
    hsla(0, 0%, 8%, 0) 0,
    hsla(0, 0%, 8%, 0.15) 15%,
    hsla(0, 0%, 8%, 0.35) 29%,
    hsla(0, 0%, 8%, 0.58) 44%,
    #141414 88%,
    #141414
  );
  background-position: 0 top;
  background-repeat: repeat-x;
  background-size: 100% 100%;
  bottom: -1px;
  height: 14.7vw;
  opacity: 1;
  top: auto;
  width: 100%;
`;
