

import React, { memo, useCallback, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import {
  useMovies, useMoviesByGenre, useTrendingMovies
} from "../../requests/requests";
import Carousel from "../Carousel";
import Divider from "../Divider";
import Header from "../Header";

const Container = styled.div`
  width: 100%;
  padding: 0;
  z-index: 1;
`;


const queryHandlers = {
  moviesByType: useMovies,
  trendingMovies: useTrendingMovies,
  moviesByGenre: useMoviesByGenre,
}

export const Wrapper = memo(
  ({
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    title,
    children,
    isLoading,
    variables,
    refCb,
    ...props
  }) => {
   
    return (
      <Container ref={refCb}>
        <Header pathVariables={variables} title={title} />
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <Carousel
            data={data}
            loading={isLoading}
            hasMore={hasNextPage}
            isFetching={isFetchingNextPage}
            fetchMore={fetchNextPage}
            title={title}
            {...props}
          >
            {children && children}
          </Carousel>
        </div>
        <Divider />
      </Container>
    );
  }
);

export default Wrapper;




export const SectionWrapper = ({
  children,
  variables,
  queryEnabled=true,
  whileInView=true,
  titlePoster,
  card,
  ...props
}) => {
  const {
    ref: inViewRef,
    inView,
    entry,
  } = useInView({
    threshold: 0.1,
    // rootMargin: "0px 0px 350px 0px",
    triggerOnce: true,
  });

  const refCb = useCallback(
    (node) => {
      if (node) {
        inViewRef(node);
      }
    },
    [inViewRef]
  );


  const fetchQuery = queryEnabled
    ? whileInView
      ? inView
      : queryEnabled
    : false;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
  } = useMovies({
    ...variables,
    queryOptions: { enabled: !!fetchQuery },
  });

  const movies = useMemo(() => {
    if (data) {
      var list = [];
      data.pages.forEach((page, i) => {
        if (!page) return;
        const { data } = page;
        list = [...list, ...data];
      });
      return list;
    }
    return [];
  }, [data]);

  return (
    <Wrapper
      {...{
        data: movies,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
        status,
        variables,
      }}
      refCb={refCb}
      card={card}
      {...props}
    >
      {children && children}
    </Wrapper>
  );
};

export const Section = memo((props) => {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary, error }) => {
        console.warn(error)
        return (
          <div>
            There was an error!
            <button onClick={() => resetErrorBoundary()}>Try again</button>
          </div>
        );
      }}
    >
      <SectionWrapper {...props} />
    </ErrorBoundary>
  );
});


