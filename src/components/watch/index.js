import { useCallback, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Youtube } from "../Youtube";

import { useParams } from "react-router-dom";
import useMedia from "../../hooks/useMedia";
import Spinner from "../spinner";

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: black;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Watch = () => {
  let { id } = useParams();

  const device = useMedia();

  const mobile = device === "mobile";
  const desktop = device === "desktop";

  const [show, setShow] = useState();

  const showCb = useCallback(({ show }) => {
    setShow(show);
  }, []);

  useLayoutEffect(() => {
    const root = document.getElementById("root");
    const rootStyle = root.style;
    root.style.minHeight = "-webkit-fill-available";
    const bodyStyle = document.body.style;

    document.body.style.backgroundColor = "black";

    return () => {
      root.style = rootStyle;
      document.body.style = bodyStyle;
    };
  }, []);
  return (
    <Container>
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <Youtube
          cb={showCb}
          id={id}
          visible={true}
          light={false}
          play={true}
          full
        />
        {!show && (
          <Overlay>
            <Spinner />
          </Overlay>
        )}
      </div>
    </Container>
  );
};

export default Watch;
