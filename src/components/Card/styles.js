import styled, { css } from "styled-components";
import { animated } from "react-spring";
import Shimmer from "../shimmer";
import { circleGradient,linearG, Overview } from "../Landing/styles";
import { ReactComponent as PauseRounded } from "../../assets/pauseRounded.svg";
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

export const Absolute = css`
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
  overflow: hidden;
  /* margin-bottom: 8px; */
  aspect-ratio: ${({ landscape }) => (landscape ? 16 / 9 : 2 / 3)};
  box-shadow: rgb(0 0 0 / 25%) 0px 4px 7px;
  &.absolute {
    ${Absolute}
  }
`;

const text = css`
  font-weight: 400;
  letter-spacing: 0;
`;

export const textSmall = css`
  font-size: 15px;
  line-height: 1.33338;
  ${text}
`;

export const textMediumTall = css`
  font-size: 15px;
  line-height: 1.41667;
  ${text}
`;

export const textTall = css`
  font-size: 18px;
  line-height: 1.46667;
  font-weight: 400;
  letter-spacing: 0;
`;

export const textTruncate = css`
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 1;
`;
export const CardWrapper = styled(Flex)`
  width: 100%;
  overflow: hidden;

  .landing &.card-wrapper::after {
    ${linearG}
  }

  @media only screen and (min-width: 740px) {
    .landscape &.card-wrapper::after,
    .landing &.card-wrapper::after {
      ${circleGradient}
    }
  }
  .landscape &.card-wrapper {
    .backdrop {
      border-radius: 6px;
      aspect-ratio: 2/3;
      overflow: hidden;
      @media only screen and (min-width: 740px) {
        aspect-ratio: 8/3;
      }
    }
  }

  .landing &.card-wrapper {
    .backdrop {
      max-height: 700px;
      aspect-ratio: 2/3;
      overflow: hidden;

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

  position: relative;
  width: 100%;
  /* border-radius: 6px; */
  background-color: "";
  ${(props) => {
    switch (props.card) {
      case "potrait":
        return css`
          .backdrop {
            border-radius: 6px;
            aspect-ratio: 2/3;
          }
        `;
      case "detail":
        return css`
          .backdrop {
            border-radius: 6px;
            aspect-ratio: 16/9;
          }
        `;
      case "epic":
        return css`
          color: white;
          .backdrop {
            border-radius: 6px;
            aspect-ratio: 16/9;
          }
        `;
      default:
        return css`
          .backdrop {
            border-radius: 6px;
            aspect-ratio: 16/9;
          }
        `;
    }
  }}
`;
export const Caption = styled.div`
  ${textSmall}
  ${textTruncate}
  -webkit-line-clamp:2;
`;

export const Description = {};

Description.Content = styled.div`
  column-gap: 3em;
  grid-template-columns: 1fr;
  display: grid;
  padding: 0 10px;
  flex: auto;
  width:100%;
  flex-shrink: 0;
  min-height: 0;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);

  overflow: hidden;

  ${({ opened }) =>
    opened
      ? css`
          padding: 0 var(--metaData-padding);
          padding-bottom: 10px;
          flex-grow:0;
          @media only screen and (min-width: 740px) {
            grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
          }
          ${Description.Title} {
            ${textTall};
            font-weight: 600;
          }
          ${Description.Overview} {
            margin-top: 10px;

            -webkit-line-clamp: unset;
          }
          ${Description.MetaData} {
            margin-top: 10px;
          }
        `
      : ``};
`;
Description.Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
Description.Title = styled.div`
  ${textTall}
  ${textTruncate}
  -webkit-line-clamp:1;
  color: var(--primary-color);
  .epic & {
    ${textSmall}
  }
  margin-top: 10px;
  .modal-description & {
  }
`;

Description.Overview = styled.div`
  ${textMediumTall}
  ${textTruncate}
  -webkit-line-clamp:3;
  overflow: hidden;
  color: var(--secondary-color);

  ${({opened})=>{!opened
    ? css`
        .modal-description & {
          margin-top: 10px;
          -webkit-line-clamp: 4;
        }
      `
    : css`
        .modal-description & {
          margin-top: 10px;
          -webkit-line-clamp: unset;
        }
      `;

  }}
  
`;

Description.MetaData = styled.div`
  ${textTruncate}

  color: var(--secondary-color);
  font-size: 12px;
  line-height: 1.25;
  margin-top: 4px;
  margin-bottom: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  overflow: visible;

  .modal-description & {
    margin-top: 10px;
  }
  & > span {
    margin-right: 10px;
  }
`;
Description.Badge = styled.span`
  border: 1px solid var(--secondary-color);
  border-radius: 2px;
  padding: 0 0.4em;
  /* display: inline-block; */
  text-align: center;
  text-transform: uppercase;
`;

Description.Tagline = styled.div`
  ${textTall}
  font-weight: 600;
  font-style: italic;
  color: var(--primary-color);
`;

Description.Genres = styled.div`
  ${textMediumTall}
  word-break: break-word;
  margin-top: 10px;
  margin-bottom: 10px;
  & > span {
    :not(:first-of-type) {
      cursor: pointer;
    }

    :not(:first-of-type):hover {
      text-decoration: underline;
    }

    :first-of-type {
      color: var(--primary-color);
      font-weight: 500;
    }
    color: var(--secondary-color);
  }
`;

export const PlayIcon = styled(PauseRounded)`
  width: 32px;
  height: 32px;
  fill: white;
  visibility: hidden;
`;
export const ThumbNailHover = styled.button`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  border-radius: 6px;
  &:hover {
    background-color: rgb(0, 0, 0, 0.2);
    ${PlayIcon} {
      visibility: visible;
    }
  }
`;
