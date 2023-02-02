import styled from "styled-components";

const Divider = styled.div`
  display: block;
  width: calc(100% - 2 * var(--metaData-padding));
  margin: 0 var(--metaData-padding);
  border-top: 0.5px solid rgba(0, 0, 0, 0.15);
`;

export default Divider;
