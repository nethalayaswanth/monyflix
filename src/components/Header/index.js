import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { ReactComponent as Navigation } from "../../assets/leftArrow.svg";

const flex = css`
  display: flex;
  flex-direction:row;
  align-items:flex-end;
`;
const Container = styled.div`
  padding: 13px var(--metaData-padding);
  margin: 0;
  
`;
const Wrapper = styled.div`
  ${flex};
  justify-content: space-between;
`;


const Title = styled.h2`
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.23;
  margin: 0;
  cursor: pointer;
`;

const LeftIcon = styled(Navigation)`
  fill: #7f7f7f;
  margin-left:5px;
  height:10px;
`;


function removeEmpty(obj) {
 const temp= Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
const isEmpty = Object.keys(temp).length === 0;
  return !isEmpty?temp:null;
}

const Header = ({ title, style, padding,pathVariables={} }) => {

  const { type, genres, sort_by } = pathVariables;
  const params = removeEmpty({ type, genres, sort_by });

 const navigate= useNavigate()

 const handleClick=()=>{
if(params){
  const _params=new URLSearchParams(params)

  navigate(`/discover?${_params.toString()}`);
}
  
 }
  return (
    <Container padding={padding} style={{ ...style }}>
      <Wrapper
        onClick={handleClick}
      >
        <Title>
          {`${title}`}
          {params ? <LeftIcon /> : null}
        </Title>
      </Wrapper>
    </Container>
  );
};

export default Header;
