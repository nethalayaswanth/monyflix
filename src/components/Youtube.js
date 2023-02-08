import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player/youtube";

import styled, { css } from "styled-components";

import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import { ReactComponent as Mute } from "../assets/mute.svg";
import { ReactComponent as PauseRounded } from "../assets/pauseRounded.svg";
import { ReactComponent as PlayRounded } from "../assets/playRounded.svg";
import { ReactComponent as UnMute } from "../assets/unMute.svg";
import { useDocumentInteraction } from "../contexts/documentInteraction";
import { HeaderButton, VideoControls } from "./Landing/styles";

const VideoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  ${({ crop }) =>
    crop
      ? css`
          aspect-ratio: 16/9;
          @media only screen and (min-width: 740px) {
           width:100%;
           aspect-ratio:unset;
          }
        `
      : css`
          width: 100%;
        `};
  z-index: 2;

  ${({ absolute }) =>
    absolute &&
    css`
      position: absolute;
      top: 50%;
      left: 50%;
      overflow: hidden;
      transform: translate(-50%, -50%);
    `}
`;
const Player = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180%;
  width: 100%;
  z-index: 2;
  position: absolute;
  background-color: transparent;
  top: 50%;
  left: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
`;

export const VideoPlayer = forwardRef(
  ({ id, full, width = "100%", height = "100%", ...props }, ref) => {
    return (
      <ReactPlayer
        className="react-player"
        ref={ref}
        url={`https://www.youtube.com/watch?v=${id}`}
        width={width}
        height={height}
        playsInline={true}
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              controls: full ? 1 : 0,
              disablekb: 1,
              fs: full ? 1 : 0,
              loop: 1,
              modestbranding: 1,
              playlist: id,
            },
          },
        }}
        {...props}
      />
    );
  }
);

export function Youtube({
  id,
  style,
  play,
  full = false,
  audio = true,
  cb,
  crop,
  absolute,
  title,
  onVideoEnded,
}) {
  const player = useRef();
  

  const [ready, setReady] = useState(false);
  const [end,setEnd]=useState()

  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [startSeconds, setStartSeconds] = useState(0);
  const [muted, setMuted] = useState(!audio);

  const interacted = useDocumentInteraction();

  const togglePlay = (e) => {
    e.stopPropagation()
    if (playing) {
      setPlaying(false);
      return;
    }
    if(end){
      setStartSeconds(0)
setEnd(false)
    }
    setPlaying(true);
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (muted) {
      setMuted(false);
      return;
    }
    setMuted(true);
  };

  const onReady = (e) => {
    setReady(true);
    player.current?.getInternalPlayer()?.setLoop(true);
  };

  const onPause = useCallback((e) => {
    // setPlaying(false);
  }, []);

  const onEnded = (e) => {
    setPlaying(false);
    player.current?.getInternalPlayer()?.setLoop(true);
  };

  const onBufferEnd = (e) => {
    console.log("ufferended");
    setBuffering(false);
  };

  const onBuffer = (e) => {
    console.log("buffer");
    setBuffering(true);
  };

  const onError = (e) => {
    console.log("error");
    setPlaying(false);
  };

  const timeOutRef = useRef();

  const progressTimeout = useRef();

  const onProgress = ({ played, playedSeconds }) => {
    if (progressTimeout.current) {
      clearTimeout(progressTimeout.current);
    }

    if (played > 0.95) {
      setPlaying(false);
      setEnd(true)
      if (onVideoEnded) {
        onVideoEnded();
        return;
      }

      timeOutRef.current = setTimeout(() => setStartSeconds(0), 2000);
      return;
    }

    progressTimeout.current = setTimeout(() => {
    
      setStartSeconds(playedSeconds);
    }, 3000);

  };

  const {
    ref: inviewRef,
    inView: visible,
    entry,
  } = useInView({
    threshold: 0.2,
    // rootMargin:'0px 400px 0px 400px'
  });



  useEffect(() => {
    let timoutRef = timeOutRef.current;

    console.log(visible)

    if (visible && ready && interacted && play) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
    return () => clearTimeout(timoutRef);
  }, [play, id, ready,visible, interacted]);

  const show = playing && !buffering;

  const refcb = useCallback(
    (node) => {
      inviewRef(node);
    },
    [inviewRef]
  );

  const playerRefCb = useCallback((ref) => {
    player.current = ref;
  }, []);

  const styles = {
    left: 0,
    ...(!full && { pointerEvents: "none" }),
    opacity: show ? 1 : 0,
    transition: "opacity 0.5s",
  };

  return (
    <>
      {id  && (
        <VideoControls className="video-controls">
          <HeaderButton
            key={setPlaying ? "pause" : "play"}
            disabled={!visible}
            onClick={togglePlay}
          >
            {show ? <PlayRounded key="play" /> : <PauseRounded key="pause" />}
          </HeaderButton>
          <HeaderButton onClick={toggleAudio}>
            {muted ? <UnMute key="unMute" /> : <Mute key="mute" />}
          </HeaderButton>
        </VideoControls>
      )}
      <VideoContainer
        className="player-container"
        absolute={absolute}
        crop={crop}
        ref={refcb}
      >
        <Player>
          <VideoPlayer
            key={`${id}:${startSeconds}`}
            className="react-player"
            ref={playerRefCb}
            url={`https://www.youtube.com/watch?v=${id}&start=${startSeconds}`}
            playing={playing}
            controls={full}
            volume={(playing && !muted) || full ? 1 : 0}
            start={startSeconds}
            onReady={onReady}
            onPause={onPause}
            onBufferEnd={onBufferEnd}
            onBuffer={onBuffer}
            onEnded={onEnded}
            onProgress={onProgress}
            onError={onError}
            style={styles}
            width={"100%"}
            height={"100%"}
            playsInline={true}
            config={{
              youtube: {
                playerVars: {
                  controls: full ? 1 : 0,
                  disablekb: 1,
                  iv_load_policy: 3,
                  fs: full ? 1 : 0,
                  loop: 1,
                  modestbranding: 1,
                  playlist: id,
                },
              },
            }}
          />
        </Player>
      </VideoContainer>
    </>
  );
}

export function PlayerBox(args) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        
      }}
    >
      <Youtube {...args} />
    </ErrorBoundary>
  );
}

export default memo(PlayerBox);
