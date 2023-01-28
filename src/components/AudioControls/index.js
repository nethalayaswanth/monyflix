import { useCallback } from "react";
import { VscMute as MuteIcon, VscUnmute as UnmuteIcon } from "react-icons/vsc";
import styled from "styled-components";

const Audio = styled.div`
  align-items: center;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;


`;

const Button = styled.button`
  -webkit-box-align: center;
  align-items: center;
  appearance: none;
  border: 0px;
  cursor: pointer;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  opacity: 1;
  padding: 10%;
  position: relative;
  user-select: none;
  will-change: background-color, color;
  word-break: break-word;
  white-space: nowrap;
  border-radius: 50%;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.9);
  color: white;
  border-radius: 50%;
  max-height: 54px;
  max-width: 54px;
  min-height: 24px;
  min-width: 24px;
  height: 24px;
  width: 24px;
  @media only screen and (min-width: 420px) {
    height: 24px;
    width: 24px;
  }
  @media only screen and (min-width: 740px) {
    height: 36px;
    width: 36px;
  }
`;

const Mute = styled(MuteIcon)`
  display: flex;

  align-items: center;

  justify-content: center;
  height: 100%;
  width: 100%;
  fill: white;
  color: white;
`;

const Unmute = styled(UnmuteIcon)`
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
  width: 100%;
  
  fill: white;
  color: white;
`;

const AudioControls = ({ cb, audio }) => {
  const handleClick = useCallback(() => {
    cb?.();
  }, [cb]);

  return (
    <Audio>
      <Button onClick={handleClick}>{audio ? <Unmute /> : <Mute />}</Button>
    </Audio>
  );
};

export default AudioControls;
