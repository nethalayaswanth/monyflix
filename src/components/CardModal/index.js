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
import Shimmer from "../shimmer";
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

const CardModal = forwardRef(({ style, width }, ref) => {
  const [
    {
      movie,
      param,
      activate,
      activated,
      miniExpand,
      miniExpanded,
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
  } = useGetSimilarMovies({ id: movie?.id || param });

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
  let [searchParams, setSearchParams] = useSearchParams();

  let location = useLocation();
  let navigate = useNavigate();

  const handleExpand = useCallback(
    (e) => {
      e.stopPropagation();
      setSearchParams(
        { mv: movie?.id },
        {
          state: { backgroundLocation: location, miniModal: true },
        }
      );
    },
    [location, movie, setSearchParams]
  );

  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      const param = searchParams.get("mv");

      if (param) {
        searchParams.delete("mv");
        setSearchParams(searchParams);
      }
    },
    [searchParams, setSearchParams]
  );

  const {
    isLoading,
    error: videoError,
    data: videoData,
    isFetching: videoFetching,
  } = useGetVideosById({
    id: movie?.id || param,
    types: ["CLIP", "TRAILER", "BLOOPERS", "BTS", "FEATURETTE"],
  });

  const id = useMemo(() => {
    if (!movieDetails) return null;
    const videos = movieDetails.movie.videos;
    if (!videos) return null;
    const clip = videos.clip[0];
    const trailer = videos.trailer[0];
    const teaser = videos.teaser[0];

    return clip ? clip.key : trailer ? trailer.key : teaser ? teaser.key : "";
  }, [movieDetails]);

  const current = movie || movieDetails?.movie;
  const year = current?.releaseDate.split("-")[0];

  const src = current
    ? `https://image.tmdb.org/t/p/original/${current?.posterPath}`
    : null;
  const backDropPath = current
    ? `https://image.tmdb.org/t/p/original/${current?.backdropPath}`
    : null;



  const [{ opacity }, api] = useSpring(() => {
    return {
      from: {
        opacity: 1,
      },
      to: {
        opacity: 0,
      },
    };
  });

  useLayoutEffect(() => {
    if (miniExpand && activate) {
      api.start();
      
    }
    if (!miniExpand && !activate) {
      console.log("adnkahjd");
      api.start({ reverse: true });
    }
  }, [activate, api, miniExpand]);

  useLayoutEffect(() => {
    if(expand && expanded) return
     if (!miniExpand && expand) {
      
       api.start({opacity:0});
     }
    if (!expand && expanded) {
       console.log("kingis");
      api.start({
        
          opacity: 1,
        
      });
    }
  }, [api, expand, expanded, miniExpand]);

  const handleSimilarMovieclick = useCallback(() => {
    dispatch({ type: "set reset" });
  }, [dispatch]);
  
  return (
    <ModalWrapper ref={ref} id="card-modal">
      <animated.div
        style={{
          
          opacity: opacity,

          ...(expand && { position: "absolute", top: 0,
          left: 0,
          width: "100%",
          height: "max-content", }),
        }}
      >
        <AspectBox potrait>
          <Image src={src} alt={``} />
        </AspectBox>
      </animated.div>
      <animated.div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: opacity.to({ range: [1.0, 0.0], output: [0, 1] }),
          ...(!expand && { position: "absolute" }),
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
                  playOnMount={true}
                />
              )}
            </animated.div>
          </div>

          <AspectBox style={{ zIndex: 1 }}>
            <Shimmer
              style={{ width: "100%", height: "100%", Zindex: 5 }}
              src={backDropPath}
              alt={``}
            />
          </AspectBox>
        </>

        {(expand || expanded) && (
          <CloseButton onClick={handleClose}>
            <Close style={{ fill: "white" }} />
          </CloseButton>
        )}
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
              <Content >
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
                {!(expand || expanded) && (
                  <div>
                    <Divider />
                    <Open>
                      <Up onClick={handleExpand} />
                    </Open>
                  </div>
                )}
              </Content>
              {videoData && (expand || expanded) && (
                <div style={{ flexGrow: 2, flexShrink: 0, flexBasis: "auto" }}>
                  {videoData.videosById.clip.length !== 0 && (
                    <ModalSection
                      data={videoData.videosById.clip}
                      title="Clips"
                    />
                  )}
                  {videoData.videosById.trailer.length !== 0 && (
                    <ModalSection
                      data={videoData.videosById.trailer}
                      title="Trailers"
                    />
                  )}
                  {videoData.videosById.bts.length !== 0 && (
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
                      <ExpandSlide onClick={handleSimilarMovieclick} />
                    </ModalSection>
                  )}
                </div>
              )}
            </>
          }
        </div>
      </animated.div>
    </ModalWrapper>
  );
});

export default CardModal;
