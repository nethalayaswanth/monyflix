import styled, { css } from "styled-components";

export const SwiperWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;

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
    overflow: hidden;
    top: 0;
    padding: 0 25px;

    @media only screen and (min-width: 820px) {
      padding: 0 40px;
    }
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
    touch-action: none;
    box-sizing: content-box;
    flex: auto;
  }

  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: "200px";
  }
`;




