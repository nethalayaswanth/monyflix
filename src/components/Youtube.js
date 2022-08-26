import React, {
  memo, useCallback,
  useLayoutEffect, useMemo, useRef, useState
} from "react";
import { BsFillPlayFill } from "react-icons/bs";
import ReactPlayer from "react-player/lazy";
import styled from "styled-components";
import useHover from "../hooks/useHover";
import AspectBox from "./AspectBox";

import useMedia from "../hooks/useMedia";

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  display: flex;
`;




export function Youtube({
  id,
  style,
  light = true,
  miniModal,
  play = false,
  full = false,
  interectionOptions,
  audio = true,
  cb,
  visible = true
}) {
  const playerRef = useRef();

  const [ready, setReady] = useState(false);
 
  const [Play, setPlay] = useState(play);
  const [show, setShow] = useState(false);
  const [iconShow, setIconShow] = useState(false);
  

const device = useMedia();

const mobile = device === "mobile";
const desktop = device === "desktop";

  const playerRefCb = useCallback((ref) => {
    playerRef.current = ref;
  }, []);

  const [hoverRef, isHovering] = useHover();

  

  const wrapperRefCb = useCallback(
    (ref) => {
      
      if (light) {
        hoverRef(ref);
      }
    },
    [ hoverRef, light]
  );

  const onReady = useCallback((e) => {
    setReady(true);
    const player = playerRef.current.getInternalPlayer();
    player.setLoop(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    
    setPlay(visible && play);
   setShow(visible && play);
  }, [visible, ready, play]);

 

     
     

     
      
     
     
     
     
     

  const onStart = useCallback((e) => {
    
  }, []);

  const onEnded = useCallback((e) => {
    setShow(false);

  }, []);

  const onBufferEnd = useCallback(
    (e) => {
       setShow(visible);
    },
    [visible]
  );

  const onBuffer = useCallback((e) => {
    setShow(false);
  }, []);

  const onError = useCallback((e) => {
    setShow(false);
  }, []);
  const onSeek = useCallback(() => {}, []);

  useLayoutEffect(()=>{cb && cb({show,audio})},[cb,audio, show])
  
 

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

 
  return (
    <VideoContainer ref={wrapperRefCb} playerstyle={style}>
      <ReactPlayer
        className="react-player"
        ref={playerRefCb}
        url={`https://www.youtube.com/watch?v=${id}`}
        playing={Play}
        light={light}
        controls={full}
        volume={(show && audio) || (full && desktop) ? 1 : 0}
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
              fs: full && desktop ? 1 : 0,
              loop: 1,
              modestbranding: full && desktop ? 0 : 1,
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
