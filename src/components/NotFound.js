import { Link } from "react-router-dom";
import styled, { css } from "styled-components"

const absoluteCentering = css`
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;
const Container = styled.div`
  position: relative;
  height: 100vh;

  .not-found {
    ${absoluteCentering}
    max-width: 520px;
    width: 100%;
    line-height: 1.4;
    text-align: center;
  }
  .not-found-404 {
    position: relative;
    height: 200px;
    margin: 0 auto 20px;
    z-index: -1;
  }

  h1 {
    font-size: 236px;
    font-weight: 200;
    margin: 0;
    color: #211b19;
    text-transform: uppercase;
    ${absoluteCentering}
  }

  h2 {
    font-size: 28px;
    font-weight: 400;
    text-transform: uppercase;
    color: #211b19;
    background: #fff;
    padding: 10px 5px;
    margin: auto;
    display: inline-block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;


const Nav = styled(Link)`
  display: inline-block;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  text-transform: uppercase;
  padding: 13px 23px;
  background: #007aff;
  border-radius:6px;
  font-size: 18px;
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
`;




export const NotFound=()=>{



return (
  <Container>
    <div className="not-found">
      <div class="not-found-404">
        <div>
          <h1>Oops!</h1>
          <h2>404 - The Page can't be found</h2>
        </div>
      </div>
      <Nav to='/browse'>Go TO Homepage</Nav>
    </div>
  </Container>
);
}