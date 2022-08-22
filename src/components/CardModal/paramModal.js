import React, {
  useRef,
  useState,
  forwardRef,
  useLayoutEffect,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useQueryClient, useQuery } from "react-query";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import useHover from "../../hooks/useHover";
import AspectBox from "../AspectBox";
//import { Image } from "../Card/styles";
import { useCardState } from "../Card/context";
import ExpandSlide from "../ExpandCard/expandSlide";
import {
  Flex,
  Image,
  VideoWrapper,
  ModalWrapper,
  ImageWrapper,
  Description,
  InlineFlex,
  Title,
  Overview,
  Down,
  Adult,
  Text,
  Item,
  Header,
  Block,
  CloseButton,
  Content,
  Close,
  Spacer,
  Open,
  Up,
  Divider,
} from "./styles";
import {
  useGetVideosById,
  useGetSimilarMovies,
  useMovieDetails,
  getMovieDetails,
} from "../../requests/requests";
import ModalSection from "../ModalSection";
import Youtube from "../Youtube";
import { useModalState } from "../../contexts/modalContext";

import { useLayoutEffectAfterMount } from "../../hooks/useEffectAfterMount";
import { useSpring, animated } from "react-spring";
import Shimmer from "../shimmer";
import ProgressiveImage from "../ProgressiveImage";
const ParamCardModal = forwardRef(({ style, width }, ref) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [
    {
      movie,
      activate,
      activated,
      miniExpand,
      miniExpanded,
      param,
      expand,
      expanded,
    },
    dispatch,
  ] = useModalState();

  const {
    data: movieDetails,
    isLoading: movieDetailsLoading,
    refetch: movieDetailsRefetch,
    status: movieDetailStatus,
    error,
  } = useMovieDetails({ id: movie?.id || param });

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useGetSimilarMovies({ id: param });

  const movies = useMemo(() => {
    if (data) {
      var list = [];

      data.pages.forEach(({ similarMovies: { data } }, i) => {
        list = [...list, ...data];
      });

      return list;
    }
    return [];
  }, [data]);

  let location = useLocation();
  let navigate = useNavigate();

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch({ type: "set expand", expand: false });
    },
    [dispatch]
  );

  const {
    isLoading,
    error: videoError,
    data: videoData,
    isFetching: videoFetching,
  } = useGetVideosById({
    id: param,
    types: ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"],
  });

  const id = useMemo(() => {
    if (!movieDetails) return null;
    const videos = movieDetails.movie.videos;
    if(!videos) return null;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [movieDetails]);

  const current = movieDetails?.movie;
  const year = current?.releaseDate.split("-")[0];

  console.log(videoData);


const backDropPath = current
  ? `https://image.tmdb.org/t/p/original/${current?.backdropPath}`
  : null;

const placeHolder = current
  ? `https://image.tmdb.org/t/p/w300/${current?.backdropPath}`
  : null;
      
  return (
    <ModalWrapper ref={ref} id="card-param-modal">
      <animated.div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 2,
            }}
          >
            <animated.div style={{ width }}>
              {id && (
                <Youtube
                  id={id}
                  light={false}
                  //style={{ transform: "translateY(-12.7%)" }}
                  play={true}
                />
              )}
            </animated.div>
          </div>
          <AspectBox style={{ zIndex: 1 }}>
            <ProgressiveImage
              style={{ width: "100%", height: "100%", Zindex: 5 }}
              src={backDropPath}
              placeholderSrc={placeHolder}
              alt={``}
            />
          </AspectBox>
        </>

        {
          <CloseButton onClick={handleClose}>
            <Close style={{ fill: "white" }} />
          </CloseButton>
        }
        <div
          style={{
            position: "relative",
            zIndex: 3,
            backgroundColor: "inherit",
            flex: "auto",
          }}
        >
          {
            <>
              {
                <Content expand={expand}>
                  <Description expand={expand}>
                    <Header>
                      <Title>{current.title}</Title>
                    </Header>
                    <InlineFlex>
                      <Item>{year}</Item>
                      <Adult>{current.adult ? "U/A 13+" : "U/A 18+"}</Adult>
                    </InlineFlex>
                    {/* <Spacer /> */}
                  </Description>

                  <Overview>{current.overview}</Overview>
                  <Spacer />
                </Content>
              }
              {(expand || expanded) && (
                <div style={{ flexGrow: 2, flexShrink: 0, flexBasis: "auto" }}>
                  <>
                    {videoData && videoData?.videosById && (
                      <>
                        {videoData.videosById.clip.length !== 0 && (
                          <ModalSection
                            data={videoData.videosById.clip}
                            title="Clips"
                          />
                        )}
                        {videoData.videosById?.trailer.length !== 0 && (
                          <ModalSection
                            data={videoData.videosById.trailer}
                            title="Trailers"
                          />
                        )}
                        {videoData.videosById?.bts.length !== 0 && (
                          <ModalSection
                            data={videoData.videosById.bts}
                            title="Behind The Scenes"
                          />
                        )}
                        {videoData.videosById.featurette.length !== 0 && (
                          <ModalSection
                            data={videoData.videosById.featurette}
                            title={"Featurette"}
                          />
                        )}
                        {videoData.videosById.bloopers.length !== 0 && (
                          <ModalSection
                            data={videoData.videosById.bloopers}
                            title="Bloopers"
                          />
                        )}{" "}
                      </>
                    )}
                    {data && (
                      <ModalSection
                        title="More Like This"
                        data={movies}
                        loading={status === "loading"}
                        hasMore={hasNextPage}
                        isFetching={isFetchingNextPage}
                        fetchMore={fetchNextPage}
                      >
                        <ExpandSlide />
                      </ModalSection>
                    )}
                  </>
                </div>
              )}
            </>
          }
        </div>
      </animated.div>
    </ModalWrapper>
  );
});

export default ParamCardModal;
