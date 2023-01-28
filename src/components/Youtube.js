import React, {
  forwardRef,
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player/youtube";

import styled,{css} from "styled-components";

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
  height: 150%;
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

  const onReady = useCallback((e) => {
    setReady(true);
    player.current.getInternalPlayer().setLoop(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    setPlay(visible && _play);
  }, [visible, ready, _play]);

  const onPause = useCallback((e) => {
    setPlay(false);
  }, []);

  const onEnded = useCallback((e) => {
    // onEnded?.();
    console.log("ended", e);
    setPlay(false);
    player.current.setLoop(true);
    player.current.playVideo();
  }, []);

  const onBufferEnd = useCallback(
    (e) => {
      setPlay(visible && _play);
    },
    [_play, visible]
  );

  const onBuffer = useCallback(
    (e) => {
      if (!full) {
        setPlay(false);
      }
    },
    [full]
  );

  const onError = useCallback((e) => {
    console.log("erroe");
    setPlay(false);
  }, []);

  const onProgress = useCallback(({ played }) => {
    if (played > 0.9) {
      // player.current.seekTo(0, "fraction");
      onVideoEnded?.()
    }
  }, [onVideoEnded]);

  const onStateChanged = useCallback((e) => {
    console.log(e.data);
  }, []);

  const show = visible && play;

  const styles = useMemo(() => {
    return {
      left: 0,
      // ...(!full && { pointerEvents: "none" }),
      opacity: show ? 1 : 0,
      transition: "opacity 0.5s",
    };
  }, [show]);

  console.log(play, title);

  return (
    <>
      <VideoControls>
        <HeaderButton
          disabled={!visible}
          onClick={() => {
            setPlay((x) => !x);
          }}
        >
          {play ? <PlayRounded /> : <PauseRounded />}
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
      <VideoContainer absolute={absolute} ref={refcb}>
        <Player>
         
           <VideoPlayer
            className="react-player"
            ref={playerRefCb}
            url={`https://www.youtube.com/watch?v=${id}`}
            playing={play}
            controls={full}
            volume={(show && !mute) || full ? 1 : 0}
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
                  autoplay: _play ? 1 : 0,
                  controls: full ? 1 : 0,
                  disablekb: 1,
                  iv_load_policy:3,
                  fs: full ? 1 : 0,
                  loop: 1,
                  modestbranding: 1,
                  playlist: id,
                },
                events: {
                  onStateChange: onStateChanged,
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
    <Player>
      <Youtube {...args} />
    </Player>
  );
}

export default memo(Youtube);
