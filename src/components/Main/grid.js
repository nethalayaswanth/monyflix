import styled from "styled-components";
import { Loader } from "../spinner";

import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import Card from "../Card";
import { NotFound } from "../NotFound";
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
    rootMargin: "0px 0px 350px 0px",
    onChange: (inview) => {
      if (inview && !isFetching && hasNextPage) {
        fetchNextPage();
      }
    },
  });

  useScrollPosition({
    onScrollChange: ({ prevPos, currPos, scrolling }) => {
      if(!containerRef.current) return;
      const container = containerRef.current.style;

      container.pointerEvents = scrolling ? "none" : "auto";
    },
  });

  const placeHolder = Array(8).fill(0);

  const showLoader = hasNextPage && data && data.length > 0;

  if ((!isLoading) && (!data || data.length === 0 )){

    return <Container><NotFound/></Container>
  }
    return (
      <Container ref={containerRef}>
        <Filler />

        <GridView>
          {data && data.length !== 0
            ? data.map((movie, index) => {
                const loader = index === Math.max(0, data.length - 10);

                return (
                  <div
                    key={index}
                    {...(loader && { ref: inViewRef })}
                    style={{ zIndex: 3 }}
                  >
                    <Card
                      data={movie}
                      card={"potrait"}
                      cardExpand={true}
                      cardHover={true}
                    />
                  </div>
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
