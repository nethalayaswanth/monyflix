import {
  cloneElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { animated, config, useSpring } from "react-spring";

import { createPortal } from "react-dom";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import useOutsideClick from "../../hooks/useClickAway";
import useEventListener from "../../hooks/useEventListener";
import { mergeRefs } from "../../utils";

const Container = styled(animated.div)`
  display: inline-block;
  z-index: 5;
  box-shadow: 2px 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  box-sizing:content-box;


`;

const getStyles = ({ trigger, tool }) => {
  const triggerRect = trigger.getBoundingClientRect();

  const toolRect = tool.getBoundingClientRect();

  const { clientHeight, clientWidth } = document.documentElement;



  const xleftAlign = triggerRect.left + toolRect.width < clientWidth;
  const xRightAlign = triggerRect.right - toolRect.width > 0;

  const width = Math.min(toolRect.width, clientWidth - 20);
  const height = Math.min(
    toolRect.height,
    clientHeight - triggerRect.bottom - 30
  );
  const x = xleftAlign
    ? triggerRect.left
    : xRightAlign
    ? triggerRect.right - width
    : Math.max(triggerRect.left - width / 2, 10);

  const y = triggerRect.bottom + 10;

  const originX = xleftAlign ? "left" : xRightAlign ? "right" : "center";
  const originY = "top";

  const transformOrigin = `${originX} ${originY}`;
  return {
    x: x + window.scrollX,
    y: y + window.scrollY,
    width,
    transformOrigin,
    height,
  };
};

const initialStyles = {
  x: 0,
  y: 0,
  top: 0,
  position: "relative",
  opacity: 0,
  scale: 1,
  width: "auto",
  height: "auto",
  transformOrigin: "left top",
};

export default function ToolTip({ children, style, button }) {
  const [mount, setMount] = useState();

  const triggerRef = useRef();
  const toolRef = useRef();

  useEventListener({
    event: "scroll",
    listener: () => {
      if (mount) {
        close();
      }
    },
    options: { passive: true },
  });

  const [styles, api] = useSpring(() => {
    return {
      from: {
        ...initialStyles,
      },
      onRest: (results, spring) => {
        const {
          value: { scale },
        } = results;

        if (scale === 0) {
          closing.current = false;
          setMount(false);
        }
      },
      config: { ...config.stiff, clamp: true },
    };
  });

  const finalPosition = useRef();
  const closing = useRef();
  const getStylesOnMount = (toolRef) => {
   
  };

  const close = () => {
    api.start({ to: [{ scale: 0, opacity: 0 }, { ...initialStyles }] });
  };

  const open = useCallback(() => {
    api.start({ to: [{ ...finalPosition.current, scale: 1, opacity: 1 }] });
  }, [api]);

  const clickAwayProps = useOutsideClick({
    onOutsideClick: () => {
      close();
    },
  });

  useLayoutEffect(() => {
    if (mount) {
      if (!triggerRef.current || !toolRef.current) return;

      finalPosition.current = getStyles({
        trigger: triggerRef.current,
        tool: toolRef.current,
      });


      api.start({
        from: {
          ...finalPosition.current,
          scale: 0,
          opacity: 0,
          top: 0,
          position: "absolute",
        },
        to: { scale: 1, opacity: 1 },
      });
    }
  }, [api, mount]);

  const portalEl = document.getElementById("root");

  return (
    <div {...clickAwayProps()}>
      <button
        onClick={() => {
          if (!mount) {
            setMount(true);
          } else if (closing.current) {
            closing.current = false;

            open();
          } else {
            closing.current = true;
            close();
          }
        }}
        ref={triggerRef}
      >
        {cloneElement(button, { open: mount })}
      </button>
      {mount &&
        createPortal(
          <span id="tool-tip">
            <Container
              className={"tool-tip"}
              ref={mergeRefs(getStylesOnMount, toolRef)}
              style={{ ...style, ...styles }}
            >
              {children}
            </Container>
          </span>,
          portalEl
        )}
    </div>
  );
}
