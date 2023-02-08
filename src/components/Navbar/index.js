import { useHover } from "@use-gesture/react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import useMeasure from "react-use-measure";
import styled, { css } from "styled-components";
import { ReactComponent as CloseIcon } from "../../assets/closeFill.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { useDevice } from "../../contexts/deviceContext.js";
import { useModalDispatch } from "../../contexts/modalContext";
import { useParamState } from "../../contexts/paramContext";
import useOutsideClick from "../../hooks/useClickAway";
import Filters from "./filter";
import PinnedHeader from "./pinnedHeader";

export const NavContainer = styled(animated.div)`
  height: var(--nav-height);

  backdrop-filter: blur(1px);
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 10%,
    transparent
  );
  transition: height 0.56s cubic-bezier(0.52, 0.16, 0.24, 1);
  /* background 0.44s 0.2s cubic-bezier(0.52, 0.16, 0.24, 1), */
  padding: 0 var(--metaData-padding);

  @media only screen and (min-width: 740px) {
    margin: auto;
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
  justify-content: flex-start;
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

export const Logo = styled(animated.h1)`
  color: White;

  font-size: 16px;
  line-height: 36px;

  height: 36px;
`;

const text = css`
  font-size: 15px;
  line-height: 1.41667;
`;

export const Spacer = styled.div`
  ${Flex};
  flex: 1;
`;
export const Discover = styled.div`
  ${text}
  padding: 6px;
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  cursor: pointer;
`;
const Navbar = () => {
  const [searchParams, setSearchParams] = useParamState();

  const searchKey = searchParams.get("q");

  const location = useLocation();

  const [open, toggle] = useState(!!searchKey);
  const inputRef = useRef();

  const { desktop } = useDevice();
  const [ref, { width: containerWidth }] = useMeasure();

  const width = open ? (!desktop ? containerWidth : 274) : 36;
  const [{ backgroundOpacity, titleScale, ...props }] = useSpring(
    () => ({
      to: {
        width,
        scale: open ? 1 : 0,
        borderOpacity: open ? 0.85 : 0,
        titleScale: open ? (desktop ? 1 : 0) : 1,
        borderRadius: open ? 3 : 0,
        backgroundOpacity: open ? (desktop ? 0 : 1) : 0,
      },
      onRest: () => {
        if (open) {
          inputRef.current.focus();
        }
      },
    }),
    [open]
  );

  const navigate = useNavigate();

  const [stateRef, dispatch] = useModalDispatch();
  const bind = useHover((state) => {
    if (state.hovering) {
      if (stateRef.current.small && !stateRef.current.expanded)
        dispatch({
          type: "set modal",
          payload: {
            cardState: "collapsed",
          },
        });
    }
  });

  const handleClose = () => {
    navigate(`/browse`);
    inputRef.current.value = "";
    toggle(false);
  };

  const navigateHome = () => {
    navigate(`/`);
    inputRef.current.value = "";
    toggle(false);
  };

  const handleChange = (e) => {
    const parsedUrl = new URL(window.location.href);
    const value = e.target.value.trim();
    parsedUrl.searchParams.set("q", value);

    if (value.length > 0) {
      if (parsedUrl.pathname !== "/search") {
        navigate(`/search${parsedUrl.search}`);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        return;
      } else {
        setSearchParams({ q: value });
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

  const clickAwayProps = useOutsideClick({
    onOutsideClick: () => {
      if (open && (!searchKey || searchKey.length === 0)) handleClose();
    },
  });

  const showFilters = location.pathname === "/discover";

  
  return (
    <PinnedHeader bind={bind}>
      <NavContainer
        style={{
          backgroundColor: backgroundOpacity.to((o) => `rgba(0,0,0,${o})`),
        }}
      >
        <NavWrapper ref={ref}>
          <Logo
            onClick={navigateHome}
            style={{
              scale: titleScale,
              opacity: backgroundOpacity.to({
                range: [0, 1],
                output: [1, 0],
              }),
            }}
          >
            MONYFLIX
          </Logo>
          <Spacer />
          {/* <Discover>Discover</Discover> */}
          <SearchWrapper
            {...clickAwayProps}
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
                  defaultValue={searchKey}
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
      {showFilters ? <Filters /> : null}
    </PinnedHeader>
  );
};

export default Navbar;
