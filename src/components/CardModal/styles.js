import { CgChevronDownO } from "react-icons/cg";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { animated } from "react-spring";
import styled, { css } from "styled-components";

export const Down = styled(CgChevronDownO)`
  max-height: 32px;
  max-width: 32px;
  min-height: 24px;
  min-width: 24px;
  opacity: 0.7;
`;

export const Grid = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(min-content, auto);
  ${({ center }) => {
    return center
      ? css`
          align-items: center;
          justify-content: center;
        `
      : "";
  }};
`;

export const Flex = styled(animated.div)`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
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

export const Content = styled(Flex)`
  padding: 0 10px;
  flex: auto;
  flex-shrink: 0;
  min-height: 0;
  height: 0;

  flex-direction: ${({ desktop }) => (desktop ? "row" : "column")};
  overflow: hidden;
  ${({ opened }) =>
    opened
      ? css`
          padding: 0 var(--metaData-padding);
        `
      : ``};
`;

export const Header = styled.div`
  display: block;
`;
export const InlineFlex = styled(Flex)`
  height: auto;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

export const Block = styled(animated.div)`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  margin: 1px 0;
  flex: auto;
`;

export const Wrapper = styled(Block)`
  box-sizing: border-box;
  box-shadow: 2px 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  /* border-radius:  ${({ collapsing }) => (collapsing ? `30px` : `6px`)}; */
  border-radius: 6px;
  margin: 0;
  flex-direction: column;
  background-color: white;
  display: flex;
  overflow: hidden;
  ${({ mini }) =>
    mini
      ? css`
          && .video-controls {
            padding: 0 10px;
            bottom: 10px;
           
          }
        `
      : ``}
`;

export const ModalWrapper = styled(Block)`
  box-sizing: border-box;
  box-shadow: 2px 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  margin: 0;
  flex-direction: column;
  background-color: white;
  display: flex;
  overflow: hidden;

 
`;
export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
`;
export const Image = styled.img`
  width: 100%;
  height: auto;
  z-index: 5;
`;

export const AspectBox = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  object-fit: cover;
`;
export const Text = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;

export const Item = styled.div`
  margin-right: 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 400;
`;

export const Adult = styled(Item)`
  border: 1px solid black;
  border-radius: "1px";
  padding: 0 0.4em;
`;

export const Spacer = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  flex: 2;
`;

export const Title = styled(Text)`
  font-size: ${({ expand }) => (expand ? "1.7rem" : "1.5rem")};
  line-height: 1.41667;
  font-weight: ${({ expand }) => (expand ? 600 : 500)};
  letter-spacing: 0;
  white-space: normal;
  opacity: 1;
  margin-top: 0.8em;
  margin-bottom: 0.25em;
  -webkit-line-clamp: 2;
  display: -webkit-box;
`;

export const Tagline = styled(Title)`
  font-size: 1.5rem;
  font-weight: 600;
  font-style: italic;
`;
export const Overview = styled(Text)`
  font-size: 12px;
  line-height: 1.41667;
  max-height: 100%;
  -webkit-box-orient: vertical;

  overflow: hidden !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 5;
  display: -webkit-box;
  padding-bottom: 2px;

  opacity: 0.8;

  &.details {
    -webkit-line-clamp: 2;
  }

  &.expand {
    -webkit-line-clamp: unset;
  }
`;

export const Button = styled.div`
  cursor: pointer;
  display: none;
  margin: 1em;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  display: block;
  font-size: 16px;
`;

export const Divider = styled.div`
  display: block;

  border: 0.5px solid rgba(0, 0, 0, 0.15);
`;
export const Close = styled(MdOutlineClose)`
  background-color: #181818;
  border-radius: 50%;
  height: 36px;
  padding: 8px;
  width: 36px;
  fill: white;
`;

export const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
`;

export const Footer = styled(InlineFlex)`
  padding: 0;
  justify-content: space-between;
  flex: 0;
  flex-basis: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
`;

export const Up = styled(IoChevronForwardCircleOutline)`
  cursor: pointer;
  height: 36px;
  width: 36px;
  transform: rotate(-90deg);
  opacity: 0.7;
`;

export const Description = styled(Flex)`
  height: unset;

  padding-right: ${({ expand }) => expand && "2rem"};
`;

export const Genres = styled.div`
  font-size: 14px;
  line-height: 1.41667;
  word-break: break-word;
  margin-top: 0.8em;
  margin-bottom: 0.25em;
  & > span {
    :not(:first-of-type) {
      cursor: pointer;
    }

    :not(:first-of-type):hover {
      text-decoration: underline;
    }
    & .link{

    }

    :first-of-type {
      opacity: 1;
      font-weight: 500;
    }
    opacity: 0.8;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: "opacity 0.3s";
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: 100;
`;

export const BgOverlay = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 2;
`;

export const Animated = styled(animated.div)`
  position: absolute;
  z-index: 4;
  will-change: transform, position, top, width, scaleX, scaleY, left;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BackDrop = styled(animated.div)`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: min(800px, 100vh);
  align-items: center;
  display: flex;
  overflow: hidden;
  flex-basis: auto;
  flex-shrink: 0;
`;

export const Modal = {
  LoadingOverlay,
  Adult,
  Button,
  Close,
  Content,
  Description,
  Divider,
  Genres,
  Header,
  InlineFlex,
  Item,
  Wrapper,
  Footer,
  Overview,
  Spacer,
  Tagline,
  Title,
  Up,
  ModalWrapper,
  BackDrop,
  Animated,
  BgOverlay,
  
};

