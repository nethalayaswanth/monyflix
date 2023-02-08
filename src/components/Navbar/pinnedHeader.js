import { Children, useRef } from "react";
import useMeasure from "react-use-measure";
import styled from "styled-components";
import { useScrollPosition } from "../../hooks/useScrollPosition";

const Container = styled.div`

  position: relative;
  /* position: absolute;
  width:100%; */
`;
const Wrapper = styled.div`
  left: 0;
  position: relative;
  right: 0;
  top: 0;
  z-index: 4;
  &::before {
    left: 0;
    position: absolute;
    right: 0;
    top: -998px;
    height: 1000px;
    background: black;
    content: "";
  };
  ::after {
    content: ""
  }
  transition: background 300ms;
`;

export default function PinnedHeader({ children,bind }) {
  const [mainHeader, subHeader] = Children.toArray(children);
  const header = useRef();
  const [mainRef, { height }] = useMeasure();

  const mainPinned = useRef(false);

  useScrollPosition({
    onScrollChange: ({ prevPos, currPos,scrolling }) => {

      const el = header.current.style;
      if (currPos > 3) {
        el.backgroundColor = "black";
      } else {
        el.backgroundColor = "transparent";
      }

      if (!subHeader) {
        if (prevPos <= currPos) {
          el.top = `${0}px`;
          el.position = "fixed";
        }
      } else {
        if (prevPos < currPos) {
          if (
            parseFloat(el.top) === 0 &&
            (el.position === "relative" || mainPinned.current)
          ) {
            el.top = `${currPos}px`;
            el.position = "absolute";
            mainPinned.current = false;
          }

          if (
            subHeader &&
            currPos > parseFloat(el.top) + height &&
            !mainPinned.current
          ) {
            el.top = `${-height}px`;
            el.position = "fixed";
            mainPinned.current = true;
          }
        }

        if (prevPos > currPos) {
          if (mainPinned.current && parseFloat(el.top) < 0) {
            el.top = `${currPos - height}px`;
            el.position = "absolute";
            mainPinned.current = false;
          } else if (parseFloat(el.top) > currPos && !mainPinned.current) {
            el.top = `${0}px`;
            el.position = "fixed";
            mainPinned.current = true;
          }

          if (currPos === 0) {
            el.position = "absolute";
          }
          return;
        }
      }
    },
    wait: 0,
  });

  return (
    <Container {...bind()} style={{ height }}>
      <Wrapper style={{ top: 0, position: "relative" }} ref={header}>
        <div ref={mainRef}>{mainHeader}</div>
        {subHeader ? <div>{subHeader}</div> : null}
      </Wrapper>
    </Container>
  );
}
