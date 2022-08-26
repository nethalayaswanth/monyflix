import styled from "styled-components";
import { Youtube } from "../Youtube";

import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import useMedia from "../../hooks/useMedia";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: black;
  height:100vh;
  width: 100%;
  
`;

const Watch = () => {
  let { id } = useParams();

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";
  const root = document.getElementById("root");
 

  return (
    <Container>
      <div
        style={{
          height: '100%',
          width: "100%",
        }}
      >
        <Youtube id={id} visible={true} light={false} play={true} full />
      </div>
    </Container>
  );
};

export default Watch;
