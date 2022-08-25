import { forwardRef } from "react";
import styled, { css } from "styled-components";

export const Container = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  overflow: hidden;
  position: relative;
  ${({ absolute }) => {
    return absolute
      ? css`
          position: absolute;
          top: 0;
          left: 0;
          height:100%;
        `
      : css``;
  }}
user-select:'none';
transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  z-index:2; 
`;
const AspectBox = ({ style, children,height, potrait, absolute,...props },ref) => {
  return (
    <Container
      style={{
        paddingTop: height ? height : potrait ? "150%" : "56.25%",
        ...style,
      }}
      absolute={absolute}
      {...props}
    >
      <Wrapper ref={ref}>{children}</Wrapper>
    </Container>
  );
};

export default forwardRef(AspectBox);
