import { forwardRef, useCallback, useRef } from "react";
import { useQueryClient } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getMovieDetails, getVideosById } from "../../requests/requests";
import AspectBox from "../AspectBox";
import {
  Adult,
  Description,
  Header,
  InlineFlex,
  Item,
  Overview,
  Title,
} from "../CardModal/styles";
import timeConversion from "../CardModal/utils";
import ProgressiveImage from "../ProgressiveImage";
import { useModalState } from "../../contexts/modalContext";

const DetailsCard = ({ movie: current, onClick }, ref) => {

    const [{ activated, expand, enabled, expanded }, dispatch] =
      useModalState();
  const src = current?.images?.filePath 
    ? `https://image.tmdb.org/t/p/original/${current?.images?.filePath}`
    : null;
  const placeholderSrc = current
    ? `https://image.tmdb.org/t/p/w300/${current?.images?.filePath}`
    : null;

  const year = current?.releaseDate?.split("-")[0];
  const runTime = current?.runtime;

  let [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const handlePrefetch = useCallback(async () => {
    const types = ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"];
    const id = current?.id;
    await queryClient.prefetchQuery(["movie", id], async () =>
      getMovieDetails({ id: id })
    );
    await queryClient.prefetchQuery(["videos", id, types], async () =>
      getVideosById({ id: id, types })
    );
  }, [current, queryClient]);
const miniRef = useRef();
  const handleClick = useCallback(() => {
  

    handlePrefetch();
   dispatch({
     type: "set modal",
     ...(!activated && { scroll: window.scrollY }),
   });
    setSearchParams({ mv: current?.id });
    onClick?.();
  }, [current?.id, dispatch, handlePrefetch, onClick, setSearchParams]);
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor:'pointer'
      }}
    >
      <AspectBox ref={miniRef}>
        <ProgressiveImage
          style={{ borderRadius: "6px" }}
          src={src}
          placeholderSrc={placeholderSrc}
          alt={`${current?.title}`}
        />
      </AspectBox>
      <Description>
        <Header>
          <Title>{current?.title}</Title>
        </Header>
        <InlineFlex>
          <Item>{year}</Item>
          {runTime && <Item>{timeConversion(runTime)}</Item>}
          {current?.adult && (
            <Adult>{current?.adult ? "U/A 13+" : "U/A 18+"}</Adult>
          )}
        </InlineFlex>
        <Overview className={"details"} style={{ lineClamp: 2 }}>
          {current?.overview}
        </Overview>
      </Description>
      <button
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 3,
        }}
        onClick={handleClick}
      />
    </div>
  );
};

export default forwardRef(DetailsCard);
