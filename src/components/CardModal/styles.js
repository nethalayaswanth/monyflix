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

export const Flex = styled.div`
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
  flex: 1;
  ${({ expand }) =>
    expand
      ? css`
          padding: 0 25px;

          @media only screen and (min-width: 740px) {
            padding: 0 40px;
          }
        `
      : ``}
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

export const ModalWrapper = styled(Block)`
  box-sizing: border-box;
  box-shadow: 2px 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  z-index: 9;
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
  flex: auto;
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
  font-size: "1.5rem";
  font-weight: "600";
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

export const Open = styled(InlineFlex)`
  padding: 0;
  margin-bottom: 0.3em;
  justify-content: flex-end;
  margin-top: 0.5em;
`;

export const Up = styled(IoChevronForwardCircleOutline)`
  cursor: pointer;
  height: 36px;
  width: 36px;
  transform: rotate(-90deg);
  opacity: 0.7;
  stroke-width: "1";
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
  span {
    &:first-of-type {
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
              background: rgba(255,255,255,0.5);
              opacity:${({ visible }) =>
                visible ? 1 : 0};
              transition: "opacity 0.3s";
              height: 100%;
              width: 100%;
              pointerEvents: none;
              zIndex: 100;
`;

export const Modal = { LoadingOverlay };