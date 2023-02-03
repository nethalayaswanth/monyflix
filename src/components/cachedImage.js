
import { animated, useTransition } from "react-spring";
import styled from "styled-components";
import { useImage } from "../contexts/imageCachingContext";
import { Shimmerstyles } from "./shimmer";

export const Img = styled(animated.img)`
  ${Shimmerstyles}
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  left: 0;
  object-fit: cover;
`;

const ProgressiveImage = ({
  original,
  landing,
  modal,
  preview,
  style,
  onFetch,
  ...props
}) => {
  const { data, isLoading } = useImage({ src: original, preview });

  const [transitions, api] = useTransition(data ?? ["holder"], () => ({
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  }));

  return transitions((transitionStyles, item) => {
    return (
      <Img
        key={item}
        {...(item === "holder" ? { as: "div" } : { src: item })}
        style={{ ...style, ...transitionStyles }}
        alt={props.alt || " "}
        {...props}
      />
    );
  });
};
export default ProgressiveImage;