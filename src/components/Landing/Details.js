import {
 
  Details as Container,
  MoreDetails,
  HeaderButton,
  VideoControls,
  Picture,
  Title,
  Overview,
  Scroll,
  LinerGradient,
  HeroGradient,
} from "./styles";
import { useSpring } from "react-spring";
import { useHover } from "@use-gesture/react";
import { MdApi } from "react-icons/md";
import useMeasure from "react-use-measure";
import ProgressiveImage from "../cachedImage";



export  function Details({landscapePosterPath,overview,active,style,title}){


   
  const original = landscapePosterPath
    ? `https://image.tmdb.org/t/p/w780${landscapePosterPath}`
    : null;
  const preview = landscapePosterPath
    ? `https://image.tmdb.org/t/p/w300${landscapePosterPath}`
    : null;
const [{ height, scale }, api] = useSpring(() => ({
    from: { height: 60, scale: 1 },
  }));

  const [measureRef, { height: viewHeight }] = useMeasure();
  const bind = useHover((state) => {
    console.log(state.hovering);
    if (state.hovering) {
      api.start({ to: { height: viewHeight, scale: 1.2 } });
    }

    if (!state.hovering) {
      api.start({ to: { height: 60, scale: 1 } });
    }
  });

    return (
      <Container
        {...bind()}
        style={{ transformOrigin: "left bottom", ...style }}
        active={active}
      >
        <Title>
          {landscapePosterPath ? (
            <div
              style={{
                position: "relative",
                aspectRatio: 16 / 9,
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <ProgressiveImage landing original={original} preview={preview} />
            </div>
          ) : (
            <>{title}</>
          )}
        </Title>
        <Overview style={{ height }}>
          <div ref={measureRef}>{overview}</div>
        </Overview>
        
        <MoreDetails>More Details</MoreDetails>
      </Container>
    );
}