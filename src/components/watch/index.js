import styled from "styled-components";
import { Youtube } from "../Youtube";

import { useLocation, useParams } from "react-router-dom";

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
        <Youtube id={id} visible={true} light={false} play={true} full />
      </div>
    </Container>
  );
};

export default Watch;
