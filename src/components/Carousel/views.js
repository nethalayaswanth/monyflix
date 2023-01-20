import styled, { css } from "styled-components";

export const SwiperWrapper = styled.div`
  .swiper {
    margin: 0 auto;
    position: relative;
    list-style: none;
    padding: 0;
    z-index: 2;
    height: 100%;
    display: flex;
    max-height: max-content;
    justify-content: flex-start;
    overflow: visible;
    top: 0;
    padding: 0 0px;
    /* 
    @media only screen and (min-width: 740px) {
      padding: 0 40px;
    }
    ${({ desktop }) =>
      desktop
        ? css`
             {
              padding: 0 0px;
            }
          `
        : ""} */
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

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

/* &:last-child {
      margin-right: ${({ desktop, padding = 20, endPadding }) =>
        endPadding
          ? `calc(100% - 2 * ${padding}px)`
          : !desktop
          ? `${padding}px`
          : "0px"};
    }

    &:first-child {
      margin-left: ${({ desktop, padding = 20 }) => !desktop && `${padding}px`};
    } */
  }
`;




