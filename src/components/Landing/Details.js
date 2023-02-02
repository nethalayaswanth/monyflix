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
  More,
} from "./styles";
import { useSpring } from "react-spring";
import { useHover } from "@use-gesture/react";
import { MdApi } from "react-icons/md";
import useMeasure from "react-use-measure";
import ProgressiveImage from "../cachedImage";



export  function Details({landscapePosterPath,overview,trigger,style,title}){


   
  const original = landscapePosterPath
    ? `https://image.tmdb.org/t/p/w780${landscapePosterPath}`
    : null;
  const preview = landscapePosterPath
    ? `https://image.tmdb.org/t/p/w300${landscapePosterPath}`
    : null;


  const [{ opacity, y }, _] = useSpring(() => {
   
    return {
      from: { opacity: trigger ? 0 : 1, y: trigger ? -15 : 0 },
      to: { opacity: trigger ? 1 : 0, y: trigger ? 0 : -15 },
      reset: true,
    };
  }, [trigger]);

  const [measureRef, { height: viewHeight }] = useMeasure();
  const bind = useHover((state) => {
   
    if (state.hovering) {
      api.start({ to: { height: viewHeight, scale: 1.2 } });
    }

    if (!state.hovering) {
      api.start({ to: { height: 60, scale: 1 } });
    }
  });
  const [{ height, scale }, api] = useSpring(() => ({
    from: { height: 60, scale: 1 },
  }));


    return (
      <Container
        {...bind()}
        style={{
          transformOrigin: "left bottom",
          opacity,
          y,
          filter: opacity.to([0, 1], [1, 0]).to((x) => `blur(${x}px)`),
          ...style,
        }}
        className='metadata'
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
        <div style={{position:'relative'}}>
          <Overview style={{ height }}>
            <div ref={measureRef}>{overview}</div>
          </Overview>
        {/* { truncate && <More>...</More>} */}
        </div>

        <MoreDetails>More Details</MoreDetails>
      </Container>
    );
}