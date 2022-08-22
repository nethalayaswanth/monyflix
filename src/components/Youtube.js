import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
  memo,
} from "react";
import ReactPlayer from "react-player/lazy";
import useInterval from "../hooks/useInterval";
import useTimeout from "../hooks/useTimeout";
import styled, { css } from "styled-components";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { BsFillPlayFill } from "react-icons/bs";
import useHover from "../hooks/useHover";
import AspectBox from "./AspectBox";
import {VscMute as Mute} from 'react-icons/vsc'
import { VscUnmute as Unmute } from "react-icons/vsc";
import { useModalState } from "../contexts/modalContext";



const VideoContainer=styled.div`
width:100%;
height:100%;
position:relative;
z-index:1;  
display:flex;
`

const Intersect = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  left: 50%;
  transform: translate(-50%,0%);
`;


export function Youtube({
  id,
  style,
  light = true,
  miniModal,
  play = false,
  full = false,
  interectionOptions,
}) {
  const playerRef = useRef();

  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [Play, setPlay] = useState(play);
  const [start, setStart] = useState(false);
  const [show, setShow] = useState(false);
  const [iconShow, setIconShow] = useState(false);
  const [mute, setMute] = useState(false);

  const playerRefCb = useCallback((ref) => {
    playerRef.current = ref;
  }, []);

  const [hoverRef, isHovering] = useHover();

  const [visible, elRef] = useIntersectionObserver({
    options: {
      threshold: 0.9,
      triggerOnce: false,
      ...(interectionOptions && interectionOptions),
    },
  });

  const wrapperRefCb = useCallback(
    (ref) => {
      elRef(ref);
      if (light) {
        hoverRef(ref);
      }
    },
    [elRef, hoverRef, light]
  );

  const onReady = useCallback((e) => {
    setReady(true);
    const player = playerRef.current.getInternalPlayer();
    player.setLoop(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    setPlay(visible);

    if (loaded) {
      setShow(visible);
    }
  }, [visible, ready, loaded]);

  useLayoutEffect(() => {
    if (!ready) return;

    if (loaded) {
      setPlay(Play);
      setShow(Play);
    }
  }, [ready, Play, loaded]);

  const onStart = useCallback((e) => {
    setStart(true);
  }, []);

  const onEnded = useCallback((e) => {
    setShow(false);
  }, []);

  const onBufferEnd = useCallback(
    (e) => {
      if (loaded) setShow(visible);
    },
    [loaded, visible]
  );

  const onBuffer = useCallback((e) => {
    setShow(false);
  }, []);

  const onError = useCallback((e) => {
    setShow(false);
  }, []);
  const onSeek = useCallback(() => {}, []);

  useEffect(() => {
    let timeout;
    let youtube = playerRef.current;
    if (full) {
      setLoaded(true);
    }
    if (!ready || !start || full) {
      return;
    }

    timeout = setInterval(() => {
      const secondsLoaded = youtube.getSecondsLoaded();
      const currentTime = youtube.getCurrentTime();
      if (secondsLoaded > 6 && currentTime > 4) {
        setLoaded(true);
        setStart(false);
      }
    }, 300);

    return () => {
      clearInterval(timeout);
    };
  }, [full, ready, start]);

  useLayoutEffect(() => {
    if (isHovering === undefined) return;
    setIconShow(isHovering);
  }, [isHovering]);

  const styles = useMemo(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      ...(!full && { pointerEvents: "none" }),
      opacity: show || light ? 1 : 0,
      transition: "opacity 0.5s",
      overflow: "hidden",
      aspectRatio: 16 / 9,
      ...style,
    };
  }, [full, show, light, style]);

  const handleMute = useCallback(() => {
    setMute((x) => !x);
  }, []);

  return (
    <VideoContainer playerstyle={style}>
      <Intersect id="intersect" ref={wrapperRefCb} />

      <ReactPlayer
        className="react-player"
        ref={playerRefCb}
        url={`https://www.youtube.com/watch?v=${id}`}
        playing={Play}
        light={light}
        controls={full}
        volume={show && mute ? 0.9 : 0}
        start={5}
        onReady={onReady}
        onStart={onStart}
        onBufferEnd={onBufferEnd}
        onBuffer={onBuffer}
        onEnded={onEnded}
        onSeek={onSeek}
        onError={onError}
        style={styles}
        width="100%"
        height="100%"
        playIcon={
          <BsFillPlayFill
            fill={"white"}
            style={{
              width: "32px",
              height: "32px",
              visibility: isHovering ? "visible" : "hidden",
            }}
          />
        }
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              controls: full ? 1 : 0,
              disablekb: 1,
              fs: 0,
              loop: 1,
              modestbranding: 1,
              playlist: id,
              host: `${window.location.protocol}//www.youtube.com`,
            },
          },
        }}
      />
    </VideoContainer>
  );
}


export  function Player(args) {
  return (
    <AspectBox>
      <Youtube {...args}/>
    </AspectBox>
  );
}

export default memo(Player);
