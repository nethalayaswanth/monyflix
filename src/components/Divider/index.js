import styled, { css } from "styled-components";

const Divider = styled.div`
  display: block;
  width: calc(100% - 50px);
  margin: 0 25px;
  border: 0.5px solid rgba(0, 0, 0, 0.15);

  @media only screen and (min-width: 740px) {
    width: calc(100% - 80px);
    margin: 0 40px;
  }
`;

export default Divider