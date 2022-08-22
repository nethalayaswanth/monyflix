import React, { useRef, useState, useCallback } from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  padding: 0 25px;

  @media only screen and (min-width: 820px) {
    padding: 0 40px;
  }
`;

const Title = styled.h3`
  font-size: 1em;
  font-weight: 700;
  line-height: 1.23;
`;

const Header = ({ title,style,padding }) => {
  return (
    <Wrapper padding={padding} style={{...style}} >
      <Title>{title}</Title>
    </Wrapper>
  );
};

export default Header;
