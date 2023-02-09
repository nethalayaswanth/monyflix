import styled from "styled-components";
import { Loader } from "../spinner";

import { useLayoutEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import usePrevious from "../../hooks/usePrevious";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import Card from "../Card";
import { NotFound } from "../NotFound";

import { animated, useSprings } from "react-spring";

const Container = styled.div`
  margin-top: calc(-1 * var(--nav-height));

  min-height: 100vh;
`;

const Filler = styled.div`
  height: calc(2 * var(--nav-height));
  background-color: black;
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px 10px;
  padding: 0 var(--metaData-padding);
  padding-top: var(--metaData-padding);
  @media only screen and (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px 10px;
  }

  @media only screen and (min-width: 740px) {
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px 10px;
  }

  @media only screen and (min-width: 1000px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media only screen and (min-width: 1320px) {
    grid-template-columns: repeat(7, 1fr);
  }
  @media only screen and (min-width: 1500px) {
    grid-template-columns: repeat(8, 1fr);
  }
`;

export const calculateBoundingBoxes = (children) => {
  const boundingBoxes = {};
  children.forEach(([key, child]) => {
    const domNode = child;
    if (!domNode) return;
    const nodeBoundingBox = domNode.getBoundingClientRect();
    boundingBoxes[key] = nodeBoundingBox;
  });

  return boundingBoxes;
};

export default function Grid({
  data,
  fetchNextPage,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isLoading,
}) {
  const containerRef = useRef();

  const { ref: inViewRef } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 0px 0px",
    onChange: (inview,entry) => {
      

      if (inview && !isFetching && !isFetchingNextPage&& hasNextPage) {
        fetchNextPage();
      }
    },
  });


  useScrollPosition({
    onScrollChange: ({ prevPos, currPos, scrolling }) => {
      if (!containerRef.current) return;
      const container = containerRef.current.style;

      container.pointerEvents = scrolling ? "none" : "auto";
    },
  });

  const placeHolder = Array(8).fill(0);

  const showLoader =
    !isFetching &&
    !isFetchingNextPage &&
    hasNextPage &&
    data &&
    data.length > 0;

  const boxRefs = useRef({});
  const prevBoundingBoxes = useRef({});

  const refCb = (key,index) => (node) => {
    boxRefs.current[key] = node;
  };

  boxRefs.current = {};

  // const [props, api] = useSprings(data?data.length:0,() => ({
  //   x: 0,
  //   y: 0,
  //   opacity: 1,
  //   scale: 1,
  // }));

  // useLayoutEffect(() => {

  //   if (Object.keys(boxRefs.current).length === 0) return;
  //   const newBoundingBox = calculateBoundingBoxes(
  //     Object.entries(boxRefs.current)
  //   );

  //   // console.log(Object.keys(boxRefs.current),Object.keys(newBoundingBox));

  //   // if (
     
  //   //   Object.keys(boxRefs.current).length === 0
  //   // )
  //   //   return;

  //   const prevBoundingBox = prevBoundingBoxes.current;

  //   Object.entries(boxRefs.current).forEach(([key, child],index) => {
  //     const domNode = child;

  //     const prevBox = prevBoundingBox[key];
  //     const currentBox = newBoundingBox[key];

  //     // console.log(key,prevBox, currentBox);

  //     if (!prevBox) {
  //       // api.start((i)=>{
  //       //   if(i !==index)return
  //       // return{
  //       //   from: { x: 0, y: 0, scale: 0.5, opacity: 0 },
  //       //   to: { opacity: 1, scale: 1 },
  //       // }});
  //       return;
  //     }
  //     const changeInY = prevBox.top - currentBox.top;
  //     const changeInX = prevBox.left - currentBox.left;

  //     if (changeInY || changeInX) {
  //        api.start((i)=>{
  //           if (i !== index) return;
  //         return{
  //          from: { x: changeInX, y: changeInY, scale:1, opacity: 1 },
  //          to: {x:0,y:0, opacity: 1, scale: 1 },
  //        }});
  //     }
  //   });

  //   prevBoundingBoxes.current = newBoundingBox;
  // }, [api, data]);

  if (!isLoading && (!data || data.length === 0)) {
    return (
      <Container>
        <NotFound />
      </Container>
    );
  }

   
  return (
    <Container ref={containerRef}>
      <Filler />

      <GridView>
        {data && data.length !== 0
          ? data.map((movie, index) => {

          
              const loader = index === Math.max(0, data.length - 5);

            

              return (
                <animated.div
                  key={index}
                  ref={refCb(movie.id)}
                  style={{ zIndex: 3, }}
                >
                  <Card
                    data={movie}
                    card={"potrait"}
                    cardExpand={true}
                    cardHover={true}
                    {...(loader && { ref: inViewRef })}
                  />
                </animated.div>
              );
            })
          : placeHolder.map((_, index) => {
              return (
                <Card
                  card={"potrait"}
                  cardExpand={false}
                  cardHover={false}
                  key={index}
                />
              );
            })}
      </GridView>
      {showLoader && <Loader key={"loader"} />}
    </Container>
  );
}
