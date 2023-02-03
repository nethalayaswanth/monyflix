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
import { HeaderButton, VideoControls } from "./Landing/styles";

const VideoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  z-index: 2;

  ${({ absolute }) =>
    absolute &&
    css`
      position: absolute;
    `}
`;
const Player = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180%;
  aspect-ratio: 16/9;
  z-index: 2;
  position: absolute;
  background-color: transparent;
  top: 50%;
  left: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
`;

export const VideoPlayer = forwardRef(({ id, full, ...props }, ref) => {
  return (
    <ReactPlayer
      className="react-player"
      ref={ref}
      url={`https://www.youtube.com/watch?v=${id}`}
      width={"100%"}
      height={"100%"}
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
});

const callIffunction = (fn, ...args) => {
  console.log(this);
  if (typeof fn === "function") fn.call(...args);
};
export function Youtube({
  id,
  style,
  play: _play = false,
  full = false,
  audio = true,
  cb,
  absolute,
  title,
  onVideoEnded,
}) {
  const player = useRef();

  const [ready, setReady] = useState(false);

  const [play, setPlay] = useState(_play);
  const [mute, setMute] = useState(!audio);

  const {
    ref: inviewRef,
    inView: visible,
    entry,
  } = useInView({
    threshold: 0.9,
  });
  const refcb = useCallback(
    (node) => {
      inviewRef(node);
    },
    [inviewRef]
  );

  const playerRefCb = useCallback((ref) => {
    player.current = ref;
  }, []);

  const onReady = (e) => {
    setReady(true);
    player.current?.getInternalPlayer()?.setLoop(true);
  };

  const playVideo = useCallback((e) => {
    setPlay(true);
    if (typeof player.current?.getInternalPlayer().playVideo !== "function")
      return;
    player.current?.getInternalPlayer()?.playVideo();

    console.log("playvideo");
  }, []);

  const pauseVideo = useCallback((e) => {
    setPlay(false);
    if (typeof player.current?.getInternalPlayer()?.pauseVideo !== "function")
      return;
    player.current?.getInternalPlayer()?.pauseVideo();
  }, []);

  const togglePlay = () => {
    if (play) {
      pauseVideo();
      return;
    }
    playVideo();
  };

  const onPause = useCallback((e) => {
    // setPlay(false);
  }, []);

  const onEnded = (e) => {
    setPlay(false);
    player.current?.getInternalPlayer()?.setLoop(true);
    playVideo();
  };

  const onBufferEnd = (e) => {
    playVideo();
  };

  const onBuffer = (e) => {
    // pauseVideo();
  };

  const onError = (e) => {
    console.log("error");
    pauseVideo();
  };

  const timeOutRef = useRef();

  const onProgress = ({ played }) => {
    if (played > 0.8) {
      player.current?.getInternalPlayer()?.seekTo(0, "fraction");

      onVideoEnded?.();
      pauseVideo();
      timeOutRef.current = setTimeout(() => playVideo(), 3000);
    }
  };

  useEffect(() => {
    if (_play && ready && visible) {
      playVideo();
    } else {
      pauseVideo();
    }

    return () => clearTimeout(timeOutRef.current);
  }, [_play, pauseVideo, playVideo, ready, visible]);

  const show = play;

  const styles = {
    left: 0,
    ...(!full && { pointerEvents: "none" }),
     opacity: show ? 1 : 0,
    transition: "opacity 0.5s",
  };

  console.log(play);
  return (
    <>
      <VideoControls className="video-controls">
        <HeaderButton
          key={play ? "pause" : "play"}
          disabled={!visible}
          onClick={togglePlay}
        >
          {play ? <PlayRounded key="play" /> : <PauseRounded key="pause" />}
        </HeaderButton>
        <HeaderButton
          onClick={() => {
            console.log(mute);
            setMute((x) => !x);
          }}
        >
          {mute ? <UnMute /> : <Mute />}
        </HeaderButton>
      </VideoControls>
      <VideoContainer
        className="player-container"
        absolute={absolute}
        ref={refcb}
      >
        <Player>
          <VideoPlayer
            className="react-player"
            ref={playerRefCb}
            url={`https://www.youtube.com/watch?v=${id}`}
            playing={false}
            controls={full}
            // volume={(show && !mute) || full ? 1 : 0}
            volume={0}
            start={5}
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
                  // autoplay: _play ? 1 : 0,
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
        <div role="alert">
          <div>Oh no</div>
          <pre>{error.message}</pre>
          <button
            onClick={() => {
              // though you could accomplish this with a combination
              // of the FallbackCallback and onReset props as well.
              resetErrorBoundary();
            }}
          >
            Try again
          </button>
        </div>;
      }}
    >
      <Youtube {...args} />
    </ErrorBoundary>
  );
}

export default memo(PlayerBox);
