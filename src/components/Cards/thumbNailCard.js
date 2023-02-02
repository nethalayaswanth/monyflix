import React, { forwardRef, useCallback } from "react";
import styled from "styled-components";

import { BsFillPlayFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useHover from "../../hooks/useHover";
import AspectBox from "../AspectBox";
import { CardWrapper } from "../Cards/styles";
import ProgressiveImage from "../cachedImage";

const Text = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.34;
  margin-top: 0.5em;
`;

const ThumbNailContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  border-radius: 6px;
  overflow: hidden;
`;

const ThumbNailIcon = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  border-radius: 6px;
`;

const ThumbnailCard = forwardRef(({ height, style, data }, ref) => {
  let navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/watch/${data?.key}`, {});
  }, [data?.key, navigate]);

  const [hoverRef, isHovering] = useHover();

  const original = data?.key
    ? `https://i.ytimg.com/vi/${data?.key}/hqdefault.jpg`
    : null;
  const preview = data?.key
    ? `https://i.ytimg.com/vi/${data?.key}/mqdefault.jpg`
    : null;

  return (
    <CardWrapper
      onClick={handleClick}
      color="transparent"
      height={height}
      ref={ref}
      style={style}
    >
      <AspectBox>
        {data && (
          <ThumbNailContainer ref={hoverRef}>
            <ProgressiveImage original={original} preview={preview} />
            <ThumbNailIcon>
              <BsFillPlayFill
               
              />
            </ThumbNailIcon>
          </ThumbNailContainer>
        )}
      </AspectBox>
      <Text>{data.name}</Text>
    </CardWrapper>
  );
});

export default ThumbnailCard;
