import React, { forwardRef } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as Arrow } from "../../assets/prev.svg";

const NavButton = styled.button`
  top: 0;
  position: absolute;
  height: 100%;
  z-index: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;

  text-align: center;
  opacity: 0;

  width: var(--controller-width);

  ${(props) =>
    !props.next
      ? css`
          left: 0;
        `
      : css`
          right: 0;
          ${Svg} {
            transform: scaleX(-1);
          }
        `}
`;
const Svg = styled(Arrow)`
  margin: 0 auto;
  position: relative;
  top: 0;
  display: block;
  content: "";
  width: 9px;
  height: 20px;
  fill: ${({ dark }) => (dark ? `white` : `black`)};
  visibility: ${({ visibility }) => (visibility ? "visible" : "hidden")};

  @media only screen and (min-width: 740px) {
    width: 13px;
    height: 29px;
  }

  background: none;
  border: none;
  z-index: 1;
  transition: opacity 0.2s;
`;

export const Prev = styled(NavButton)`
  left: 0;
`;
export const Next = styled(NavButton)`
  right: 0;
  ${Svg} {
    transform: scaleX(-1);
  }
`;

export const SwiperWrapper = styled.div`
  overflow: visible;
  position: relative;
  padding: 0 var(--controller-width);

  &:hover {
    ${NavButton} {
      opacity: 1;
    }
  }

  .swiper {
    margin: 0 auto;
    position: relative;
    list-style: none;
    padding: 0;
    z-index: ${({ cardHover }) => (cardHover ? 3 : 1)};
    height: 100%;
    display: flex;
    max-height: max-content;
    justify-content: flex-start;
    overflow: visible;
    top: 0;
    padding: 0 0px;
  }
  .wrapper {
    position: relative;
    align-items: flex-start;
    display: flex;
    height: 100%;
    justify-content: flex-end;
    overflow: hidden;
    top: 0;
  }
  .swiper-wrapper {
    transform: translate3d(0px, 0, 0);
    height: 100%;
    width: 100%;
    box-sizing: content-box;
    flex-basis: auto;
    flex-grow: 1;
    max-height: min-content;
    position: relative;

    scroll-padding-left: 20px;
    scroll-padding-right: 20px;

    @media only screen and (min-width: 740px) {
      scroll-padding-left: 0px;
      scroll-padding-right: 0px;
    }
  }
  .swiper-slide.hide {
    visibility: hidden;
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    ${({ margin, value }) => {
      const width = `calc(
          (100% - 2 * var(--swiper-padding) - ${value - 1} * ${margin}px) /
            ${value}
        )`;
      return css`
        width: ${width};
        --width: ${width};
      `;
    }}
  }

  .swiper-slide:first-child {
    ${({}) => {
      return css`
        margin-left: var(--swiper-padding);
      `;
    }}
  }

  .swiper-slide:last-child {
    ${() => {
      return css`
        margin-right: var(--swiper-padding);
      `;
    }}
  }

  .swiper-pagination-bullet {
    --swiper-pagination-bullet-inactive-color: white;
  }

  .swiper-pagination-bullet-active {
    --swiper-theme-color: white;
  }
`;

export const Nav = forwardRef(
  ({ next, onClick, enable, visible, dark, style }, ref) => {
    return (
      <NavButton
        next={next}
        enable={enable}
        ref={ref}
        style={{ ...style }}
        onClick={onClick}
      >
        <Svg className="controller" dark={dark} visibility={enable} />
      </NavButton>
    );
  }
);
