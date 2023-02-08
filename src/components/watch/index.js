import styled from "styled-components";

import { useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { animated, useSpring } from "react-spring";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { useModalState } from "../../contexts/modalContext";
import useScrollLock from "../../hooks/useLock";
import usePrevRender from "../../hooks/usePrevRender";
import { VideoPlayer } from "../Youtube";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  z-index: -1;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;

  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 10000;
`;
const Wrapper = styled(animated.div)`
  display: flex;
  flex-direction: column;
  background-color: black;
  border-radius: 6px;
  overflow: hidden;
`;

const VideoWrapper = styled(animated.div)`
  aspect-ratio: 19 / 10;
  display: flex;
  flex-direction: column;
  background-color: black;
  overflow: hidden;
`;

const Header = styled(animated.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;
  background-color: black;
  padding: 6px var(--metaData-padding);

  border-bottom: 0.5px solid rgba(255, 255, 255, 0.3);
  color: white;
`;

const Title = styled.div`
  font-size: 18px;
  line-height: 1.46667;
  font-weight: 400;
  letter-spacing: 0;
`;

const Close = styled(CloseIcon)`
  height: 18px;
  cursor: pointer;
`;

const Watch = ({ width }) => {
  const portalEl = useMemo(() => {

    let root = document.getElementById("root");
  
    
    return root ;
  }, []);

  const [{ videoId, title }, dispatch] = useModalState();

  
  const prevVideoId = usePrevRender(videoId);

  const { lockBody, unlockBody } = useScrollLock("modal-scroller",1);
  const locked = useMemo(() => {
    if (videoId) {
      
      lockBody();
      return true;
    }
    return false;
  }, [lockBody, videoId]);
  console.log(locked, videoId, prevVideoId);

  if (!!prevVideoId && !videoId) {
    
    unlockBody();
  }

  const handleClose = () => {
    api.start({ opacity: 0 });
  };

  useLayoutEffect(() => {
    return () => {
      dispatch({
        type: "set modal",
        payload: {
          videoId: null,
          title: null,
        },
      });

    };
  }, [dispatch, unlockBody]);

  const [styles, api] = useSpring(() => {
  
    return {
      from: { opacity: 0 },
      onRest: (results) => {
        const {
          value: { opacity },
        } = results;

        if (opacity === 0) {
          dispatch({
            type: "set modal",
            payload: {
              videoId: null,
              title: null,
            },
          });
        }
      },
    };
  });

  useLayoutEffect(() => {
    if (videoId) {
      api.start({ from: { opacity: 0 }, to: { opacity: 1 } });
    }
  }, [api, videoId]);

  return (
    <>
      {videoId
        ? createPortal(
            <Container style={{ ...styles }}>
              <Wrapper
                style={{
                  width,
                }}
              >
                <Header>
                  <Title>{title}</Title>
                  <Close onClick={handleClose} />
                </Header>
                <VideoWrapper>
                  <VideoPlayer
                    id={videoId}
                    // width={width}
                    // height={(width * 9) / 16}
                    style={{}}
                    visible={true}
                    play={true}
                    full
                  />
                </VideoWrapper>
              </Wrapper>
              <Overlay
                onClick={handleClose}
                style={
                  {
                    /* opacity: opacity, */
                  }
                }
              />
            </Container>,
            portalEl
          )
        : null}
    </>
  );
};

export default Watch;
