import useMedia from "../hooks/useMedia";
import { Overlay } from "./Landing/styles";
import styled from "styled-components";


export const Wrapper = styled.div`
  -o-object-fit: cover;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;`


const Video = ({style, show, children, crop = true }) => {
  const device = useMedia();

 
  const desktop = device === "desktop";

  return (
    <Wrapper style={{...style}}>
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          zIndex: 2,
          ...(desktop && crop && { position: "relative" }),
        }}
      >
        {show && (
          <>
            <Overlay />
          </>
        )}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            overflow: "hidden",
            transform: "translate(-50%,-50%) ",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            zIndex: 2,
            aspectRatio: 16 / 9,
            height: "calc(150%)",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "calc(150% - 20%)",
              width: "100%",
              overflow: "hidden",
              marginTop: "-25%",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "calc((150%))",
                aspectRatio: 16 / 9,
                width: "100%",
                overflow: "hidden",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Video;
