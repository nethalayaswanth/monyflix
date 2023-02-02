import { useHover } from "@use-gesture/react";
import { useRef, useTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import useMeasure from "react-use-measure";
import styled, { css } from "styled-components";
import { ReactComponent as CloseIcon } from "../../assets/closeFill.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { useDevice } from "../../contexts/deviceContext.js";
import { useModalDispatch } from "../../contexts/modalContext";
import { useParamDispatch, useParamState } from "../../contexts/paramContext";
import useEventListener from "../../hooks/useEventListener";

export const NavContainer = styled.div`
  height: var(--nav-height);

  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 3;

  backdrop-filter: blur(1px);
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 10%,
    transparent
  );

  transition: background 300ms;

  padding: 0 var(--metaData-padding);
  @media only screen and (min-width: 740px) {
    margin: auto;
    height: 52px;
  }
`;

const Flex = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
`;
export const NavWrapper = styled.div`
  ${Flex}
  padding: 5px 0;
  justify-content: flex-end;
`;

export const SearchWrapper = styled(animated.div)`
  overflow: hidden;
  position: absolute;
  right: 0;
`;
export const SearchBox = styled(animated.div)`
  ${Flex}
  justify-content: flex-start;
`;

export const InputWrapper = styled(animated.div)`
  display: flex;
  align-items: center;
`;
export const SearchButton = styled(animated.button)`
  padding: 0 6px;
  cursor: pointer;
`;

export const Search = styled(SearchIcon)`
  fill: white;
  color: white;
`;

export const Close = styled(CloseIcon)`
  fill: white;
  color: white;
`;

export const Input = styled.input`
  flex-grow: 1;
  background: transparent;
  border: none;
  box-sizing: border-box;
  color: #fff;
  display: inline-block;
  font-size: 14px;
  outline: none;
  padding: 7px 14px 7px 7px;
  height: 34px;
  line-height: 34px;
  margin-right: 36px;
`;
const Navbar = () => {
  const [searchParams, setSearchParams] = useParamState();

  const searchKey = searchParams.get("q");

  const [open, toggle] = useState(!!searchKey);
  const inputRef = useRef();

  const [backgroundColor, setBg] = useState("transparent");
  const { desktop } = useDevice();
  const [ref, { width: containerWidth }] = useMeasure();

  const [isPending, startTransition] = useTransition();
  const width = open ? (!desktop ? containerWidth : 274) : 36;
  const [props] = useSpring(
    () => ({
      to: {
        width,
        scale: open ? 1 : 0,
        borderOpacity: open ? 0.85 : 0,
        borderRadius: open ? 3 : 0,
      },
      onRest: () => {
        if (open) {
          inputRef.current.focus();
        }
      },
    }),
    [open]
  );

  useEventListener({
    event: "scroll",
    listener: () => {
      setBg(window.scrollY > 0 ? "black" : "transparent");
    },
    element: window,
    options: { passive: true },
  });

  const navigate = useNavigate();

  const dispatch = useModalDispatch();
  const bind = useHover((state) => {
    if (state.hovering) {
      dispatch({
        type: "set modal",
        callback: (state) => {
          //  console.log(state);
          if (state.mini && !state.expand) {
            return { ...state, showMini: false };
          }
        },
      });
    }
  });

  const handleClose = () => {
    navigate(`/browse`);
    inputRef.current.value = "";
    toggle(false);
  };
  

  const handleChange = (e) => {
    const parsedUrl = new URL(window.location.href);
    const value = e.target.value.trim();
    parsedUrl.searchParams.set("q", value);
    console.log(parsedUrl.pathname !== "/search", parsedUrl.search);

    if (value.length > 0) {
      if (parsedUrl.pathname !== "/search") {
        navigate(`/search${parsedUrl.search}`);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        return
      }
      else{
        setSearchParams({q:value})
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      
      return;
    } else {
      navigate(`/browse`);
    }
  };

  return (
    <NavContainer {...bind()} style={{ backgroundColor }}>
      <NavWrapper ref={ref}>
        <SearchWrapper
          style={{
            width: props.width,
            border: props.borderOpacity.to(
              (opacity) => `2px solid hsla(0,0%,100%,${opacity})`
            ),
            borderRadius: props.borderRadius,
          }}
        >
          <SearchBox>
            <InputWrapper style={{ width }}>
              <SearchButton onClick={() => toggle(!open)}>
                <Search />
              </SearchButton>
              <Input
                ref={inputRef}
                disabled={!open}
                onChange={handleChange}
                // value={searchKey ?? ""}
              />
            </InputWrapper>

            <SearchButton
              style={{
                transform: props.scale.to((scale) => `scale(${scale})`),
                position: "absolute",
                right: 0,
              }}
              onClick={handleClose}
            >
              <Close />
            </SearchButton>
          </SearchBox>
        </SearchWrapper>
      </NavWrapper>
    </NavContainer>
  );
};

export default Navbar;
