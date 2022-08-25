import styled from "styled-components";
import down from "../../assets/down.png";



export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(4, 0, 0);
  margin: auto;
  max-width: 100vw;

  z-index: 1;

  @media only screen and (max-width: 100vw) {
    width: 100%;
    height: calc(56.25vw );
    max-height: 100vh;
       
  }
  @media only screen and (max-width: 739px) {
    height: calc((110vw / 0.65));
  }
     
  .absolute {
    height: 100%;
    width: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
`;

export const Picture = styled(Container)``;
export const Wrapper = styled.div`
  -o-object-fit: cover;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  

  /* @media only screen and (max-width: 100vw) {
    width: 100%;
    height: calc(56.25vw);
    min-height: 500px;
  }
  @media only screen and (max-width: 739px) {
    height: calc((120vw / 0.65));
  } */
`;

export const Gradient = styled.div`
  position: absolute;
  
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  -webkit-backdrop-filter: blur(1px) saturate(70%) opacity(20%);
  backdrop-filter: blur(1px) saturate(70%) opacity(20%);

  background-color: transparent;
  background-image: linear-gradient(
    180deg,
    hsla(0, 0%, 8%, 0) 0,
    hsla(0, 0%, 8%, 0.15) 15%,
    hsla(0, 0%, 8%, 0.35) 29%,
    hsla(0, 0%, 8%, 0.58) 44%,
    #141414 88%,
    #141414
  );
  background-position: 0 top;
  background-repeat: repeat-x;
  background-size: 100% 100%;
  bottom: -10px;
  height: 14.7%;
  opacity: 1;
  top: auto;
  width: 100%;
`;

export const TopGradient = styled(Gradient)`
top:-10px ;
bottom:auto;
background-image: linear-gradient(
    0deg,
    hsla(0, 0%, 8%, 0) 0,
    hsla(0, 0%, 8%, 0.15) 15%,
    hsla(0, 0%, 8%, 0.35) 29%,
    hsla(0, 0%, 8%, 0.58) 44%,
    #141414 88%,
    #141414
  );
  
`;

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  -webkit-backdrop-filter: blur(30px) saturate(50%) opacity(100%);
  backdrop-filter: blur(30px) saturate(50%) opacity(100%);
  background-color: rgba(0, 0, 0,0.9);
`;

export const Down = styled.div`
  position: absolute;
  bottom: 20px;
  background-image: url(${down});
  background-size: 14px 8px;
  height: 8px;
  width: 14px;
  border: none;
  z-index: 3;
  transition: all 1000ms;
`;

export const Scroll = styled.button`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10%;
  transition: all 1000ms;
  z-index:9;
  &:hover {
    bottom: -4px;
    scale: 1.1em;
  }
`;
