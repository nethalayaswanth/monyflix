import React, { forwardRef, useCallback } from "react";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import AspectBox from "../AspectBox";
import { CardWrapper } from "../Card/styles";
import Youtube from "../Youtube";

const Text = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.34;
  margin-top: 0.5em;
`;
const ExpandCard = forwardRef(({ height, style, data }, ref) => {
  let navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/watch/${data?.key}`, {});
  }, [data?.key, navigate]);

  return (
    <CardWrapper
      onClick={handleClick}
      color="transparent"
      height={height}
      ref={ref}
      style={style}
    >
      <AspectBox>
        {data && <Youtube style={{ borderRadius: "6px" }} id={data?.key} />}
      </AspectBox>
      <Text>{data.name}</Text>
    </CardWrapper>
  );
});

export default ExpandCard;
