import AspectBox from "../AspectBox";
import { Youtube } from "../Youtube";
import styled from "styled-components";

import { useParams, useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: black;
  height: 100vh;
`;

const Watch = () => {
  let location = useLocation();

  let { id } = useParams();

  return (
    <Container>
      <div style={{ height: "100%", width: "100%" }}>
        <Youtube id={id} light={false} playOnMount={true} full />
      </div>
    </Container>
  );
};

export default Watch;
