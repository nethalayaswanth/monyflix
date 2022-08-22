import React, { useRef, useState, useCallback } from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  padding: 13px 25px;
margin:0;
  @media only screen and (min-width: 740px) {
    padding: 13px 40px;
  }
`;

const Title = styled.h2`
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.23;
  margin:0;
`;

const Header = ({ title,style,padding }) => {
  return (
    <Wrapper padding={padding} style={{...style}} >
      <Title>{title}</Title>
    </Wrapper>
  );
};

export default Header;
